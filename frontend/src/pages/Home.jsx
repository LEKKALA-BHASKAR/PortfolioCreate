import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Zap, Download } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-xl font-light tracking-tight">PortfolioAI</h1>
          </div>
          <Button 
            onClick={() => navigate('/create')}
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gray-50 rounded-full text-sm font-light text-gray-600">
            AI-Powered Portfolio Generation
          </div>
          <h2 className="text-7xl md:text-8xl font-extralight tracking-tight mb-8 leading-none">
            Your story,
            <br />
            <span className="italic">visualized.</span>
          </h2>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform your resume into a stunning portfolio website.
            AI-enhanced content, professional templates, ready to deploy.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              onClick={() => navigate('/create')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 transition-all duration-300 text-base px-8 py-6"
            >
              Create Portfolio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="border-black text-black hover:bg-gray-50 transition-all duration-300 text-base px-8 py-6"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light mb-4">AI Enhancement</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Gemini AI analyzes and optimizes your content for maximum impact and clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light mb-4">Professional Templates</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Choose from carefully crafted templates designed for different professions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-light mb-4">Ready to Deploy</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Download complete source code and deploy instantly on Vercel or GitHub Pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-light text-center mb-16">How it works</h2>
          <div className="space-y-12">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-light">
                1
              </div>
              <div>
                <h3 className="text-2xl font-light mb-2">Enter Your Details</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Fill in your information including education, skills, projects, and experience.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-light">
                2
              </div>
              <div>
                <h3 className="text-2xl font-light mb-2">AI Optimization</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Our AI analyzes your content and suggests improvements for better presentation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-light">
                3
              </div>
              <div>
                <h3 className="text-2xl font-light mb-2">Choose Template</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Select from professional templates tailored to your profession and style.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-light">
                4
              </div>
              <div>
                <h3 className="text-2xl font-light mb-2">Download & Deploy</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Get your complete portfolio as static files, ready to host anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-6">Ready to get started?</h2>
          <p className="text-xl font-light text-gray-300 mb-12">
            Create your professional portfolio in minutes.
          </p>
          <Button 
            onClick={() => navigate('/create')}
            size="lg"
            className="bg-white text-black hover:bg-gray-100 transition-all duration-300 text-base px-8 py-6"
          >
            Create Your Portfolio
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-light text-gray-600">
            © 2025 PortfolioAI. Powered by Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;