import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col font-sans">
      {/* Background with cinematic vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-1000"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:px-12">
        <h1 className="text-3xl font-bold tracking-tighter text-white">
          NOOR <span className="text-accent">STUDIO</span>
        </h1>
        <button 
          onClick={() => setIsAuthOpen(true)}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-lg font-medium transition-all"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-[-10vh]">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Imagine the Unseen. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
            Render the Impossible.
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light">
          Noor AI is your cinematic visual studio. Describe a scene, select a style, and let our advanced neural engine generate breathtaking 8K resolution artwork in seconds.
        </p>

        <button 
          onClick={() => setIsAuthOpen(true)}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-bold text-lg rounded-full overflow-hidden shadow-[0_0_40px_rgba(252,163,17,0.4)] hover:shadow-[0_0_60px_rgba(252,163,17,0.6)] transition-shadow"
        >
          <span className="relative z-10">Get Started</span>
          <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
