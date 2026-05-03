import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Build headers with the logged-in user's email as identifier
  const headers = useMemo(
    () => (user ? { 'x-user-id': user.email } : {}),
    [user]
  );

  const fetchChats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/chats`, { headers });
      setChats(res.data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  }, [headers]);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/gallery`, { headers });
      setGallery(res.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  }, [headers]);

  useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        void fetchChats();
        void fetchGallery();
      });
    } else {
      queueMicrotask(() => {
        setChats([]);
        setGallery([]);
      });
    }
  }, [user, fetchChats, fetchGallery]);

  const removeImageFromGallery = async (id) => {
    try {
      await axios.delete(`${API}/api/gallery/${id}`, { headers });
      setGallery((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const createNewChat = async (title) => {
    try {
      const res = await axios.post(`${API}/api/chats`, { title, messages: [] }, { headers });
      setChats((prev) => [res.data, ...prev]);
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
