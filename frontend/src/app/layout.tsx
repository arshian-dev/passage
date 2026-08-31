import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Passage — AI Immigration Intake & Form Platform",
  description: "AI-Powered Immigration Intake & Form Automation Platform",
  colorScheme: "light",
  other: {
    "color-scheme": "light only",
    "supported-color-schemes": "light",
    "darkreader-lock": "true", // Tells Dark Reader extension not to touch this site
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} font-sans antialiased min-h-screen light`}
      style={{ colorScheme: "light" }}
    >
      <head>
        {/* Anti-Dark Mode & Extension Lock Meta Tags */}
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="darkreader-lock" content="true" />

        {/* Client-side guard to remove any extension/stale dark mode overrides */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('passage-theme');
                  localStorage.removeItem('theme');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                  
                  // MutationObserver to aggressively prevent any extension from adding .dark class
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.attributeName === 'class' && document.documentElement.classList.contains('dark')) {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                      }
                      if (mutation.attributeName === 'data-theme' && document.documentElement.getAttribute('data-theme') === 'dark') {
                        document.documentElement.setAttribute('data-theme', 'light');
                      }
                    });
                  });
                  observer.observe(document.documentElement, { attributes: true });
                } catch (e) {}
              })();
            `,
          }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col light" style={{ colorScheme: "light" }}>
        {children}
      </body>
    </html>
  );
}
