import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'

export default function Index() {
  return (
    <ThemedView>
      <Link href="/calendar">Calendar</Link>
      <Link href="/login">Login</Link>
      <Link href="/family/setup">Family Setup</Link>
    </ThemedView>
  )
}
