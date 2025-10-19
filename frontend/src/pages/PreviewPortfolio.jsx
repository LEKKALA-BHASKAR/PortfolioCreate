import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download, Palette, Eye, Share2, Zap, Sparkles, Code, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PreviewPortfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { portfolioId, data, template } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll listener for section highlighting
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data || !portfolioId) {
    navigate('/create');
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`${API}/download-portfolio/${portfolioId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.name.replace(/\s+/g, '_')}_portfolio.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: '🎉 Download Complete!',
        description: 'Your portfolio is ready to deploy.',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive'
      });
    }
    setIsDownloading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name}'s Portfolio`,
          text: `Check out ${data.name}'s professional portfolio`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Portfolio link copied to clipboard',
      });
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-40 animate-float-delayed"></div>
      </div>

      {/* Enhanced Control Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/create')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Editor</span>
            </Button>

            {/* Navigation Dots */}
            <div className="hidden md:flex items-center space-x-3">
              {['hero', 'about', 'skills', 'projects', 'experience', 'education'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === section 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={section.charAt(0).toUpperCase() + section.slice(1)}
                />
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{template?.name}</span>
              </div>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg group"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Download ZIP
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Preview Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
            </div>
            <h2 className="text-4xl font-light mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your Portfolio Preview
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              This is how your portfolio will look. Download the complete code to deploy anywhere.
            </p>
          </div>

          {/* Portfolio Preview - Enhanced Design */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm">
            {/* Hero Section */}
            <section id="hero" className="relative py-32 px-12 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-pink-500/20 rounded-full blur-lg"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-light">Professional Portfolio</span>
                </div>
                
                <h1 className="text-7xl font-extralight mb-6 leading-tight">
                  {data.name}
                </h1>
                <p className="text-2xl text-gray-300 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                  {data.title}
                </p>
                
                <div className="flex items-center justify-center space-x-8 text-lg text-gray-300 font-light">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{data.email}</span>
                  </span>
                  {data.phone && (
                    <>
                      <span className="text-white/30">•</span>
                      <span>{data.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-12 bg-gradient-to-br from-white to-gray-50/50">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-light">01</span>
                  </div>
                  <h2 className="text-4xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    About Me
                  </h2>
                </div>
                <p className="text-xl text-gray-600 font-light leading-relaxed text-center">
                  {data.about}
                </p>
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-24 px-12 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-light">02</span>
                  </div>
                  <h2 className="text-4xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Skills & Expertise
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl text-base font-light shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                      {skill.name}
                      <Zap className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-24 px-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-light">03</span>
                  </div>
                  <h2 className="text-4xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Featured Projects
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {data.projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 group hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-light mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 font-light mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.split(',').map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-300 group/link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>View Project</span>
                          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-24 px-12 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-light">04</span>
                  </div>
                  <h2 className="text-4xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Work Experience
                  </h2>
                </div>
                <div className="space-y-12">
                  {data.experience.map((exp, index) => (
                    <div 
                      key={index} 
                      className="flex space-x-6 group hover:bg-gray-50/50 rounded-3xl p-6 transition-all duration-500"
                    >
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-light text-gray-800 mb-1">{exp.position}</h3>
                            <p className="text-lg text-gray-600 font-light">{exp.company}</p>
                          </div>
                          <span className="text-gray-500 font-light bg-gray-100 px-4 py-2 rounded-full text-sm mt-2 md:mt-0">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 font-light leading-relaxed text-lg">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="py-24 px-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-light">05</span>
                  </div>
                  <h2 className="text-4xl font-light bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Education
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {data.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 group hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-lg font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-2xl font-light mb-2 text-gray-800">{edu.degree}</h3>
                      <p className="text-lg text-gray-600 font-light mb-3">{edu.institution}</p>
                      <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                        {edu.year}
                      </span>
                      {edu.description && (
                        <p className="text-gray-600 font-light leading-relaxed text-sm">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-12 text-center border-t border-gray-200/50 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {data.name}
                </h3>
                <p className="text-gray-600 font-light mb-6 max-w-md mx-auto">
                  Thank you for visiting my portfolio. Let's create something amazing together.
                </p>
                <p className="text-sm text-gray-500 font-light">
                  © 2025 {data.name}. All rights reserved. • Crafted with PortfolioAI
                </p>
              </div>
            </footer>
          </div>

          {/* Download CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-light mb-4">Ready to Go Live?</h3>
              <p className="text-gray-300 font-light mb-6 max-w-2xl mx-auto">
                Download your complete portfolio code and deploy it instantly on Vercel, Netlify, or any hosting platform.
              </p>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {isDownloading ? 'Preparing Download...' : 'Download Complete Code'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

export default PreviewPortfolio;