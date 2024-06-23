import { AuthProvider } from "@propelauth/nextjs/client";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
    title: 'Threads',
    description: 'Threads Application'
}

const inter = Inter({subsets: ["latin"]})
export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
           <AuthProvider authUrl={process.env.NEXT_PUBLIC_AUTH_URL!}>
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </AuthProvider>
        </html>
    )
}