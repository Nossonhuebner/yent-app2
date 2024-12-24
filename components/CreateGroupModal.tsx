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

type CreateGroupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateGroupModal({
  visible,
  onClose,
  onSuccess,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [username, setUsername] = useState('');
  const { colors } = useTheme();
  const { token } = useAuth();

  const handleCreate = async () => {
    if (!groupName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        `${Constants.expoConfig?.extra?.apiUrl}/api/groups`,
        {
          name: groupName.trim(),
          username: username.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setGroupName('');
      setUsername('');
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Create New Group">
      <View>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text,
          }]}
          placeholder="Group Name"
          placeholderTextColor={colors.placeholder}
          value={groupName}
          onChangeText={setGroupName}
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
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Create Group</Text>
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