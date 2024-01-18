import type {Metadata} from 'next';
import {Providers, Navbar, Footer, PageWrapper} from '@components';
import {Work_Sans} from 'next/font/google';

export const metadata: Metadata = {
  title: 'UBC Tennis Circle',
  description:
    "UBC Tennis Circle: Join UBC's hub for tennis enthusiasts - matches and networking for students.",
};

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={workSans.className}>
      <body>
        <Providers>
          <Navbar />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
