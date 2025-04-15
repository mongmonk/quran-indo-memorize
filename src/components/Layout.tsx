
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Use location to determine if we're in a router context
  const location = useLocation();

  return (
    <div className="min-h-screen pattern-bg flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen size={24} />
            <span className="font-bold text-xl">Quran Hafiz</span>
          </Link>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 flex flex-col space-y-4">
                  <Link to="/" className="px-4 py-2 hover:bg-primary/10 rounded-md">
                    Daftar Surah
                  </Link>
                  <Link to="/progress" className="px-4 py-2 hover:bg-primary/10 rounded-md">
                    Kemajuan Hafalan
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:underline">
              Daftar Surah
            </Link>
            <Link to="/progress" className="hover:underline">
              Kemajuan Hafalan
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-700 to-emerald-800 text-secondary-foreground py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Quran Hafiz - Aplikasi Penghafal Al-Quran © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
