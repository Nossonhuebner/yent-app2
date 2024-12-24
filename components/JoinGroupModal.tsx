import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Modal from './Modal';
import Constants from 'expo-constants';

type JoinGroupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function JoinGroupModal({
  visible,
  onClose,
  onSuccess,
}: JoinGroupModalProps) {
  const [groupId, setGroupId] = useState('');
  const [username, setUsername] = useState('');
  const { colors } = useTheme();
  const { token } = useAuth();

  const handleJoin = async () => {
    if (!groupId.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        `${Constants.expoConfig?.extra?.apiUrl}/api/groups/${groupId}/join`,
        {
          username: username.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setGroupId('');
      setUsername('');
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Join Group">
      <View>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text,
          }]}
          placeholder="Group ID"
          placeholderTextColor={colors.placeholder}
          value={groupId}
          onChangeText={setGroupId}
        />
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text,
          }]}
          placeholder="Your Username in Group"
          placeholderTextColor={colors.placeholder}
          value={username}
          onChangeText={setUsername}
        />
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleJoin}
        >
          <Text style={styles.buttonText}>Join Group</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 