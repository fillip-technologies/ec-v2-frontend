import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineers Clinic | Build real projects. Prove you are job-ready.",
  description: "Practical engineering project tracks: milestones, GitHub submissions, mentor reviews, and verified certificates.",
  icons: {
    icon: "/images/Engineers-clinic-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-[#7C5CFC] selection:text-white">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,800,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />

        {/*  title */}
        <title>Engineers Clinic</title>
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FAFBFF] text-[#160840] antialiased">
        {children}
      </body>
    </html>
  );
}
