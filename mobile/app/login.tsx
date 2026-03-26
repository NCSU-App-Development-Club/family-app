/**
 * Two-step login/onboarding screen.
 * Step 1 collects the user's name, step 2 collects the user's email.
 * Uses a single component with internal step state and reuses shared card styles.
 *
 * Step state is tracked with state
 * @author Zachary Nurkiewicz
 * @file login.tsx
 */

import { Button } from '@/components/button'
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
  const [password, setPassword] = useState('')

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
    router.push('/')
  }

  // Determines the subtitled based on the step
  const subtitle =
    step === 1 ? 'How should we identify you?' : 'How should we contact you?'

  // Determines label/value based on the step
  const label = step === 1 ? 'Name' : 'Email and Password'
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
  const passwordProps = {
    placeholder: '••••',
    autoCorrect: false,
    textContentType: "password",
    secureTextEntry: true
  } as const

  return (
    <ThemedView style={[styles.screen, { backgroundColor: screenBg }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : Platform.OS === 'android'
              ? 'height'
              : undefined
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 0 : Platform.OS === 'android' ? 20 : 0
        }
      >
        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          {step === 2 && (
            <Pressable onPress={handleBack} style={styles.backRow} hitSlop={10}>
              <ThemedText style={[styles.backText, { color: textColor }]}>
                {'‹  Redo Name'}
              </ThemedText>
            </Pressable>
          )}

          <ThemedText style={[styles.stepIndicator, { color: textColor }]}>
            Step {step} of 2
          </ThemedText>
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
          <br></br>
          {(step === 2) && (

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={placeholderTextColor}
              style={[
                styles.input,
                { backgroundColor: inputBg, color: inputText, borderColor },
              ]}
              {...passwordProps}
            />)}




          <Button
            onPress={handleContinue}
            disabled={!canContinue}
            text="Continue"
          />


        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(90, 190, 186, 0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  backRow: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionSubtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.8,
  },
  label: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.9,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
  },
})
