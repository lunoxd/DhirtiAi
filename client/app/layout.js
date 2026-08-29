import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DhritiAiChat from "../components/DhritiAiChat";

export const metadata = {
  title: "DHRITI — Mental Wellbeing Monitoring & Distress-Support Platform",
  description: "Understand your wellbeing. Recognize changes early. Find support when it matters.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <main style={{ flex: 1, padding: "24px 0" }}>
              {children}
            </main>
            <Footer />
            <DhritiAiChat />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
