from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Education(BaseModel):
    institution: str
    degree: str
    year: str
    description: Optional[str] = ""

class Skill(BaseModel):
    name: str
    level: Optional[str] = "intermediate"
    description: Optional[str] = ""

class Project(BaseModel):
    title: str
    description: str
    technologies: Optional[str] = ""
    link: Optional[str] = ""

class Experience(BaseModel):
    company: str
    position: str
    duration: str
    description: str

class PortfolioData(BaseModel):
    name: str
    title: str
    email: str
    phone: Optional[str] = ""
    about: str
    education: List[Education]
    skills: List[Skill]
    projects: List[Project]
    experience: List[Experience]

class Portfolio(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    email: str
    phone: Optional[str] = ""
    about: str
    education: List[Education]
    skills: List[Skill]
    projects: List[Project]
    experience: List[Experience]
    selectedTemplate: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class EnhanceRequest(BaseModel):
    name: str
    title: str
    about: str
    skills: List[Skill]
    projects: List[Project]
    experience: List[Experience]

class GenerateRequest(BaseModel):
    data: PortfolioData
    template: str