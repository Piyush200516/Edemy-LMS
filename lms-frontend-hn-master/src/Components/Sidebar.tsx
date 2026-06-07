// src/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, User, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { href: '/courses', label: 'Courses', icon: <Book className="h-5 w-5" /> },
  { href: '/student/dashboard', label: 'Student', icon: <User className="h-5 w-5" /> },
  { href: '/admin/dashboard', label: 'Admin', icon: <Settings className="h-5 w-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-full bg-surface text-text flex flex-col p-4 space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors ${pathname === item.href ? 'bg-muted' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </aside>
  );
}
