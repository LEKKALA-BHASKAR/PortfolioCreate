// Mock data for portfolio generator

export const mockTemplates = [
  {
    id: 'minimal-professional',
    name: 'Minimal Professional',
    description: 'Clean, corporate-friendly design perfect for professionals',
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    category: 'professional'
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Vibrant and unique design for designers and artists',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    category: 'creative'
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Sleek, technical design for developers and engineers',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    category: 'technical'
  }
];

export const mockAIEnhancement = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        enhanced: {
          ...data,
          about: data.about + ' Enhanced with AI: Professional summary optimized for impact.',
          skills: data.skills.map(skill => ({
            ...skill,
            description: `Expert level proficiency in ${skill.name}`
          })),
          projects: data.projects.map(project => ({
            ...project,
            description: project.description + ' (AI-enhanced for clarity and impact)'
          }))
        },
        suggestions: [
          'Consider adding more quantifiable achievements',
          'Your skills section could benefit from proficiency levels',
          'Projects show strong technical depth'
        ]
      });
    }, 2000);
  });
};

export const mockGeneratePortfolio = (data, template) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        portfolioUrl: '/preview',
        downloadReady: true,
        message: 'Portfolio generated successfully!'
      });
    }, 1500);
  });
};

export const mockDownloadZip = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        fileName: 'my-portfolio.zip',
        message: 'Download will start shortly'
      });
    }, 1000);
  });
};