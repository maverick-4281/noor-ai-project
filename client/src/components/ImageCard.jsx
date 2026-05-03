import { MoreVertical, Share2, Download, Trash2 } from 'lucide-react';
import { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function ImageCard({ image }) {
  const [showMenu, setShowMenu] = useState(false);
  const { removeImageFromGallery } = useContext(DataContext);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.imageBase64;
    link.download = `noor-ai-${image._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  const handleDelete = () => {
    removeImageFromGallery(image._id);
    setShowMenu(false);
  };

  const handleShare = () => {
    // In a real app, this might copy a public URL to clipboard
    navigator.clipboard.writeText("Check out this image I generated on Noor AI!");
    alert('Share text copied to clipboard!');
    setShowMenu(false);
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-surface border border-white/10 shadow-lg transition-transform hover:-translate-y-1">
      <img 
        src={image.imageBase64} 
        alt={image.prompt} 
        className="w-full h-auto object-cover aspect-square sm:aspect-auto"
      />
      
      {/* Overlay details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <p className="text-white text-sm font-medium line-clamp-2 mb-1">{image.prompt}</p>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase px-2 py-1 bg-white/20 rounded backdrop-blur-md text-white/90">
            {image.style}
          </span>
          <span className="text-[10px] uppercase px-2 py-1 bg-white/20 rounded backdrop-blur-md text-white/90">
            {image.size}
          </span>
        </div>
      </div>

      {/* Kebab Menu */}
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="absolute top-full right-0 mt-1 w-36 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden z-10">
            <button 
              onClick={handleShare}
              className="w-full flex items-center gap-2 p-3 text-sm text-textMain hover:bg-white/5 transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
            <button 
              onClick={handleDownload}
              className="w-full flex items-center gap-2 p-3 text-sm text-textMain hover:bg-white/5 transition-colors"
            >
              <Download size={14} /> Download
            </button>
            <button 
              onClick={handleDelete}
              className="w-full flex items-center gap-2 p-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/10"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
