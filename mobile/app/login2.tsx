import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import {useThemeColor} from '@/hooks/use-theme-color'
import {StyleSheet, Text} from 'react-native'
import {useState} from 'react'
import type { FormEvent, ChangeEvent } from 'react'; 
import { useRouter } from 'expo-router';

export default function Login2() {
  //
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background')
  // const themeColor = useThemeColor({"White", Black},"White")
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); 
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    //TODO implement logic for handling submission
    console.log('Form submitted with name:', name);
    router.push('/calendar')
  };


  return (
    <ThemedView style={{...styles.container, backgroundColor: backgroundColor}}>
      <ThemedText type="title">Login page contents</ThemedText>
      <br></br>
      <ThemedView style={{backgroundColor: backgroundColor}}>
      <ThemedText style={{color: textColor}}>Your info</ThemedText>
      <br></br>
      <ThemedText style={{color: textColor}}>How should we contact you?</ThemedText>
      <form onSubmit={handleSubmit}>
        <ThemedText>
          Email:
        </ThemedText>
        <input type="text" value={email} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 50,
  },
})



