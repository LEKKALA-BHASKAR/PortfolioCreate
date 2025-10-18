from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import uuid
from datetime import datetime
import io

from models import (
    Portfolio, PortfolioData, EnhanceRequest, 
    GenerateRequest, Education, Skill, Project, Experience
)
from gemini_service import GeminiService
from template_generator import TemplateGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
gemini_service = GeminiService()
template_generator = TemplateGenerator()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "PortfolioAI Backend - Ready"}

@api_router.post("/enhance-content")
async def enhance_content(request: EnhanceRequest):
    """Enhance portfolio content using Gemini AI"""
    try:
        # Convert to dict for Gemini service
        data = {
            'name': request.name,
            'title': request.title,
            'about': request.about,
            'skills': [{'name': s.name, 'level': s.level} for s in request.skills],
            'projects': [{'title': p.title, 'description': p.description} for p in request.projects],
            'experience': [{'position': e.position, 'company': e.company, 'description': e.description} for e in request.experience]
        }
        
        enhanced = await gemini_service.enhance_portfolio_content(data)
        
        return {
            'success': True,
            'enhanced': enhanced
        }
    except Exception as e:
        logger.error(f"Error enhancing content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/generate-portfolio")
async def generate_portfolio(request: GenerateRequest):
    """Generate and save portfolio"""
    try:
        # Create portfolio document
        portfolio_data = request.data.dict()
        portfolio = Portfolio(
            **portfolio_data,
            selectedTemplate=request.template
        )
        
        # Save to MongoDB
        await db.portfolios.insert_one(portfolio.dict())
        
        logger.info(f"Portfolio created with ID: {portfolio.id}")
        
        return {
            'success': True,
            'portfolioId': portfolio.id,
            'message': 'Portfolio generated successfully'
        }
    except Exception as e:
        logger.error(f"Error generating portfolio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/portfolio/{portfolio_id}")
async def get_portfolio(portfolio_id: str):
    """Get portfolio by ID"""
    try:
        portfolio = await db.portfolios.find_one({'id': portfolio_id})
        if not portfolio:
            raise HTTPException(status_code=404, detail='Portfolio not found')
        
        # Remove MongoDB _id field
        portfolio.pop('_id', None)
        
        return {
            'success': True,
            'portfolio': portfolio
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching portfolio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/download-portfolio/{portfolio_id}")
async def download_portfolio(portfolio_id: str):
    """Generate and download portfolio as ZIP"""
    try:
        # Fetch portfolio from database
        portfolio = await db.portfolios.find_one({'id': portfolio_id})
        if not portfolio:
            raise HTTPException(status_code=404, detail='Portfolio not found')
        
        # Remove MongoDB _id
        portfolio.pop('_id', None)
        
        # Generate ZIP
        zip_bytes = template_generator.generate_zip(portfolio, portfolio['selectedTemplate'])
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type='application/zip',
            headers={
                'Content-Disposition': f'attachment; filename="{portfolio["name"].replace(" ", "_")}_portfolio.zip"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error downloading portfolio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()