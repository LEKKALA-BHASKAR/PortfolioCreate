import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { ArrowLeft, Download, Palette } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PreviewPortfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { portfolioId, data, template } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);

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
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.name.replace(/\s+/g, '_')}_portfolio.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download Complete!',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/create')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Template: {template?.name}</span>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Preparing...' : 'Download ZIP'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Portfolio Preview - Minimal Professional Template */}
            <div className="bg-white">
              {/* Hero */}
              <section className="py-24 px-12 text-center">
                <h1 className="text-6xl font-extralight mb-4">{data.name}</h1>
                <p className="text-2xl text-gray-600 font-light mb-8">{data.title}</p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <span>{data.email}</span>
                  {data.phone && <span>•</span>}
                  {data.phone && <span>{data.phone}</span>}
                </div>
              </section>

              {/* About */}
              <section className="py-16 px-12 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-light mb-6">About</h2>
                  <p className="text-gray-600 font-light leading-relaxed">{data.about}</p>
                </div>
              </section>

              {/* Skills */}
              <section className="py-16 px-12">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-light mb-8">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-black text-white rounded-full text-sm font-light"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Projects */}
              <section className="py-16 px-12 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-light mb-8">Projects</h2>
                  <div className="space-y-8">
                    {data.projects.map((project, index) => (
                      <div key={index} className="border-l-2 border-black pl-6">
                        <h3 className="text-xl font-light mb-2">{project.title}</h3>
                        <p className="text-gray-600 font-light mb-2">{project.description}</p>
                        {project.technologies && (
                          <p className="text-sm text-gray-500 mb-2">Tech: {project.technologies}</p>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            className="text-sm underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Experience */}
              <section className="py-16 px-12">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-light mb-8">Experience</h2>
                  <div className="space-y-8">
                    {data.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-light">{exp.position}</h3>
                            <p className="text-gray-600 font-light">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-gray-600 font-light">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Education */}
              <section className="py-16 px-12 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-light mb-8">Education</h2>
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-light">{edu.degree}</h3>
                            <p className="text-gray-600 font-light">{edu.institution}</p>
                          </div>
                          <span className="text-sm text-gray-500">{edu.year}</span>
                        </div>
                        {edu.description && (
                          <p className="text-gray-600 font-light text-sm">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-12 px-12 text-center border-t border-gray-200">
                <p className="text-sm text-gray-600 font-light">
                  © 2025 {data.name}. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPortfolio;