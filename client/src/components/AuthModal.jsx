import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      onClose();
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-surface border border-white/10 rounded-2xl shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-textMain/50 hover:text-textMain transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-2 text-textMain">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-textMain/70 mb-8">
          {isLogin ? 'Sign in to continue to Noor AI.' : 'Join the cinematic visual studio.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMain/80 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-accent text-textMain transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMain/80 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-accent text-textMain transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 mt-6 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-textMain/60 hover:text-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
