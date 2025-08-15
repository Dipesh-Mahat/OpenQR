# OpenQR - Modern QR Code Generator

> A clean, feature-rich, open-source QR code generator with custom styling and advanced features.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## Features

### Customization Options
- Custom colors with gradient support
- Multiple pattern styles (dots, squares, rounded)
- Logo integration
- Frame options with custom text
- Advanced error correction levels

### QR Code Types
- Website URLs
- Email with subject and body
- Phone numbers with direct calling
- SMS messages
- WiFi network credentials
- Contact cards (vCard)
- Geographic locations
- Calendar events
- Plain text

### Advanced Features
- Animated QR codes with color and pattern transitions
- Augmented reality content linking
- Smart conditional QR codes (time, location, language)
- Password-protected QR codes

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Dipesh-Mahat/OpenQR.git
cd OpenQR
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript with strict configuration
- **Styling:** Tailwind CSS with custom components
- **QR Generation:** qrcode library with html2canvas for exports
- **Deployment:** GitHub Pages (static export)
- **CI/CD:** GitHub Actions for automated deployment

## Project Structure

```
OpenQR/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── privacy/          # Privacy policy page
│   │   └── terms/            # Terms of service page
│   ├── components/           # React components
│   │   ├── layout/           # Layout components
│   │   ├── providers/        # Context providers
│   │   ├── qr/               # QR generation components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript definitions
└── public/                   # Static assets
    ├── protect.html          # Password protection page
    └── smart.html            # Smart conditions handler
```

## Deployment

OpenQR is deployed using GitHub Pages for static site hosting. The deployment is automated through GitHub Actions.

### Live Demo

You can try the live application here: [https://dipesh-mahat.github.io/OpenQR](https://dipesh-mahat.github.io/OpenQR)

### Deployment Process

The application is automatically built and deployed to GitHub Pages when changes are pushed to the main branch. The GitHub Actions workflow handles:

1. Building the Next.js application with static export
2. Configuring the correct base path for GitHub Pages
3. Deploying the built files to the gh-pages branch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy and Security

OpenQR is designed with privacy in mind:

- All QR code generation happens entirely in your browser
- No data is sent to any servers
- Password-protected QR codes use client-side encryption
- Smart QR code conditions are processed locally

For more details, please see our [Privacy Policy](/privacy) and [Terms of Service](/terms).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - QR Code generator library
