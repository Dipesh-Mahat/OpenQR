import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | OpenQR',
  description: 'Privacy policy for OpenQR - A client-side QR code generator',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Last Updated: August 15, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to OpenQR. This Privacy Policy explains how our client-side QR code generator handles your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">No Data Collection Policy</h2>
        <p>
          <strong>OpenQR does not collect, store, or transmit any of your data.</strong> We&apos;ve designed our application to work entirely within your browser:
        </p>
        <ul className="list-disc pl-8 my-4 space-y-2">
          <li>All QR code generation happens directly in your browser</li>
          <li>The content you enter to create QR codes never leaves your device</li>
          <li>We don&apos;t use analytics, tracking cookies, or any data collection mechanisms</li>
          <li>We don&apos;t have servers that process or store your QR code data</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Local Storage</h2>
        <p>
          OpenQR may use your browser&apos;s local storage to save your QR code preferences and recent codes for your convenience. 
          This data never leaves your device and is only accessible to you when using our application on the same browser.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
        <p>
          Our application is hosted on GitHub Pages, which may collect standard server logs including IP addresses and browser information.
          This is not within our control, but GitHub does not share this information with us. For more information, please refer to 
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> GitHub&apos;s Privacy Statement</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
        <p>
          Since all data processing occurs locally on your device and no data is transmitted to external servers, 
          there is no risk of data breaches from our application. Your QR code content remains private to your device.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Our Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will post any changes on this page with an updated &quot;Last Updated&quot; date.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
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

