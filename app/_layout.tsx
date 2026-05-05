import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AppProvider, useAppContext } from '../src/context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

function RootLayoutContent() {
  const { user, isLoaded, apiKey } = useAppContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to main if authenticated
      if (!apiKey) {
        router.replace('/(main)/settings');
      } else {
        router.replace('/(main)/home');
      }
    }
  }, [user, isLoaded, segments, apiKey]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <RootLayoutContent />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
