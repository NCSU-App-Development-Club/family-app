import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function Login() {
  return (
    <ThemedView>
      <ThemedText type="title">Login page contents</ThemedText>
      <ThemedText>
        This page should contain a short introduction of the app's features and
        a button to start the login process.
      </ThemedText>
    </ThemedView>
  )
}
