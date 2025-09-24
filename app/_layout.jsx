import { Slot, Stack } from 'expo-router';
import { GoalsProvider } from '../contexts/GoalsContext';

export default function Layout() {
  return (
    <GoalsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='login'/>
        <Stack.Screen name='signup'/>
        <Stack.Screen name='read'/>
        <Stack.Screen name='home'/>
      </Stack>
    </GoalsProvider>
  )
}
