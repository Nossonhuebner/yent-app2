import React, { useRef, useState } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    refreshMessages,
    connected 
  } = useChat(id as string);

  const handleSend = async (content: string, useGeneratedIdentity: boolean) => {
    try {
      await sendMessage(content, replyTo?.id, useGeneratedIdentity);
      setReplyTo(null);
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo({
      id: message.id,
      content: message.content,
      senderName: message.senderIdentity.name
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!connected && (
        <View style={[styles.connectionBanner, { backgroundColor: colors.primary }]}>
          <Text style={styles.connectionText}>Reconnecting...</Text>
        </View>
      )}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            senderName={item.senderIdentity.name}
            timestamp={item.createdAt}
            isAnonymous={item.senderType === 'ANONYMOUS_USER'}
            isSelf={item.senderIdentity.id === user?.id}
            parentMessage={item.parentId ? {
              content: messages.find(m => m.id === item.parentId)?.content || '',
              senderName: messages.find(m => m.id === item.parentId)?.senderIdentity.name || ''
            } : undefined}
            onReply={() => handleReply(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshMessages}
            colors={[colors.primary]}
          />
        }
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        style={styles.messageList}
      />
      
      <ChatInput 
        onSend={handleSend} 
        disabled={!connected}
        replyTo={replyTo && {
          content: replyTo.content,
          senderName: replyTo.senderName
        }}
        onCancelReply={() => setReplyTo(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  connectionBanner: {
    padding: 8,
    alignItems: 'center',
  },
  connectionText: {
    color: '#fff',
    fontSize: 14,
  },
}); 