import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatRelativeTime } from '@/utils/dateUtils';

type GroupListItemProps = {
  name: string;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: string;
  } | null;
  onPress: () => void;
  isActive?: boolean;
};

export default function GroupListItem({ 
  name, 
  lastMessage, 
  onPress, 
  isActive 
}: GroupListItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: isActive ? colors.card : 'transparent' }
      ]}
    >
      <View style={styles.avatar}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
          {lastMessage && (
            <Text style={[styles.time, { color: colors.placeholder }]}>
              {formatRelativeTime(new Date(lastMessage.timestamp))}
            </Text>
          )}
        </View>
        
        <Text 
          style={[styles.message, { 
            color: colors.placeholder,
            fontStyle: lastMessage ? 'normal' : 'italic'
          }]} 
          numberOfLines={1}
        >
          {lastMessage 
            ? `${lastMessage.senderName}: ${lastMessage.content}`
            : 'No messages yet'
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
  },
}); 