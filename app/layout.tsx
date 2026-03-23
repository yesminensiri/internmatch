import "./globals.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "InternMatch",
  description: "Internship Recruitment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.className} bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200`}>
        {children}
      </body>
    </html>
  );
}