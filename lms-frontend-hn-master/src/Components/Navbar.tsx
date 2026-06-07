// src/components/Navbar.tsx
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background text-text shadow-md">
      <Link href="/" className="text-2xl font-bold text-primary">
        LMS
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm hover:text-primary transition-colors">Login</Link>
        <Link href="/register" className="text-sm hover:text-primary transition-colors">Register</Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
}
