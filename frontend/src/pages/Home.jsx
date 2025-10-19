import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Zap, Download, Star, ChevronDown, Play } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-green-to-br from-slate-50 via-black to-slate-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-60 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-200 via-teal-200 to-emerald-200 rounded-full blur-3xl opacity-60 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-blue/70 backdrop-blur-lg border-b border-slate-100 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl font-light tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              PortfolioAI
            </h1>
          </div>
          <Button 
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-light text-slate-600 group-hover:text-slate-800 transition-colors">
              AI-Powered Portfolio Generation
            </span>
            <Star className="w-4 h-4 text-amber-400 ml-2 fill-current" />
          </div>

          {/* Main heading with gradient animation */}
          <div className="relative mb-8">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight leading-none mb-8">
              <span className="block">Your story,</span>
              <span className="block italic bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                visualized.
              </span>
            </h2>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-20 animate-bounce-delayed"></div>
          </div>

          <p className="text-xl font-light text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform your resume into a stunning portfolio website with AI-enhanced content, 
            professional templates, and instant deployment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Button 
              onClick={() => navigate('/create')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base px-8 py-6 group"
            >
              <span className="flex items-center">
                Create Portfolio
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={scrollToHowItWorks}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 text-base px-8 py-6 group"
            >
              <span className="flex items-center">
                <Play className="w-4 h-4 mr-2 transform group-hover:scale-110 transition-transform" />
                See How It Works
              </span>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div 
            onClick={scrollToHowItWorks}
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="text-sm font-light text-slate-500 mb-2 group-hover:text-slate-700 transition-colors">
              Discover More
            </span>
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600 animate-bounce transition-colors" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Why Choose PortfolioAI?
            </h2>
            <p className="text-lg font-light text-slate-600 max-w-2xl mx-auto">
              Everything you need to create a professional portfolio that stands out
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Enhancement",
                description: "Gemini AI analyzes and optimizes your content for maximum impact and clarity.",
                gradient: "from-indigo-500 via-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Professional Templates",
                description: "Choose from carefully crafted templates designed for different professions.",
                gradient: "from-cyan-500 via-teal-500 to-emerald-500"
              },
              {
                icon: Download,
                title: "Ready to Deploy",
                description: "Download complete source code and deploy instantly on Vercel or GitHub Pages.",
                gradient: "from-amber-500 via-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full group-hover:from-slate-400 group-hover:to-slate-500 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-lg font-light text-slate-600">
              Simple steps to your perfect portfolio
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Enter Your Details",
                description: "Fill in your information including education, skills, projects, and experience."
              },
              {
                step: "2",
                title: "AI Optimization",
                description: "Our AI analyzes your content and suggests improvements for better presentation."
              },
              {
                step: "3",
                title: "Choose Template",
                description: "Select from professional templates tailored to your profession and style."
              },
              {
                step: "4",
                title: "Download & Deploy",
                description: "Get your complete portfolio as static files, ready to host anywhere."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-start space-x-6 group hover:bg-white/50 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-light transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light mb-3 text-slate-800 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed group-hover:text-slate-700 transition-colors">
                    {item.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-6 h-6 text-slate-400 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl font-light text-indigo-100 mb-12 max-w-2xl mx-auto">
            Create your professional portfolio in minutes and stand out from the crowd.
          </p>
          <Button 
            onClick={() => navigate('/create')}
            size="lg"
            className="bg-gradient-to-r from-white to-slate-100 text-indigo-900 hover:from-slate-100 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl text-base px-10 py-7 group font-medium"
          >
            <span className="flex items-center">
              Create Your Portfolio Now
              <ArrowRight className="ml-3 w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-sm text-indigo-200">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-emerald-400 fill-current mr-1" />
              <span>Set up in 5 minutes</span>
            </div>
            <div className="flex items-center">
              <Download className="w-4 h-4 text-cyan-400 fill-current mr-1" />
              <span>Free to try</span>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default Home;