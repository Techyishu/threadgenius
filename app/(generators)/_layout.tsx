import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function GeneratorsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="tweet"
        options={{
          title: 'Tweet Generator',
        }}
      />
      <Stack.Screen
        name="thread"
        options={{
          title: 'Thread Generator',
        }}
      />
      <Stack.Screen
        name="bio"
        options={{
          title: 'Bio Generator',
        }}
      />
    </Stack>
  );
} 