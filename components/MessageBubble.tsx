import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatRelativeTime } from '@/utils/dateUtils';
import ReplyHandle from './ReplyHandle';

type MessageBubbleProps = {
  content: string;
  senderName: string;
  timestamp: string;
  isAnonymous: boolean;
  isSelf: boolean;
  parentMessage?: {
    content: string;
    senderName: string;
  };
  onReply: () => void;
};

export default function MessageBubble({ 
  content, 
  senderName, 
  timestamp, 
  isAnonymous, 
  isSelf,
  parentMessage,
  onReply
}: MessageBubbleProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container,
      isSelf ? styles.selfContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isSelf ? [styles.selfBubble, { backgroundColor: colors.primary }] : [styles.otherBubble, { backgroundColor: colors.card }]
      ]}>
        {parentMessage && (
          <View style={[styles.parentMessage, { 
            backgroundColor: isSelf ? 'rgba(255,255,255,0.1)' : colors.background 
          }]}>
            <Text style={[styles.parentName, { 
              color: isSelf ? 'rgba(255,255,255,0.7)' : colors.primary 
            }]} numberOfLines={1}>
              {parentMessage.senderName}
            </Text>
            <Text style={[styles.parentContent, { 
              color: isSelf ? 'rgba(255,255,255,0.9)' : colors.text 
            }]} numberOfLines={1}>
              {parentMessage.content}
            </Text>
          </View>
        )}
        
        <Text style={[
          styles.name,
          { color: isSelf ? '#fff' : colors.primary }
        ]}>
          {senderName}
          {isAnonymous && ' 🎭'}
        </Text>
        
        <Text style={[
          styles.content,
          { color: isSelf ? '#fff' : colors.text }
        ]}>
          {content}
        </Text>
        
        <Text style={[
          styles.timestamp,
          { color: isSelf ? 'rgba(255,255,255,0.7)' : colors.placeholder }
        ]}>
          {formatRelativeTime(new Date(timestamp))}
        </Text>

        <ReplyHandle onReply={onReply} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 2,
    marginBottom: 20, // Add space for reply handle
  },
  selfContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
  },
  selfBubble: {
    borderTopRightRadius: 5,
  },
  otherBubble: {
    borderTopLeftRadius: 5,
  },
  parentMessage: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  parentName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  parentContent: {
    fontSize: 12,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
}); 