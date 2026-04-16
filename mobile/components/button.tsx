/**
 * Primary action button that uses theme colors and state
 * Handles disabled (0.5 opacity), pressed (0.9 opacity), and uses colors from theme (light/dark).
 * @author Zachary Nurkiewicz
 * @file button.tsx
 */

import { Pressable, StyleSheet, type PressableProps } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

/**
 * Handles the opacity of the button based on state
 * @param disabled: boolean is whether or not the button is disabled
 * @param pressed: boolean is whether or not the button is pressed
 */
const stateStyle = (disabled: boolean, pressed: boolean) => ({
  opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
})

/**
 * Button component
 * @param onPress is the function to use when button is pressed
 * @param disabled is the condition that determines when the button is enabled/disabled (can either be from a function or just a boolean statement)
 * @param text is the text to use within the button
 * @param rest is other props that might need to be used for the button
 * @returns JSX for button
 */
export function Button({
  onPress,
  disabled,
  text = 'Continue',
  ...rest
}: {
  onPress?: PressableProps['onPress']
  disabled?: PressableProps['disabled']
  text?: string
}) {
  const buttonBackground = useThemeColor({}, 'buttonBackground')
  const buttonTextColor = useThemeColor({}, 'buttonText')

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: buttonBackground },
        stateStyle(disabled ?? false, pressed),
      ]}
      {...rest}
    >
      <ThemedText style={[styles.buttonText, { color: buttonTextColor }]}>
        {text}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
})
