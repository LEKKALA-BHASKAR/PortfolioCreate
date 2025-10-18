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
        """Generate minimal professional template"""
        skills_html = ''.join([f'<span class="skill-tag">{s["name"]}</span>' for s in p['skills']])
        
        projects_html = ''.join([
            f'''
            <div class="project-item">
                <h3>{proj["title"]}</h3>
                <p>{proj["description"]}</p>
                {f'<p class="tech">Tech: {proj["technologies"]}</p>' if proj.get('technologies') else ''}
                {f'<a href="{proj["link"]}" target="_blank">View Project →</a>' if proj.get('link') else ''}
            </div>
            '''
            for proj in p['projects']
        ])
        
        experience_html = ''.join([
            f'''
            <div class="exp-item">
                <div class="exp-header">
                    <div>
                        <h3>{exp["position"]}</h3>
                        <p class="company">{exp["company"]}</p>
                    </div>
                    <span class="duration">{exp["duration"]}</span>
                </div>
                <p>{exp["description"]}</p>
            </div>
            '''
            for exp in p['experience']
        ])
        
        education_html = ''.join([
            f'''
            <div class="edu-item">
                <div class="edu-header">
                    <div>
                        <h3>{edu["degree"]}</h3>
                        <p class="institution">{edu["institution"]}</p>
                    </div>
                    <span class="year">{edu["year"]}</span>
                </div>
                {f'<p class="edu-desc">{edu["description"]}</p>' if edu.get('description') else ''}
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
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #000;
            background: #fff;
        }}
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 2rem;
        }}
        section {{
            padding: 4rem 0;
        }}
        .hero {{
            text-align: center;
            padding: 6rem 2rem;
        }}
        .hero h1 {{
            font-size: 4rem;
            font-weight: 300;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }}
        .hero .title {{
            font-size: 1.5rem;
            color: #666;
            font-weight: 300;
            margin-bottom: 2rem;
        }}
        .hero .contact {{
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            font-size: 0.9rem;
            color: #666;
        }}
        .bg-gray {{
            background: #f5f5f5;
        }}
        h2 {{
            font-size: 2rem;
            font-weight: 300;
            margin-bottom: 2rem;
        }}
        p {{
            color: #666;
            font-weight: 300;
            line-height: 1.8;
        }}
        .skill-tag {{
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #000;
            color: #fff;
            border-radius: 2rem;
            font-size: 0.9rem;
            font-weight: 300;
            margin: 0.5rem 0.5rem 0.5rem 0;
        }}
        .project-item {{
            border-left: 2px solid #000;
            padding-left: 1.5rem;
            margin-bottom: 2rem;
        }}
        .project-item h3 {{
            font-size: 1.3rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
        }}
        .project-item .tech {{
            font-size: 0.9rem;
            color: #999;
            margin: 0.5rem 0;
        }}
        .project-item a {{
            font-size: 0.9rem;
            color: #000;
            text-decoration: underline;
        }}
        .exp-item, .edu-item {{
            margin-bottom: 2rem;
        }}
        .exp-header, .edu-header {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }}
        .exp-header h3, .edu-header h3 {{
            font-size: 1.3rem;
            font-weight: 300;
        }}
        .company, .institution {{
            color: #666;
            font-weight: 300;
        }}
        .duration, .year {{
            font-size: 0.9rem;
            color: #999;
        }}
        .edu-desc {{
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }}
        footer {{
            text-align: center;
            padding: 3rem 2rem;
            border-top: 1px solid #e0e0e0;
        }}
        footer p {{
            font-size: 0.9rem;
            color: #666;
        }}
        @media (max-width: 768px) {{
            .hero h1 {{ font-size: 2.5rem; }}
            .hero .title {{ font-size: 1.2rem; }}
            .hero .contact {{ flex-direction: column; gap: 0.5rem; }}
            .exp-header, .edu-header {{ flex-direction: column; }}
        }}
    </style>
</head>
<body>
    <section class="hero">
        <h1>{p['name']}</h1>
        <p class="title">{p['title']}</p>
        <div class="contact">
            <span>{p['email']}</span>
            {f'<span>•</span><span>{p["phone"]}</span>' if p.get('phone') else ''}
        </div>
    </section>

    <section class="bg-gray">
        <div class="container">
            <h2>About</h2>
            <p>{p['about']}</p>
        </div>
    </section>

    <section>
        <div class="container">
            <h2>Skills</h2>
            <div>
                {skills_html}
            </div>
        </div>
    </section>

    <section class="bg-gray">
        <div class="container">
            <h2>Projects</h2>
            {projects_html}
        </div>
    </section>

    <section>
        <div class="container">
            <h2>Experience</h2>
            {experience_html}
        </div>
    </section>

    <section class="bg-gray">
        <div class="container">
            <h2>Education</h2>
            {education_html}
        </div>
    </section>

    <footer>
        <p>© 2025 {p['name']}. All rights reserved.</p>
    </footer>
</body>
</html>'''
    
    def _generate_creative_bold(self, p: Dict) -> str:
        """Generate creative bold template with vibrant colors"""
        # Similar structure but with different styling
        return self._generate_minimal_professional(p).replace(
            'background: #000;\n            color: #fff;',
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            color: #fff;'
        )
    
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