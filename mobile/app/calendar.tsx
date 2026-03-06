import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
// import { IoIosNotifications } from 'react-icons/io'

export default function Calendar() {
  return (
    <ThemedView>
      {/* <ThemedText type="title">Calendar page contents </ThemedText> */}

      <Header />
    </ThemedView>
  )
}

function Header() {
  const name: string = 'Testing'

  return (
    <>
      <ThemedView>
        <ThemedText>{name}</ThemedText>
      </ThemedView>
    </>
  )
}
