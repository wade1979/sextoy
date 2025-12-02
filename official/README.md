# PLEASURE Official Website

Official marketing website built with Next.js and Tailwind CSS, implementing the Figma design.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Image Optimization**: Next.js Image component

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
official/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── ProfessionalTechnique.tsx
│   │   ├── RealCharacters.tsx
│   │   ├── Personalization.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── images.ts       # Image asset constants
│       └── utils.ts       # Utility functions
├── public/
│   └── assets/             # Image and SVG assets
└── package.json
```

## Features

- Dark theme design matching Figma specifications
- Responsive layout (mobile, tablet, desktop)
- Interactive FAQ accordion
- Optimized image loading with Next.js Image
- Smooth scroll navigation
- Glassmorphism effects

## Design Notes

- Background color: `#0c0e12`
- Primary font: Inter
- All spacing and sizing match Figma design specifications
- Images are optimized for web delivery

