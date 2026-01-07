# Portfolio Template

A modern, responsive portfolio website template perfect for showcasing your skills, projects, education, certifications, and more. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean and professional interface with smooth animations
- **Multiple Sections**:
  - Hero/Introduction with profile image
  - About Me
  - Skills (categorized)
  - Projects showcase with carousel
  - Education timeline
  - Certifications gallery
  - Photo gallery
  - Contact information
- **Interactive Elements**:
  - Smooth scrolling navigation
  - Cursor glow effect
  - Scroll-to-top button
  - Carousel controls for projects, certifications, and photos
- **Social Media Integration**: LinkedIn, Instagram, GitHub, WhatsApp
- **CV Download**: Direct download button for your resume

## 🚀 Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge, etc.)
- A text editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KGP-Pramodith-lang/portfolio-template.git
   cd portfolio-template
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local development server (e.g., Live Server extension in VS Code)

## 📝 Customization Guide

### 1. Personal Information

Edit `index.html` to update:

- **Name and Title** (line 72-76): Replace "YOUR NAME" and "Your Title / Role"
- **About Me** (line 115-119): Write your introduction
- **Social Media Links** (lines 40-63): Update with your profiles
- **Contact Information** (lines 493-560): Update email, phone, and social handles

### 2. Profile Image

- Replace `images/placeholder-avatar.svg` with your photo
- Update the image source in line 103 of `index.html`

### 3. Skills

Edit lines 132-155 in `index.html`:
- Modify skill categories
- Add/remove skill chips
- Update category titles

### 4. Projects

For each project (lines 180-234):
- Replace placeholder images in the `images/` folder
- Update project titles and descriptions
- Add more project cards by duplicating the `<article>` blocks

### 5. Education

Update timeline items (lines 263-290):
- Change degree/program names
- Update institution names
- Modify dates and descriptions

### 6. Certifications

- Replace `images/placeholder-cert.svg` with your certification images
- Update certification details (lines 321-391)
- Link to credential verification pages

### 7. Photo Gallery

- Add your photos to the `images/` folder
- Update image sources in lines 430-457

### 8. CV/Resume

- Place your CV PDF in the `CV/` folder
- Update the file name in line 82 and 481

## 📂 Project Structure

```
portfolio-template/
├── index.html          # Main HTML file
├── style.css           # Styles and animations
├── script.js           # Interactive functionality
├── LICENSE             # MIT License
├── README.md           # Documentation
├── CV/                 # Folder for CV/resume files
└── images/             # Image assets
    ├── icon.svg
    ├── placeholder-avatar.svg
    ├── placeholder-project.svg
    ├── placeholder-cert.svg
    └── placeholder-photo.svg
```

## 🎨 Styling

The template uses:
- **Fonts**: Inter & Space Grotesk from Google Fonts
- **Icons**: Font Awesome 6.5.0
- **CSS Variables**: Easy color customization in `style.css`
- **Animations**: Smooth transitions and hover effects

To customize colors, edit the CSS custom properties in `style.css`.

## 🌐 Deployment

### GitHub Pages

1. Go to your repository settings
2. Navigate to Pages section
3. Select the `main` branch as source
4. Your site will be published at `https://KGP-Pramodith-lang.github.io/portfolio-template/`

### Other Platforms

This template works with:
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Tips

- Keep descriptions concise and impactful
- Use high-quality images (compress them for faster loading)
- Update social links regularly
- Test on multiple devices and browsers
- Keep your CV/resume updated

## 📧 Support

If you have questions or need help customizing the template, feel free to open an issue.

## 🌟 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- The open-source community

---

**Made with ❤️ for developers, designers, and creators**