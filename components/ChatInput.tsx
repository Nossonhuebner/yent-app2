import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type ChatInputProps = {
  onSend: (content: string, useGeneratedIdentity: boolean) => void;
  disabled?: boolean;
  replyTo?: {
    content: string;
    senderName: string;
  } | null;
  onCancelReply?: () => void;
};

export default function ChatInput({ onSend, disabled, replyTo, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [useAnonymous, setUseAnonymous] = useState(true);
  const { colors } = useTheme();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim(), useAnonymous);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          opacity: disabled ? 0.7 : 1 
        }
      ]}>
        <TouchableOpacity
          onPress={() => setUseAnonymous(!useAnonymous)}
          style={[styles.anonymousButton, { 
            backgroundColor: useAnonymous ? colors.primary : colors.background 
          }]}
          disabled={disabled}
        >
          <Ionicons 
            name="mask-outline" 
            size={24} 
            color={useAnonymous ? '#fff' : colors.text} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text
          }]}
          value={message}
          onChangeText={setMessage}
          placeholder={disabled ? "Reconnecting..." : "Type a message..."}
          placeholderTextColor={colors.placeholder}
          multiline
          editable={!disabled}
        />
        
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, { 
            backgroundColor: message.trim() && !disabled ? colors.primary : colors.background 
          }]}
          disabled={!message.trim() || disabled}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={message.trim() && !disabled ? '#fff' : colors.placeholder} 
          />
        </TouchableOpacity>
      </View>
      {replyTo && (
        <View style={[styles.replyPreview, { backgroundColor: colors.card }]}>
          <View style={styles.replyContent}>
            <Text style={[styles.replyName, { color: colors.primary }]}>
              Replying to {replyTo.senderName}
            </Text>
            <Text style={[styles.replyText, { color: colors.text }]} numberOfLines={1}>
              {replyTo.content}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  anonymousButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  replyPreview: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  replyContent: {
    flex: 1,
    marginRight: 8,
  },
  replyName: {
    fontSize: 12,
    fontWeight: '600',
  },
  replyText: {
    fontSize: 14,
  },
}); 