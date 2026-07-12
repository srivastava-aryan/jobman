import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Job Match Portal",
  description: "Track job matches against your resume and close the gap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-ink-900">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-8 py-8 max-w-6xl">{children}</main>
        </div>
      </body>
    </html>
  );
}
