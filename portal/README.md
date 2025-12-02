# Portal Marketing Website

Product marketing and e-commerce website for AI Pleasure device.

## Overview

This is a standalone marketing website built with pure HTML, CSS, and JavaScript. The site provides product information, documentation, and purchase capabilities for the AI Pleasure personal wellness device.

## Features

- **8 Main Pages:**
  - Home - Brand introduction and core features
  - Product - Detailed product specifications and features
  - How It Works - Interactive documentation with tree menu
  - FAQ - Frequently asked questions with accordion UI
  - Purchase - Stripe Checkout integration (placeholder)
  - Brand Story - Company mission and values
  - Policies - Legal documents and policies
  - Feedback - User feedback form (Tally.so integration placeholder)

- **Design System:**
  - Apple-inspired clean and minimal design
  - Responsive layout (mobile-first)
  - Modern typography and spacing
  - Smooth animations and transitions

- **Interactive Components:**
  - Responsive navigation with mobile menu
  - FAQ accordion
  - Tree-style documentation menu
  - Smooth scroll navigation

## File Structure

```
portal/
├── index.html              # Home page
├── product.html            # Product details page
├── how-it-works.html       # Documentation page
├── faq.html                # FAQ page
├── purchase.html           # Checkout page
├── brand-story.html        # Brand story page
├── policies.html           # Legal policies page
├── feedback.html           # Feedback form page
├── css/
│   ├── main.css           # Main stylesheet (design system)
│   └── pages.css          # Page-specific styles
├── js/
│   ├── main.js            # Main JavaScript (navigation, FAQ, etc.)
│   └── docs.js            # Documentation page logic
├── assets/
│   ├── images/            # Product images (placeholder)
│   ├── videos/            # Video assets (placeholder)
│   └── icons/             # Icon assets
└── README.md              # This file
```

## Setup

### Local Development

1. Open the website in a local web server (required for proper CORS):
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server -p 8000
   ```

2. Navigate to `http://localhost:8000/portal/` in your browser

### Production Deployment

Simply upload all files to your web server. The site is static HTML/CSS/JS and requires no build process.

## Customization

### Stripe Checkout Integration

1. Open `purchase.html`
2. Follow the instructions in the code comments
3. Replace the placeholder with your Stripe Checkout integration
4. Configure product SKU, pricing, shipping, and tax settings

### Tally.so Form Integration

1. Open `feedback.html`
2. Create a form on [Tally.so](https://tally.so)
3. Copy the embed code
4. Replace the placeholder section with the embed code

### Images and Videos

Replace placeholder images and videos in:
- `index.html` - Hero background, video section
- `product.html` - Product gallery images
- `how-it-works.html` - Setup tutorial video

Place actual assets in:
- `assets/images/` - Product photos, brand images
- `assets/videos/` - Demo videos, tutorials

### Content Updates

All content is in HTML files. Update text directly in the HTML:
- Product specifications: `product.html`
- Documentation: `how-it-works.html`
- FAQ entries: `faq.html`
- Legal policies: `policies.html`
- Brand content: `brand-story.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Design Notes

- **Color Scheme:** Inspired by Apple.com - clean whites, subtle grays, minimal accent colors
- **Typography:** System fonts for optimal performance and native feel
- **Spacing:** Generous whitespace following Apple's design principles
- **Responsive:** Mobile-first approach with breakpoints at 768px and 1024px

## Future Enhancements

- [ ] Replace placeholder images with actual product photos
- [ ] Add actual demo videos
- [ ] Implement Stripe Checkout integration
- [ ] Integrate Tally.so feedback form
- [ ] Add analytics tracking
- [ ] SEO optimization (meta tags, structured data)
- [ ] Performance optimization (image compression, lazy loading)

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact: support@aipleasure.com




