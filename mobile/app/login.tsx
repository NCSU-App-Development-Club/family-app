/**
 * Two-step login/onboarding screen.
 * Step 1 collects the user's name, step 2 collects the user's email.
 * Uses a single component with internal step state and reuses shared card styles.
 * 
 * Step state is handled by 
 * @author Zachary Nurkiewicz
 * @file login.tsx
 */
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native'

// Type for determining step we are on
type Step = 1 | 2

export default function Login() {
  // expo router used to go to next page
  // TODO make the router re-route to actual desired next page (routes to calendar)
  // as a placeholder
  const router = useRouter()
  // tracks the state for the step
  const [step, setStep] = useState<Step>(1)
  // tracks the state for the name
  const [name, setName] = useState('')
  // tracks the state for the email
  const [email, setEmail] = useState('')

  // get the colors from our theme
  const screenBg = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const cardBg = useThemeColor(
    { light: '#FFFFFF', dark: '#1C1D1E' },
    'background'
  )
  const inputBg = useThemeColor(
    { light: '#F2F4F6', dark: '#2A2C2E' },
    'background'
  )
  const inputText = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text')
  const placeholderTextColor = useThemeColor(
    { light: '#7A7F85', dark: '#8B9096' },
    'text'
  )
  const borderColor = useThemeColor(
    { light: '#D3EDEC', dark: '#2F6E6B' },
    'text'
  )

  /**
   * Determines whether the user can continue
   * step 1 requires a non-empty name
   * step 2 requires a non-empty email that contains '@'
   */
  const canContinue = useMemo(() => {
    if (step === 1) {
      return name.trim().length > 0
    } else {
      return email.trim().length > 0 && email.includes('@')
    }
  }, [email, name, step])

  /**
   * Handles the logic for the back button
   * @returns
   */
  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      return
    }
    router.back()
  }

  /**
   * Handles the logic for our continue buttons
   * step 1 simply updates the state and goes to step 2
   * step 2 gives us a POJO from the information to post to API
   * @returns 
   */
  const handleContinue = () => {
    if (step === 1) {
      setName((n) => n.trim())
      setStep(2)
      return
    }

    //TODO post to API once we have it
    const payload = { name: name.trim(), email: email.trim() }
    console.log('Collected info:', payload)
    //TODO update me to push to the proper next page
    router.push('/calendar')
  }

  // Determines the subtitled based on the step
  const subtitle =
    step === 1 ? 'How should we identify you?' : 'How should we contact you?'

  // Determines label/value based on the step
  const label = step === 1 ? 'Name' : 'Email'
  const value = step === 1 ? name : email
  const onChangeText = step === 1 ? setName : setEmail

  // Give props to the screen based on what step we are on
  let inputProps: TextInputProps
  if (step === 1) {
    inputProps = {
      placeholder: 'John Smith',
      autoCapitalize: 'words',
      autoCorrect: false,
      keyboardType: 'default',
      returnKeyType: 'next',
      onSubmitEditing: () => setStep(2),
    }
  } else {
    inputProps = {
      placeholder: 'john@example.com',
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'email-address',
      returnKeyType: 'done',
    }
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: screenBg }]}>
      {/* Pushes the UI up for mobile keyboard */}
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          {/* hitSlop defines area for how big button is. Used because button is kinda small*/}
          <Pressable onPress={handleBack} style={styles.backRow} hitSlop={10}>
            <ThemedText style={[styles.backText, { color: textColor }]}>
              {'‹  Back'}
            </ThemedText>
          </Pressable>

          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Your Info
          </ThemedText>
          <ThemedText style={[styles.sectionSubtitle, { color: textColor }]}>
            {subtitle}
          </ThemedText>

          <ThemedText style={[styles.label, { color: textColor }]}>
            {label}
          </ThemedText>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={placeholderTextColor}
            style={[
              styles.input,
              { backgroundColor: inputBg, color: inputText, borderColor },
            ]}
            {...inputProps}
          />

          <Pressable
            onPress={handleContinue}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.button,
              { opacity: !canContinue ? 0.5 : pressed ? 0.9 : 1 },
            ]}
          >
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(90, 190, 186, 0.45)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  backRow: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.85,
  },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  button: {
    marginTop: 16,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#55CFCB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
})
