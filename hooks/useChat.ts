import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import Constants from 'expo-constants';

type Message = {
  id: string;
  content: string;
  senderIdentity: {
    name: string;
    id: string;
  };
  senderType: 'ANONYMOUS_USER' | 'REAL_USER';
  createdAt: string;
  parentId?: string;
  groupId: string;
};

type MessageResponse = {
  error?: string;
  message: Message;
};

export function useChat(groupId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, connected } = useSocket();
  const { token } = useAuth();
  const messagesRef = useRef<Message[]>([]);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.apiUrl}/api/messages/group/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(response.data.messages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [groupId, token]);

  const sendMessage = useCallback(async (content: string, parentId?: string, useGeneratedIdentity: boolean = true) => {
    if (!socket || !connected) {
      throw new Error('Socket not connected');
    }

    return new Promise((resolve, reject) => {
      socket.emit('sendMessage', {
        content,
        groupId,
        parentId,
        useGeneratedIdentity
      }, (response: MessageResponse) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          // Add the message to state immediately
          setMessages(prev => [...prev, response.message]);
          resolve(response);
        }
      });
    });
  }, [socket, connected, groupId]);

  useEffect(() => {
    fetchMessages();

    if (socket) {
      const handleNewMessage = (message: Message) => {
        if (message.groupId === groupId) {
          // Check if message already exists to prevent duplicates
          const messageExists = messagesRef.current.some(m => m.id === message.id);
          if (!messageExists) {
            setMessages(prev => [...prev, message]);
          }
        }
      };

      const handleMessageUpdate = (updatedMessage: Message) => {
        if (updatedMessage.groupId === groupId) {
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          ));
        }
      };

      const handleMessageDelete = (messageId: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      };

      // Listen for socket events
      socket.on('newMessage', handleNewMessage);
      socket.on('messageUpdated', handleMessageUpdate);
      socket.on('messageDeleted', handleMessageDelete);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('messageUpdated', handleMessageUpdate);
        socket.off('messageDeleted', handleMessageDelete);
      };
    }
  }, [socket, groupId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages,
    connected
  };
} 