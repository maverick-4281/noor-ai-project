import { useState } from 'react';
import { Send, Sparkles, ChevronDown } from 'lucide-react';

const SIZES = ['Square', 'Landscape', 'Portrait'];
const STYLES = ['Cinematic', 'Realistic', 'Anime', 'Cartoon', '3D Render', 'Oil Painting'];

export default function ChatInput({ onSubmit, isGenerating }) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('Square');
  const [style, setStyle] = useState('Realistic');
  const [isEnhanceOn, setIsEnhanceOn] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt, style, size, isEnhanceOn);
      setPrompt('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-3">
      <div className="flex justify-end px-2">
        <button
          type="button"
          onClick={() => setIsEnhanceOn(!isEnhanceOn)}
          className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors border ${
            isEnhanceOn 
              ? 'bg-accent/10 border-accent/30 text-accent' 
              : 'bg-surface border-white/10 text-textMain/50 hover:text-textMain'
          }`}
        >
          <Sparkles size={12} />
          {isEnhanceOn ? 'Enhance Prompt: ON' : 'Enhance Prompt: OFF'}
        </button>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-surface border border-white/10 rounded-2xl shadow-xl pl-6 pr-2 py-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all"
      >
        {/* Style Dropdown */}
        <div className="relative flex items-center group shrink-0">
          <select 
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="bg-transparent text-textMain/80 group-hover:text-accent text-sm font-semibold outline-none cursor-pointer appearance-none pr-5 py-2"
          >
            {STYLES.map(s => <option key={s} value={s} className="bg-surface text-textMain">{s}</option>)}
          </select>
          <div className="absolute right-0 pointer-events-none text-textMain/50 group-hover:text-accent transition-colors">
             <ChevronDown size={14} />
          </div>
        </div>

        <div className="w-px h-5 bg-white/10 mx-3 sm:mx-4 shrink-0"></div>

        {/* Format Dropdown */}
        <div className="relative flex items-center group shrink-0">
          <select 
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="bg-transparent text-textMain/80 group-hover:text-accent text-sm font-semibold outline-none cursor-pointer appearance-none pr-5 py-2"
          >
            {SIZES.map(s => <option key={s} value={s} className="bg-surface text-textMain">{s}</option>)}
          </select>
          <div className="absolute right-0 pointer-events-none text-textMain/50 group-hover:text-accent transition-colors">
             <ChevronDown size={14} />
          </div>
        </div>

        <div className="hidden sm:block w-px h-5 bg-white/10 mx-4 shrink-0"></div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          placeholder="Describe the image you want to generate..."
          className="flex-1 bg-transparent py-3 px-2 outline-none text-textMain placeholder:text-textMain/30 min-w-0 ml-2 sm:ml-0"
        />

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="ml-2 p-3 bg-accent text-black rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {isGenerating ? (
            <Sparkles size={20} className="animate-pulse" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}
