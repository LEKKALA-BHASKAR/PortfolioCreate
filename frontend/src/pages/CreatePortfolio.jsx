import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { mockTemplates, mockAIEnhancement, mockGeneratePortfolio } from '../mock';
import { useToast } from '../hooks/use-toast';

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
      const result = await mockAIEnhancement(formData);
      if (result.success) {
        toast({
          title: 'Content Enhanced!',
          description: 'AI has optimized your portfolio content.',
        });
        setFormData(result.enhanced);
      }
    } catch (error) {
      toast({
        title: 'Enhancement Failed',
        description: 'Please try again.',
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
      const result = await mockGeneratePortfolio(formData, selectedTemplate);
      if (result.success) {
        toast({
          title: 'Portfolio Generated!',
          description: result.message,
        });
        navigate('/preview', { state: { data: formData, template: selectedTemplate } });
      }
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
    setIsGenerating(false);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="title">Professional Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Full Stack Developer"
          className="mt-2"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 234 567 8900"
            className="mt-2"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="about">About / Bio *</Label>
        <Textarea
          id="about"
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          placeholder="Tell us about yourself, your expertise, and what drives you..."
          className="mt-2 min-h-32"
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {formData.education.map((edu, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem('education', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                placeholder="University Name"
                className="mt-2"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateItem('education', index, 'year', e.target.value)}
                  placeholder="2020 - 2024"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={edu.description}
                onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                placeholder="Relevant coursework, achievements..."
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addItem('education')}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {formData.skills.map((skill, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={skill.name}
                onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                placeholder="Skill name"
              />
              {formData.skills.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem('skills', index)}
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
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Skill
      </Button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {formData.projects.map((project, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light">Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem('projects', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Project Title</Label>
              <Input
                value={project.title}
                onChange={(e) => updateItem('projects', index, 'title', e.target.value)}
                placeholder="Project Name"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                placeholder="What did you build? What problem does it solve?"
                className="mt-2"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Technologies</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateItem('projects', index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                  placeholder="https://..."
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addItem('projects')}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {formData.experience.map((exp, index) => (
        <Card key={index} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem('experience', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                  placeholder="Company Name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                  placeholder="Job Title"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={exp.duration}
                onChange={(e) => updateItem('experience', index, 'duration', e.target.value)}
                placeholder="Jan 2020 - Present"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                placeholder="Your responsibilities and achievements..."
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addItem('experience')}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-light mb-2">Choose Your Template</h3>
        <p className="text-gray-600 font-light">Select a design that matches your style</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-300 overflow-hidden ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-black' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h4 className="text-lg font-light mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 font-light">{template.description}</p>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-light">PortfolioAI</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step >= s.number ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.number}
                  </div>
                  <span className="text-xs mt-1 font-light hidden md:block">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step > s.number ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-light mb-2">{steps[step - 1].title}</h2>
            <p className="text-gray-600 font-light">Step {step} of {steps.length}</p>
          </div>

          {steps[step - 1].render()}

          {/* Actions */}
          <div className="flex items-center justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              {step < 6 && (
                <Button
                  variant="outline"
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="border-black"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              )}
              
              {step < 6 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isGenerating ? 'Generating...' : 'Generate Portfolio'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;