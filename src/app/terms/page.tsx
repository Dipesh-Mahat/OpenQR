import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | OpenQR',
  description: 'Terms of service for OpenQR - A client-side QR code generator',
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Last Updated: August 15, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
        <p>
          By accessing or using OpenQR, you agree to be bound by these Terms of Service. If you disagree with any part of the terms,
          you may not access the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Description of Service</h2>
        <p>
          OpenQR is an open-source client-side QR code generator that provides various customization options including colors, patterns, 
          logos, and advanced features like password protection and smart conditions. All processing occurs locally in your browser, 
          and we do not collect or store any of your data on servers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use of the Service</h2>
        <p>
          You agree to use OpenQR for lawful purposes only and in accordance with these Terms. You are responsible for all content 
          generated using our service. You agree not to:
        </p>
        <ul className="list-disc pl-8 my-4 space-y-2">
          <li>Use the service to generate QR codes that link to harmful, fraudulent, or illegal content</li>
          <li>Attempt to interfere with, disrupt, or gain unauthorized access to the service</li>
          <li>Use the service in any manner that could disable, overburden, or impair the site</li>
          <li>Use any robot, spider, or other automated means to access the service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p>
          OpenQR is open-source software licensed under the MIT License. The source code is available on GitHub.
        </p>
        <p>
          You retain all ownership rights to the QR codes and content you generate using our service. We make no claim to intellectual 
          property rights over the materials you create with OpenQR.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">No Warranty</h2>
        <p>
          The service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
          We do not warrant that:
        </p>
        <ul className="list-disc pl-8 my-4 space-y-2">
          <li>The service will be error-free or uninterrupted</li>
          <li>QR codes generated will be compatible with all scanning devices or applications</li>
          <li>Defects will be corrected</li>
          <li>The service or server that makes it available are free of viruses or other harmful components</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, OpenQR and its developers will not be liable for any indirect, incidental, 
          special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, 
          or other intangible losses resulting from:
        </p>
        <ul className="list-disc pl-8 my-4 space-y-2">
          <li>Your use or inability to use the service</li>
          <li>Any changes made to the service</li>
          <li>Unauthorized access to or alteration of your data</li>
          <li>Any third party's conduct or content accessed through the service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless OpenQR and its developers from and against any claims, liabilities, damages, 
          judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of 
          the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of any material changes by updating the 
          "Last Updated" date. Your continued use of OpenQR after such modifications constitutes your acceptance of the revised Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <br />
          Email: <a href="mailto:dipesh.mahat.dev@gmail.com" className="text-primary hover:underline">dipesh.mahat.dev@gmail.com</a>
        </p>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
