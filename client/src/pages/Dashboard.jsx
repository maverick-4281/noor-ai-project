import { useState, useContext, useRef, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import { Sparkles, AlertCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { chats, createNewChat, fetchChats, fetchGallery, headers } = useContext(DataContext);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  // Load chat messages when a chat is selected
  useEffect(() => {
    if (currentChatId) {
      axios.get(`${API}/api/chats/${currentChatId}`, { headers })
        .then(res => setCurrentMessages(res.data.messages))
        .catch(err => console.error("Error loading chat messages", err));
    } else {
      setCurrentMessages([]);
    }
  }, [currentChatId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const generateImage = async (prompt, style, size, isEnhanceOn) => {
    setIsGenerating(true);
    
    // Create new chat if none exists
    let activeChatId = currentChatId;
    if (!activeChatId) {
      const newChat = await createNewChat(prompt);
      activeChatId = newChat._id;
      setCurrentChatId(activeChatId);
    }

    // 1. Add User Prompt
    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, role: 'user', content: prompt, originalPrompt: '', style, size };
    let updatedMessages = [...currentMessages, userMsg];
    setCurrentMessages(updatedMessages);

    // 2. Add AI Loading
    const loadingMsgId = (Date.now() + 1).toString();
    updatedMessages = [...updatedMessages, { id: loadingMsgId, role: 'ai', isLoading: true }];
    setCurrentMessages(updatedMessages);

    try {
      let finalPrompt = prompt;
      let originalPrompt = '';

      if (isEnhanceOn) {
        try {
          const enhanceRes = await axios.post(`${API}/api/enhance`, { prompt }, { headers });
          if (enhanceRes.data.enhanced) {
            finalPrompt = enhanceRes.data.enhanced;
            originalPrompt = prompt;
            
            // Update the user message to show the enhanced prompt
            updatedMessages = updatedMessages.map(m => 
              m.id === userMsgId 
                ? { ...m, content: finalPrompt, originalPrompt: prompt }
                : m
            );
            setCurrentMessages(updatedMessages);
          }
        } catch (err) {
          console.error("Enhancement failed, falling back to original prompt", err);
        }
      }

      // 3. Make API Call to generate image
      const response = await axios.post(`${API}/api/generate`, { prompt: finalPrompt, originalPrompt, style, size }, { headers });
      const savedImage = response.data; // This is the Image document from MongoDB

      // Refresh gallery to include new image
      fetchGallery();

      // Replace loading with completed AI response
      updatedMessages = updatedMessages.map(m => 
        m.id === loadingMsgId 
          ? { ...m, isLoading: false, imageId: savedImage } // Backend populate returns object here locally we fake it
          : m
      );
      
      setCurrentMessages(updatedMessages);

      // Save updated messages to MongoDB Chat
      await axios.put(`${API}/api/chats/${activeChatId}`, { messages: updatedMessages }, { headers });
      fetchChats(); // Update sidebar

    } catch (error) {
      let errorMessage = error.response?.data?.error || "An error occurred while communicating with the server.";

      updatedMessages = updatedMessages.map(m => 
        m.isLoading ? { ...m, isLoading: false, error: errorMessage } : m
      );
      setCurrentMessages(updatedMessages);
      await axios.put(`${API}/api/chats/${activeChatId}`, { messages: updatedMessages }, { headers });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        chats={chats.map(c => ({ id: c._id, prompt: c.title }))} 
        onNewChat={handleNewChat} 
        activeChatId={currentChatId}
        onSelectChat={(id) => setCurrentChatId(id)}
      />
      
      <div className="flex-1 flex flex-col relative">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin pb-48">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 opacity-50">
              <Sparkles size={48} className="mb-6 text-accent" />
              <h2 className="text-3xl font-bold text-textMain mb-2">Welcome to the Studio</h2>
              <p className="text-textMain/70">Describe a scene, choose a style, and watch your imagination come to life.</p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div key={msg.id || msg._id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-2">
                    <Sparkles size={20} />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-surface border border-white/10 text-textMain px-5 py-3 rounded-2xl rounded-tr-sm shadow-md">
                      {msg.originalPrompt && msg.originalPrompt !== msg.content && (
                        <div className="mb-2 pb-2 border-b border-white/10">
                          <p className="text-xs text-textMain/50 mb-1">Original Prompt:</p>
                          <p className="text-sm text-textMain/80">{msg.originalPrompt}</p>
                        </div>
                      )}
                      {msg.originalPrompt && msg.originalPrompt !== msg.content && (
                        <p className="text-xs text-accent mb-1 flex items-center gap-1"><Sparkles size={10} /> Enhanced Prompt:</p>
                      )}
                      <p className="text-base">{msg.content}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs uppercase px-2 py-1 bg-white/5 rounded text-textMain/70">{msg.style}</span>
                        <span className="text-xs uppercase px-2 py-1 bg-white/5 rounded text-textMain/70">{msg.size}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {msg.isLoading ? (
                        <div className="bg-surface border border-white/10 px-6 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3 text-textMain/70 w-fit">
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          <span className="ml-2 text-sm font-medium">Rendering...</span>
                        </div>
                      ) : msg.error ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl rounded-tl-sm flex items-start gap-3 w-fit max-w-md">
                          <AlertCircle size={20} className="shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{msg.error}</p>
                        </div>
                      ) : msg.imageId && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group relative inline-block">
                          <img src={msg.imageId.imageBase64 || msg.imageId} alt="Generated" className="max-w-full rounded-2xl block" style={{ maxHeight: '600px' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {msg.role === 'user' && (
                   <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-textMain shrink-0 mt-2 order-2">
                     U
                   </div>
                )}
              </div>
            ))
          )}
          <div ref={chatEndRef} className="h-16 shrink-0" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4">
          <ChatInput onSubmit={generateImage} isGenerating={isGenerating} />
        </div>
      </div>
    </div>
  );
}
