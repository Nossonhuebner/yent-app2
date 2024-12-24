import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Groups() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Groups Screen</Text>
    </View>
  );
} 