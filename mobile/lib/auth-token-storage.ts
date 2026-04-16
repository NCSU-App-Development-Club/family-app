import * as SecureStore from 'expo-secure-store'

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync('auth-token', token)
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync('auth-token')
}
