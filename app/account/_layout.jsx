import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerStyle: {
          backgroundColor: '#bf0000'
        },
        headerTintColor: '#fff',
      }}
    />
  );
}
