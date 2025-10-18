import os
import zipfile
import io
from typing import Dict

class TemplateGenerator:
    """Generate static HTML portfolio templates"""
    
    def generate_html(self, portfolio: Dict, template: str) -> str:
        """Generate HTML based on template choice"""
        if template == 'minimal-professional':
            return self._generate_minimal_professional(portfolio)
        elif template == 'creative-bold':
            return self._generate_creative_bold(portfolio)
        elif template == 'tech-modern':
            return self._generate_tech_modern(portfolio)
        else:
            return self._generate_minimal_professional(portfolio)
    
    def _generate_minimal_professional(self, p: Dict) -> str:
        """Generate modern colorful professional template"""
        skills_html = ''.join([f'<div class="skill-tag">{s["name"]}</div>' for s in p['skills']])
        
        projects_html = ''.join([
            f'''
            <div class="project-card">
                <div class="project-number">0{i+1}</div>
                <h3>{proj["title"]}</h3>
                <p>{proj["description"]}</p>
                {f'<div class="tech-tags">{", ".join([f"<span>{t.strip()}</span>" for t in proj["technologies"].split(",")])}</div>' if proj.get('technologies') else ''}
                {f'<a href="{proj["link"]}" target="_blank" class="project-link">View Project →</a>' if proj.get('link') else ''}
            </div>
            '''
            for i, proj in enumerate(p['projects'])
        ])
        
        experience_html = ''.join([
            f'''
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="duration">{exp["duration"]}</span>
                    <h3>{exp["position"]}</h3>
                    <h4>{exp["company"]}</h4>
                    <p>{exp["description"]}</p>
                </div>
            </div>
            '''
            for exp in p['experience']
        ])
        
        education_html = ''.join([
            f'''
            <div class="edu-card">
                <div class="edu-icon">🎓</div>
                <div class="edu-content">
                    <h3>{edu["degree"]}</h3>
                    <h4>{edu["institution"]}</h4>
                    <span class="year">{edu["year"]}</span>
                    {f'<p>{edu["description"]}</p>' if edu.get('description') else ''}
                </div>
            </div>
            '''
            for edu in p['education']
        ])
        
        return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{p['name']} - Portfolio</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        html {{
            scroll-behavior: smooth;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #0a0a0a;
            overflow-x: hidden;
        }}
        
        /* Navigation */
        nav {{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem 0;
        }}
        
        nav .container {{
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        nav .logo {{
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        nav ul {{
            display: flex;
            gap: 2rem;
            list-style: none;
        }}
        
        nav a {{
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            opacity: 0.8;
        }}
        
        nav a:hover {{
            opacity: 1;
            transform: translateY(-2px);
        }}
        
        /* Hero Section */
        .hero {{
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            position: relative;
            overflow: hidden;
            padding: 6rem 2rem;
        }}
        
        .hero::before {{
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
            animation: pulse 8s ease-in-out infinite;
        }}
        
        @keyframes pulse {{
            0%, 100% {{ transform: scale(1); opacity: 0.5; }}
            50% {{ transform: scale(1.2); opacity: 0.8; }}
        }}
        
        .hero-content {{
            text-align: center;
            position: relative;
            z-index: 1;
        }}
        
        .hero h1 {{
            font-size: 5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.03em;
            line-height: 1.1;
            animation: fadeInUp 0.8s ease;
        }}
        
        @keyframes fadeInUp {{
            from {{ opacity: 0; transform: translateY(30px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        
        .hero .title {{
            font-size: 1.8rem;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
            margin-bottom: 2rem;
            animation: fadeInUp 0.8s ease 0.2s both;
        }}
        
        .hero .contact {{
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.6);
            animation: fadeInUp 0.8s ease 0.4s both;
        }}
        
        .hero .contact a {{
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            transition: all 0.3s ease;
        }}
        
        .hero .contact a:hover {{
            color: #667eea;
        }}
        
        /* Section Styles */
        section {{
            padding: 8rem 3rem;
            position: relative;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
        }}
        
        section h2 {{
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 4rem;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        /* About Section */
        #about {{
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }}
        
        #about p {{
            font-size: 1.3rem;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.8);
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }}
        
        /* Skills Section */
        #skills {{
            background: #0a0a0a;
        }}
        
        .skills-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }}
        
        .skill-tag {{
            padding: 1.5rem;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 12px;
            text-align: center;
            font-weight: 500;
            color: #fff;
            transition: all 0.3s ease;
            cursor: default;
        }}
        
        .skill-tag:hover {{
            transform: translateY(-5px);
            border-color: #667eea;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }}
        
        /* Projects Section */
        #projects {{
            background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
        }}
        
        .projects-grid {{
            display: grid;
            gap: 3rem;
            max-width: 1000px;
            margin: 0 auto;
        }}
        
        .project-card {{
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 3rem;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }}
        
        .project-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }}
        
        .project-card:hover::before {{
            transform: scaleX(1);
        }}
        
        .project-card:hover {{
            transform: translateY(-10px);
            border-color: rgba(102, 126, 234, 0.5);
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
        }}
        
        .project-number {{
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
        }}
        
        .project-card h3 {{
            font-size: 1.8rem;
            color: #fff;
            margin-bottom: 1rem;
        }}
        
        .project-card p {{
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }}
        
        .tech-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }}
        
        .tech-tags span {{
            padding: 0.5rem 1rem;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 20px;
            font-size: 0.85rem;
            color: #667eea;
        }}
        
        .project-link {{
            display: inline-block;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .project-link:hover {{
            transform: translateX(5px);
        }}
        
        /* Experience Section */
        #experience {{
            background: #0a0a0a;
        }}
        
        .timeline {{
            max-width: 900px;
            margin: 0 auto;
            position: relative;
        }}
        
        .timeline::before {{
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }}
        
        .timeline-item {{
            position: relative;
            padding-left: 60px;
            margin-bottom: 4rem;
        }}
        
        .timeline-dot {{
            position: absolute;
            left: 10px;
            top: 0;
            width: 20px;
            height: 20px;
            background: #667eea;
            border: 4px solid #0a0a0a;
            border-radius: 50%;
        }}
        
        .timeline-content {{
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem;
            transition: all 0.3s ease;
        }}
        
        .timeline-content:hover {{
            transform: translateX(10px);
            border-color: rgba(102, 126, 234, 0.5);
        }}
        
        .timeline-content .duration {{
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 20px;
            font-size: 0.85rem;
            color: #667eea;
            margin-bottom: 1rem;
        }}
        
        .timeline-content h3 {{
            font-size: 1.5rem;
            color: #fff;
            margin-bottom: 0.5rem;
        }}
        
        .timeline-content h4 {{
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            margin-bottom: 1rem;
        }}
        
        .timeline-content p {{
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
        }}
        
        /* Education Section */
        #education {{
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }}
        
        .edu-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }}
        
        .edu-card {{
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2.5rem;
            transition: all 0.3s ease;
            display: flex;
            gap: 1.5rem;
        }}
        
        .edu-card:hover {{
            transform: translateY(-5px);
            border-color: rgba(102, 126, 234, 0.5);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
        }}
        
        .edu-icon {{
            font-size: 3rem;
            flex-shrink: 0;
        }}
        
        .edu-content h3 {{
            font-size: 1.3rem;
            color: #fff;
            margin-bottom: 0.5rem;
        }}
        
        .edu-content h4 {{
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            margin-bottom: 0.5rem;
        }}
        
        .edu-content .year {{
            display: inline-block;
            padding: 0.3rem 0.8rem;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            font-size: 0.85rem;
            color: #667eea;
            margin-bottom: 1rem;
        }}
        
        .edu-content p {{
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
            line-height: 1.6;
        }}
        
        /* Footer */
        footer {{
            background: #0a0a0a;
            text-align: center;
            padding: 3rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }}
        
        footer p {{
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.95rem;
        }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            nav .container {{
                padding: 0 1.5rem;
            }}
            
            nav ul {{
                gap: 1rem;
            }}
            
            .hero h1 {{
                font-size: 3rem;
            }}
            
            .hero .title {{
                font-size: 1.3rem;
            }}
            
            .hero .contact {{
                flex-direction: column;
                gap: 0.5rem;
            }}
            
            section {{
                padding: 5rem 1.5rem;
            }}
            
            section h2 {{
                font-size: 2rem;
            }}
            
            .edu-grid {{
                grid-template-columns: 1fr;
            }}
            
            .timeline::before {{
                left: 15px;
            }}
            
            .timeline-dot {{
                left: 5px;
            }}
        }}
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="logo">{p['name'][:2].upper()}</div>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>{p['name']}</h1>
            <p class="title">{p['title']}</p>
            <div class="contact">
                <a href="mailto:{p['email']}">{p['email']}</a>
                {f'<span>•</span><a href="tel:{p["phone"]}">{p["phone"]}</a>' if p.get('phone') else ''}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about">
        <div class="container">
            <h2>About Me</h2>
            <p>{p['about']}</p>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills">
        <div class="container">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
                {skills_html}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                {projects_html}
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    <section id="experience">
        <div class="container">
            <h2>Work Experience</h2>
            <div class="timeline">
                {experience_html}
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section id="education">
        <div class="container">
            <h2>Education</h2>
            <div class="edu-grid">
                {education_html}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2025 {p['name']}. Built with PortfolioAI</p>
    </footer>
</body>
</html>'''
    
    def _generate_creative_bold(self, p: Dict) -> str:
        """Generate creative bold template with vibrant colors"""
        skills_html = ''.join([f'<div class="skill-tag">{s["name"]}</div>' for s in p['skills']])
        
        projects_html = ''.join([
            f'''
            <div class="project-card">
                <div class="project-glow"></div>
                <h3>{proj["title"]}</h3>
                <p>{proj["description"]}</p>
                {f'<div class="tech-tags">{", ".join([f"<span>{t.strip()}</span>" for t in proj["technologies"].split(",")])}</div>' if proj.get('technologies') else ''}
                {f'<a href="{proj["link"]}" target="_blank" class="project-link">Explore →</a>' if proj.get('link') else ''}
            </div>
            '''
            for proj in p['projects']
        ])
        
        experience_html = ''.join([
            f'''
            <div class="exp-card">
                <span class="duration">{exp["duration"]}</span>
                <h3>{exp["position"]}</h3>
                <h4>{exp["company"]}</h4>
                <p>{exp["description"]}</p>
            </div>
            '''
            for exp in p['experience']
        ])
        
        education_html = ''.join([
            f'''
            <div class="edu-card">
                <div class="edu-glow"></div>
                <h3>{edu["degree"]}</h3>
                <h4>{edu["institution"]}</h4>
                <span class="year">{edu["year"]}</span>
                {f'<p>{edu["description"]}</p>' if edu.get('description') else ''}
            </div>
            '''
            for edu in p['education']
        ])
        
        return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{p['name']} - Creative Portfolio</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        html {{
            scroll-behavior: smooth;
        }}
        
        body {{
            font-family: 'Poppins', sans-serif;
            background: #050505;
            color: #fff;
            overflow-x: hidden;
        }}
        
        /* Hero Section */
        .hero {{
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            position: relative;
            overflow: hidden;
        }}
        
        .hero::before {{
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: moveGrid 20s linear infinite;
        }}
        
        @keyframes moveGrid {{
            0% {{ transform: translate(0, 0); }}
            100% {{ transform: translate(50px, 50px); }}
        }}
        
        .hero-content {{
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 3rem;
        }}
        
        .hero h1 {{
            font-size: 6rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 0 0 40px rgba(0,0,0,0.3);
            animation: glowText 3s ease-in-out infinite;
        }}
        
        @keyframes glowText {{
            0%, 100% {{ text-shadow: 0 0 40px rgba(0,0,0,0.3); }}
            50% {{ text-shadow: 0 0 60px rgba(255,255,255,0.5); }}
        }}
        
        .hero .title {{
            font-size: 2rem;
            font-weight: 500;
            opacity: 0.95;
            margin-bottom: 2rem;
        }}
        
        .hero .contact {{
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 1.1rem;
        }}
        
        .hero .contact a {{
            color: #fff;
            text-decoration: none;
            padding: 0.8rem 2rem;
            background: rgba(255,255,255,0.2);
            border-radius: 50px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }}
        
        .hero .contact a:hover {{
            background: rgba(255,255,255,0.3);
            transform: translateY(-3px);
        }}
        
        /* Sections */
        section {{
            padding: 8rem 3rem;
            position: relative;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
        }}
        
        section h2 {{
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 4rem;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        /* About Section */
        #about {{
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%);
        }}
        
        #about p {{
            font-size: 1.5rem;
            line-height: 1.9;
            color: rgba(255,255,255,0.85);
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }}
        
        /* Skills Section */
        #skills {{
            background: #050505;
        }}
        
        .skills-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }}
        
        .skill-tag {{
            padding: 2rem;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%);
            border: 2px solid transparent;
            border-radius: 20px;
            text-align: center;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }}
        
        .skill-tag::before {{
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.5s ease;
        }}
        
        .skill-tag:hover::before {{
            left: 100%;
        }}
        
        .skill-tag:hover {{
            transform: translateY(-10px) scale(1.05);
            border-color: #f093fb;
            box-shadow: 0 20px 60px rgba(240, 147, 251, 0.4);
        }}
        
        /* Projects Section */
        #projects {{
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        }}
        
        .projects-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 3rem;
        }}
        
        .project-card {{
            background: rgba(255,255,255,0.05);
            border-radius: 25px;
            padding: 3rem;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
        }}
        
        .project-glow {{
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
            transition: all 0.4s ease;
        }}
        
        .project-card:hover .project-glow {{
            top: -30%;
            right: -30%;
            width: 300px;
            height: 300px;
        }}
        
        .project-card:hover {{
            transform: translateY(-15px);
            box-shadow: 0 30px 80px rgba(102, 126, 234, 0.3);
        }}
        
        .project-card h3 {{
            font-size: 2rem;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }}
        
        .project-card p {{
            color: rgba(255,255,255,0.8);
            margin-bottom: 1.5rem;
            line-height: 1.8;
            position: relative;
            z-index: 1;
        }}
        
        .tech-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }}
        
        .tech-tags span {{
            padding: 0.6rem 1.2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
        }}
        
        .project-link {{
            display: inline-block;
            color: #f093fb;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
        }}
        
        .project-link:hover {{
            transform: translateX(10px);
        }}
        
        /* Experience Section */
        #experience {{
            background: #050505;
        }}
        
        .exp-grid {{
            display: grid;
            gap: 2.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }}
        
        .exp-card {{
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%);
            border-left: 5px solid #667eea;
            border-radius: 20px;
            padding: 3rem;
            transition: all 0.3s ease;
        }}
        
        .exp-card:hover {{
            transform: translateX(15px);
            border-left-color: #f093fb;
        }}
        
        .exp-card .duration {{
            display: inline-block;
            padding: 0.6rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }}
        
        .exp-card h3 {{
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }}
        
        .exp-card h4 {{
            font-size: 1.3rem;
            color: rgba(255,255,255,0.7);
            font-weight: 500;
            margin-bottom: 1.5rem;
        }}
        
        .exp-card p {{
            color: rgba(255,255,255,0.8);
            line-height: 1.8;
        }}
        
        /* Education Section */
        #education {{
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%);
        }}
        
        .edu-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 3rem;
        }}
        
        .edu-card {{
            background: rgba(255,255,255,0.05);
            border-radius: 25px;
            padding: 3rem;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
        }}
        
        .edu-glow {{
            position: absolute;
            bottom: -50%;
            left: -50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
            transition: all 0.4s ease;
        }}
        
        .edu-card:hover .edu-glow {{
            bottom: -30%;
            left: -30%;
            width: 300px;
            height: 300px;
        }}
        
        .edu-card:hover {{
            transform: translateY(-10px);
            box-shadow: 0 25px 70px rgba(240, 147, 251, 0.3);
        }}
        
        .edu-card h3 {{
            font-size: 1.8rem;
            margin-bottom: 0.8rem;
            position: relative;
            z-index: 1;
        }}
        
        .edu-card h4 {{
            font-size: 1.2rem;
            color: rgba(255,255,255,0.7);
            font-weight: 500;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }}
        
        .edu-card .year {{
            display: inline-block;
            padding: 0.5rem 1.2rem;
            background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }}
        
        .edu-card p {{
            color: rgba(255,255,255,0.75);
            line-height: 1.7;
            position: relative;
            z-index: 1;
        }}
        
        /* Footer */
        footer {{
            background: #000;
            text-align: center;
            padding: 4rem 2rem;
        }}
        
        footer p {{
            color: rgba(255,255,255,0.6);
            font-size: 1rem;
        }}
        
        /* Responsive */
        @media (max-width: 768px) {{
            .hero h1 {{
                font-size: 3.5rem;
            }}
            
            section {{
                padding: 5rem 1.5rem;
            }}
            
            section h2 {{
                font-size: 2.5rem;
            }}
            
            .projects-grid,
            .edu-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>{p['name']}</h1>
            <p class="title">{p['title']}</p>
            <div class="contact">
                <a href="mailto:{p['email']}">Get in Touch</a>
                {f'<a href="tel:{p["phone"]}">Call Me</a>' if p.get('phone') else ''}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about">
        <div class="container">
            <h2>About Me</h2>
            <p>{p['about']}</p>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills">
        <div class="container">
            <h2>Skills</h2>
            <div class="skills-grid">
                {skills_html}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Projects</h2>
            <div class="projects-grid">
                {projects_html}
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    <section id="experience">
        <div class="container">
            <h2>Experience</h2>
            <div class="exp-grid">
                {experience_html}
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section id="education">
        <div class="container">
            <h2>Education</h2>
            <div class="edu-grid">
                {education_html}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>© 2025 {p['name']}. Crafted with PortfolioAI</p>
    </footer>
</body>
</html>'''
    
    def _generate_tech_modern(self, p: Dict) -> str:
        """Generate tech modern template"""
        # Similar structure but with tech-focused styling
        return self._generate_minimal_professional(p).replace(
            'font-family: -apple-system',
            'font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono"'
        )
    
    def generate_zip(self, portfolio: Dict, template: str) -> bytes:
        """Generate ZIP file with portfolio HTML"""
        html_content = self.generate_html(portfolio, template)
        
        # Create README
        readme = f'''# {portfolio['name']} - Portfolio Website

This is your generated portfolio website. It's a single HTML file that's ready to deploy!

## Deployment Options

### GitHub Pages
1. Create a new repository on GitHub
2. Upload `index.html` to the repository
3. Go to Settings > Pages
4. Select "main" branch and save
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Vercel
1. Visit https://vercel.com
2. Sign in and click "New Project"
3. Upload this folder
4. Your site will be deployed instantly!

### Netlify
1. Visit https://netlify.com
2. Drag and drop this folder to "Sites"
3. Your site is live!

## Customization
You can edit the HTML file directly to customize colors, fonts, and layout.

Generated with PortfolioAI
'''
        
        # Create ZIP in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr('index.html', html_content)
            zip_file.writestr('README.md', readme)
        
        zip_buffer.seek(0)
        return zip_buffer.getvalue()