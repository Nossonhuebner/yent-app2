import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import GroupListItem from '@/components/GroupListItem';
import CreateGroupModal from '@/components/CreateGroupModal';
import JoinGroupModal from '@/components/JoinGroupModal';
import Constants from 'expo-constants';

type Group = {
  id: string;
  name: string;
  lastMessage: {
    content: string;
    createdAt: string;
    senderIdentity: {
      name: string;
      id: string;
    };
  } | null;
};

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const router = useRouter();
  const { colors } = useTheme();
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const activeGroupId = params.id;

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.apiUrl}/api/groups`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGroups();
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
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowJoinModal(true)}
        >
          <Ionicons name="enter" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <GroupListItem
            name={item.name}
            lastMessage={item.lastMessage && {
              content: item.lastMessage.content,
              senderName: item.lastMessage.senderIdentity.name,
              timestamp: item.lastMessage.createdAt
            }}
            onPress={() => router.push(`/app/chat/${item.id}`)}
            isActive={item.id === activeGroupId}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      />

      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchGroups}
      />

      <JoinGroupModal
        visible={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={fetchGroups}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 