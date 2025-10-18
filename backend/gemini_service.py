import google.generativeai as genai
import os
import json
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    async def enhance_portfolio_content(self, data: dict) -> dict:
        """Use Gemini AI to enhance portfolio content"""
        try:
            prompt = f"""
You are a professional career advisor and content writer. Analyze the following portfolio information and enhance it for maximum impact.

Name: {data.get('name', '')}
Title: {data.get('title', '')}
About: {data.get('about', '')}

Skills: {', '.join([s.get('name', '') for s in data.get('skills', [])])}

Projects:
{self._format_projects(data.get('projects', []))}

Experience:
{self._format_experience(data.get('experience', []))}

Provide the following in JSON format:
1. Enhanced 'about' section (2-3 sentences, professional and impactful)
2. For each skill, add a brief 'description' (one short phrase about proficiency)
3. For each project, enhance the 'description' with quantifiable achievements and impact
4. Provide 2-3 actionable 'suggestions' for improvement

Return ONLY valid JSON in this exact format:
{{
  "about": "enhanced about text",
  "skills": [
    {{"name": "skill name", "description": "brief description"}}
  ],
  "projects": [
    {{"title": "project title", "description": "enhanced description"}}
  ],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}}
"""
            
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if result_text.startswith('```'):
                result_text = result_text.split('```')[1]
                if result_text.startswith('json'):
                    result_text = result_text[4:]
                result_text = result_text.strip()
            
            enhanced_data = json.loads(result_text)
            logger.info("Successfully enhanced portfolio content with Gemini")
            return enhanced_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.error(f"Response text: {result_text}")
            # Return original data with minor enhancements
            return self._fallback_enhancement(data)
        except Exception as e:
            logger.error(f"Error enhancing content with Gemini: {e}")
            return self._fallback_enhancement(data)
    
    def _format_projects(self, projects: list) -> str:
        """Format projects for the prompt"""
        if not projects:
            return "No projects provided"
        formatted = []
        for i, project in enumerate(projects, 1):
            formatted.append(f"{i}. {project.get('title', 'Untitled')}: {project.get('description', 'No description')}")
        return "\n".join(formatted)
    
    def _format_experience(self, experience: list) -> str:
        """Format experience for the prompt"""
        if not experience:
            return "No experience provided"
        formatted = []
        for i, exp in enumerate(experience, 1):
            formatted.append(f"{i}. {exp.get('position', 'Position')} at {exp.get('company', 'Company')}: {exp.get('description', 'No description')}")
        return "\n".join(formatted)
    
    def _fallback_enhancement(self, data: dict) -> dict:
        """Fallback enhancement if AI fails"""
        return {
            "about": data.get('about', '') + " Passionate professional with proven expertise in delivering high-quality results.",
            "skills": [{"name": s.get('name', ''), "description": f"Proficient in {s.get('name', '')}"} for s in data.get('skills', [])],
            "projects": [{"title": p.get('title', ''), "description": p.get('description', '') + " Delivered with attention to detail and best practices."} for p in data.get('projects', [])],
            "suggestions": [
                "Consider adding quantifiable achievements to your projects",
                "Include specific technologies and tools in your experience",
                "Highlight leadership and collaboration skills"
            ]
        }