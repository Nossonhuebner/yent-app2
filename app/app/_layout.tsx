import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="groups" />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
} 