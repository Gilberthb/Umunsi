import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
