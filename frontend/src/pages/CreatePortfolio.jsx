import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles, Zap, Palette, User, GraduationCap, Code, Briefcase, Layout } from 'lucide-react';
import { mockTemplates } from '../mock';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    about: '',
    education: [{ institution: '', degree: '', year: '', description: '' }],
    skills: [{ name: '', level: 'intermediate' }],
    projects: [{ title: '', description: '', technologies: '', link: '' }],
    experience: [{ company: '', position: '', duration: '', description: '' }]
  });

  const addItem = (field) => {
    const templates = {
      education: { institution: '', degree: '', year: '', description: '' },
      skills: { name: '', level: 'intermediate' },
      projects: { title: '', description: '', technologies: '', link: '' },
      experience: { company: '', position: '', duration: '', description: '' }
    };
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const response = await axios.post(`${API}/enhance-content`, {
        name: formData.name,
        title: formData.title,
        about: formData.about,
        skills: formData.skills,
        projects: formData.projects,
        experience: formData.experience
      });
      
      if (response.data.success) {
        const enhanced = response.data.enhanced;
        
        setFormData(prev => ({
          ...prev,
          about: enhanced.about || prev.about,
          skills: enhanced.skills || prev.skills,
          projects: enhanced.projects || prev.projects
        }));
        
        toast({
          title: '✨ Content Enhanced!',
          description: 'AI has optimized your portfolio content.',
        });
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: 'Enhancement Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive'
      });
    }
    setIsEnhancing(false);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast({
        title: 'Select a Template',
        description: 'Please choose a template before generating.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API}/generate-portfolio`, {
        data: formData,
        template: selectedTemplate.id
      });
      
      if (response.data.success) {
        toast({
          title: '🎉 Portfolio Generated!',
          description: response.data.message,
        });
        navigate('/preview', { 
          state: { 
            portfolioId: response.data.portfolioId,
            data: formData, 
            template: selectedTemplate 
          } 
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive'
      });
    }
    setIsGenerating(false);
  };

  const stepIcons = [User, GraduationCap, Zap, Code, Briefcase, Layout];
  const stepColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-gray-700 to-gray-900'
  ];

  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Tell us about yourself</h3>
        <p className="text-gray-600 font-light">Let's start with the basics</p>
      </div>

      <div className="grid gap-6">
        <div className="group">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
            Full Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 group-hover:shadow-md"
          />
        </div>

        <div className="group">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
            Professional Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Full Stack Developer"
            className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 group-hover:shadow-md"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md"
            />
          </div>
          <div className="group">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md"
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="about" className="text-sm font-medium text-gray-700 mb-2 block">
            About / Bio *
          </Label>
          <Textarea
            id="about"
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            placeholder="Tell us about yourself, your expertise, and what drives you professionally..."
            className="min-h-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 group-hover:shadow-md resize-vertical"
          />
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Your Education</h3>
        <p className="text-gray-600 font-light">Add your academic background</p>
      </div>

      <div className="space-y-6">
        {formData.education.map((edu, index) => (
          <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
                <h3 className="text-lg font-light text-gray-800">Education {index + 1}</h3>
              </div>
              {formData.education.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem('education', index)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                  placeholder="University Name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateItem('education', index, 'year', e.target.value)}
                    placeholder="2020 - 2024"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
              </div>
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                <Textarea
                  value={edu.description}
                  onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                  placeholder="Relevant coursework, achievements, honors..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:shadow-md resize-vertical"
                />
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => addItem('education')}
          className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Add Education
        </Button>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Your Skills</h3>
        <p className="text-gray-600 font-light">Showcase your technical abilities</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {formData.skills.map((skill, index) => (
            <Card key={index} className="p-4 border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                    placeholder="Skill name (e.g., React, Python, Design)"
                    className="border-0 bg-transparent focus:ring-0 text-lg font-light placeholder-gray-400 p-0"
                  />
                </div>
                {formData.skills.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem('skills', index)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => addItem('skills')}
          className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50/50 text-gray-600 hover:text-green-600 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Add Skill
        </Button>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Code className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Your Projects</h3>
        <p className="text-gray-600 font-light">Highlight your best work</p>
      </div>

      <div className="space-y-6">
        {formData.projects.map((project, index) => (
          <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
                <h3 className="text-lg font-light text-gray-800">Project {index + 1}</h3>
              </div>
              {formData.projects.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem('projects', index)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Project Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => updateItem('projects', index, 'title', e.target.value)}
                  placeholder="Project Name"
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 group-hover:shadow-md"
                />
              </div>
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                  placeholder="What did you build? What problem does it solve? What technologies did you use?"
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 group-hover:shadow-md resize-vertical min-h-24"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Technologies</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateItem('projects', index, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB, etc."
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Link</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                    placeholder="https://your-project.com"
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => addItem('projects')}
          className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50/50 text-gray-600 hover:text-orange-600 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Add Project
        </Button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Work Experience</h3>
        <p className="text-gray-600 font-light">Share your professional journey</p>
      </div>

      <div className="space-y-6">
        {formData.experience.map((exp, index) => (
          <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
                <h3 className="text-lg font-light text-gray-800">Experience {index + 1}</h3>
              </div>
              {formData.experience.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem('experience', index)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
                <div className="group">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                    placeholder="Job Title"
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md"
                  />
                </div>
              </div>
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateItem('experience', index, 'duration', e.target.value)}
                  placeholder="Jan 2020 - Present"
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md"
                />
              </div>
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                  placeholder="Your responsibilities, achievements, and key contributions..."
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md resize-vertical min-h-24"
                />
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => addItem('experience')}
          className="w-full h-14 border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-gray-600 hover:text-indigo-600 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Add Experience
        </Button>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Layout className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-light text-gray-800 mb-2">Choose Your Template</h3>
        <p className="text-gray-600 font-light">Select a design that matches your style and profession</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-500 overflow-hidden border-0 group ${
              selectedTemplate?.id === template.id 
                ? 'ring-3 ring-purple-500 shadow-2xl scale-105' 
                : 'shadow-lg hover:shadow-2xl hover:scale-105'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="relative overflow-hidden">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-gray-50/50">
              <h4 className="text-lg font-light text-gray-800 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 font-light leading-relaxed">{template.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {template.category}
                </span>
                <span className="text-sm text-gray-500">{template.pages} pages</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Info', render: renderBasicInfo },
    { number: 2, title: 'Education', render: renderEducation },
    { number: 3, title: 'Skills', render: renderSkills },
    { number: 4, title: 'Projects', render: renderProjects },
    { number: 5, title: 'Experience', render: renderExperience },
    { number: 6, title: 'Template', render: renderTemplateSelection }
  ];

  const CurrentIcon = stepIcons[step - 1];
  const currentColor = stepColors[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Animated Background */}
       <br/>
        <br/>
         <br/>
        <br/>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40 animate-float-delayed"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              PortfolioAI
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = stepIcons[index];
              const isCompleted = step > s.number;
              const isCurrent = step === s.number;
              
              return (
                <React.Fragment key={s.number}>
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? `bg-gradient-to-r ${stepColors[index]} shadow-lg scale-110` 
                        : isCurrent
                        ? `bg-gradient-to-r ${stepColors[index]} shadow-lg scale-110 ring-4 ring-opacity-20 ${stepColors[index].split(' ')[1].replace('to-', 'ring-')}`
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <Icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                      )}
                    </div>
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      isCurrent ? 'text-gray-800' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                      step > s.number ? `bg-gradient-to-r ${stepColors[index]} ${stepColors[index + 1]}` : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
         
            <h2 className="text-4xl font-light mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {steps[step - 1].title}
            </h2>
          
          </div>

          <Card className="p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            {steps[step - 1].render()}
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              {step < 6 && (
                <Button
                  variant="outline"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 hover:text-purple-700 transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              )}
              
              {step < 6 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className={`bg-gradient-to-r ${currentColor} text-white hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedTemplate}
                  className="bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Portfolio
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CreatePortfolio;