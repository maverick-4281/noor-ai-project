import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, Image as ImageIcon, LogOut, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-surface z-10">
      <div className="flex items-center gap-4">
        {/* Intentionally left space for sidebar toggle if needed on mobile */}
        <span className="text-xl font-bold tracking-tight text-textMain hidden sm:block">
          NOOR <span className="text-accent">STUDIO</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-background hover:bg-white/10 text-textMain transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <>
            <Link 
              to="/gallery"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ImageIcon size={18} />
              <span className="hidden sm:inline">Gallery</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-background transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-semibold truncate text-textMain">{user.name}</p>
                  <p className="text-xs text-textMain/60 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-3 text-sm text-red-500 hover:bg-background transition-colors rounded-b-xl"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
