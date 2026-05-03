import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Build headers with the logged-in user's email as identifier
  const headers = user ? { 'x-user-id': user.email } : {};

  useEffect(() => {
    if (user) {
      fetchChats();
      fetchGallery();
    } else {
      // Clear data when user logs out
      setChats([]);
      setGallery([]);
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API}/api/chats`, { headers });
      setChats(res.data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API}/api/gallery`, { headers });
      setGallery(res.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const removeImageFromGallery = async (id) => {
    try {
      await axios.delete(`${API}/api/gallery/${id}`, { headers });
      setGallery(gallery.filter(img => img._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const createNewChat = async (title) => {
    try {
      const res = await axios.post(`${API}/api/chats`, { title, messages: [] }, { headers });
      setChats([res.data, ...chats]);
      return res.data;
    } catch (err) {
      console.error('Error creating chat:', err);
      return null;
    }
  };

  return (
    <DataContext.Provider value={{ 
      chats, setChats, fetchChats, createNewChat,
      gallery, fetchGallery, setGallery, removeImageFromGallery,
      headers
    }}>
      {children}
    </DataContext.Provider>
  );
};
