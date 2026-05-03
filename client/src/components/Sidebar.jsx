import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ chats, onNewChat, activeChatId, onSelectChat }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`h-full bg-surface border-r border-white/10 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {isOpen && <span className="font-semibold text-textMain">Chats</span>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-background text-textMain/70 hover:text-textMain transition-colors"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <div className="p-3">
        <button 
          onClick={onNewChat}
          className={`flex items-center gap-2 w-full p-3 bg-accent text-black rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-sm ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          <Plus size={20} />
          {isOpen && <span>New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 scrollbar-thin">
        {chats.length === 0 && isOpen ? (
          <p className="text-sm text-textMain/50 text-center mt-4">No chat history</p>
        ) : (
          chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                activeChatId === chat.id 
                  ? 'bg-white/10 text-textMain' 
                  : 'hover:bg-background text-textMain/80 hover:text-textMain'
              } ${!isOpen && 'justify-center'}`}
              title={chat.prompt}
            >
              <MessageSquare size={18} className="shrink-0" />
              {isOpen && (
                <span className="truncate text-sm">
                  {chat.prompt || 'New Conversation'}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
