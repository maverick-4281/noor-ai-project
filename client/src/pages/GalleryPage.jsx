import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GalleryPage() {
  const { gallery } = useContext(DataContext);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-textMain mb-2">Your Gallery</h1>
            <p className="text-textMain/60">A collection of your rendered masterpieces.</p>
          </div>
          
          <Link 
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 hover:bg-white/5 text-textMain rounded-xl transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Studio
          </Link>
        </div>

        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-white/10 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-textMain/30 mb-4">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-semibold text-textMain mb-2">Gallery is empty</h3>
            <p className="text-textMain/50 max-w-sm mb-6">
              You haven't generated any images yet. Head back to the studio to create your first masterpiece.
            </p>
            <Link 
              to="/dashboard"
              className="px-6 py-3 bg-accent text-black font-semibold rounded-xl hover:bg-accent/90 transition-colors"
            >
              Start Generating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map(img => (
              <ImageCard key={img.id} image={img} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
