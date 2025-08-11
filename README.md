# OpenQR - Modern QR Code Generator

![OpenQR Banner](https://via.placeholder.com/1200x300/2563eb/ffffff?text=OpenQR+-+Modern+QR+Code+Generator)

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
git clone https://github.com/yourusername/openqr.git
cd openqr
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
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **QR Generation:** qrcode library with html2canvas for exports
- **Build Tool:** Turbopack

## Project Structure

```
openqr/
├── src/
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   │   ├── layout/           # Layout components
│   │   ├── qr/               # QR generation components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript definitions
└── public/                   # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - QR Code generator library
