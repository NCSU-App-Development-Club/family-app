import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { StyleSheet, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// import { IoIosNotifications } from 'react-icons/io'

type EventCardValues = {
  time: string
  title: string
  subtitle: string
  tag: string
  tags?: 'unclaimed' | 'assigned' | 'you'
  primaryAction?: string
  secondaryAction?: string
}

export default function Calendar() {
  return (
    <ThemedView style={styles.screen}>
      <Header />
    </ThemedView>
  )
}

function Header() {
  const familyName: string = 'Smith Family'

  return (
    <ThemedView style={styles.header}>
      <View style={styles.headerTopRow}>
        <ThemedText style={styles.familyName}>{familyName}</ThemedText>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          </Pressable>

          <Pressable style={[styles.iconButton, styles.profileButton]}>
            <Ionicons name="person-outline" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ThemedText style={styles.smallLabel}>TODAY</ThemedText>
      <ThemedText style={styles.bigDate}>Wed, Feb 26</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#F8FAFC',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  familyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  profileButton: {
    backgroundColor: '#2563EB',
  },
  smallLabel: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  bigDate: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
})
