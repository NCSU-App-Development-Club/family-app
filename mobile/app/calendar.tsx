import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

/** Force this screen to always use light palette (ignore system dark mode). */
const L = Colors.light

export type CalendarEventItem = {
  id: string
  time: string
  title: string
  /** Where the event happens (optional). */
  location: string
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEventItem[]>([
    { id: '1', time: '4:30', title: 'Soccer', location: 'Field A' },
    { id: '2', time: '6:00', title: 'Dinner', location: 'Home' },
  ])
  const [time, setTime] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  /** When set, the form updates this event instead of creating a new one */
  const [editingId, setEditingId] = useState<string | null>(null)

  const resetForm = () => {
    setTime('')
    setTitle('')
    setLocation('')
    setEditingId(null)
  }

  const handleSave = () => {
    const t = time.trim()
    const n = title.trim()
    const loc = location.trim()
    if (!t || !n) return

    if (editingId) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingId ? { ...e, time: t, title: n, location: loc } : e
        )
      )
    } else {
      setEvents((prev) => [
        ...prev,
        { id: `${Date.now()}`, time: t, title: n, location: loc },
      ])
    }
    resetForm()
  }

  const handleEdit = (e: CalendarEventItem) => {
    setEditingId(e.id)
    setTime(e.time)
    setTitle(e.title)
    setLocation(e.location)
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <ThemedView
      lightColor={L.background}
      darkColor={L.background}
      style={styles.screen}
    >
      <ThemedText type="title" lightColor={L.text} darkColor={L.text}>
        Calendar
      </ThemedText>

      <ThemedText style={styles.sectionLabel} lightColor={L.text} darkColor={L.text}>
        New / edit event
      </ThemedText>

      <TextInput
        placeholder="Time (e.g. 4:30)"
        placeholderTextColor={L.icon}
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Title"
        placeholderTextColor={L.icon}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Location (optional)"
        placeholderTextColor={L.icon}
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Pressable onPress={handleSave} style={styles.formButton}>
          <ThemedText lightColor={L.text} darkColor={L.text}>
            {editingId ? 'Save changes' : 'Add event'}
          </ThemedText>
        </Pressable>
        {editingId ? (
          <Pressable onPress={resetForm} style={styles.formButton}>
            <ThemedText lightColor={L.text} darkColor={L.text}>
              Cancel edit
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      <ThemedText style={styles.eventsTitle} lightColor={L.text} darkColor={L.text}>
        Events
      </ThemedText>
      <ScrollView style={styles.scroll}>
        {events.length === 0 ? (
          <ThemedText lightColor={L.text} darkColor={L.text}>
            No events yet.
          </ThemedText>
        ) : (
          events.map((e) => (
            <View key={e.id} style={styles.card}>
              <View style={styles.cardMain}>
                <ThemedText lightColor={L.text} darkColor={L.text}>
                  {e.time} — {e.title}
                </ThemedText>
                {e.location ? (
                  <ThemedText
                    style={styles.locationLine}
                    lightColor={L.icon}
                    darkColor={L.icon}
                  >
                    {e.location}
                  </ThemedText>
                ) : null}
              </View>

              <Pressable onPress={() => handleEdit(e)} style={styles.rowActionBtn}>
                <ThemedText lightColor={L.text} darkColor={L.text}>
                  Edit
                </ThemedText>
              </Pressable>

              <Pressable onPress={() => handleDelete(e.id)} style={styles.rowActionBtn}>
                <ThemedText lightColor={L.text} darkColor={L.text}>
                  Delete
                </ThemedText>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
  },
  sectionLabel: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: L.background,
    color: L.text,
    padding: 8,
    marginVertical: 4,
    minHeight: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: L.background,
  },
  eventsTitle: {
    marginTop: 16,
  },
  scroll: {
    flex: 1,
    marginTop: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: L.background,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardMain: {
    flex: 1,
    minWidth: 120,
  },
  locationLine: {
    marginTop: 4,
  },
  rowActionBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
})
