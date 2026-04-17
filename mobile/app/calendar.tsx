import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { z } from 'zod'
import {
  CalendarEventItemSchema,
  CreateCalendarEventResponseSchema,
  ListCalendarEventsResponseSchema,
  UpdateCalendarEventResponseSchema,
} from '@family-app/types'

/** Force this screen to always use light palette (ignore system dark mode). */
const L = Colors.light

type CalendarEventItem = z.infer<typeof CalendarEventItemSchema>

const API_URL = process.env.EXPO_PUBLIC_API_URL
// TODO make calendar work with groups.
// Temporary placeholder
const GROUP_ID = 1

export default function CalendarScreen() {
  // Even though server API uses a map, we use an array here because it converts easily to JSON
  const [events, setEvents] = useState<CalendarEventItem[]>([])
  const [newTime, setNewTime] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editLocation, setEditLocation] = useState('')
  /** When set, edit form is visible and targets this event. */
  const [editingId, setEditingId] = useState<string | null>(null)

  const eventsUrl = `${API_URL}/api/groups/${GROUP_ID}/calendar/events`

  // Initial data load
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(eventsUrl)
      const data = ListCalendarEventsResponseSchema.parse(await res.json())
      setEvents(data.events)
    }

    fetchEvents()
  }, [eventsUrl])

  const resetCreateForm = () => {
    setNewTime('')
    setNewTitle('')
    setNewLocation('')
  }

  const resetEditForm = () => {
    setEditTime('')
    setEditTitle('')
    setEditLocation('')
    setEditingId(null)
  }

  const handleCreate = async (
    time: string,
    title: string,
    location: string
  ) => {
    const res = await fetch(eventsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time, title, location }),
    })
    const created = CreateCalendarEventResponseSchema.parse(await res.json())
    setEvents((prev) => [...prev, created])
  }

  const handleUpdate = async (
    id: string,
    time: string,
    title: string,
    location: string
  ) => {
    const res = await fetch(eventsUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        time,
        title,
        location,
      }),
    })
    const updated = UpdateCalendarEventResponseSchema.parse(await res.json())
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  const handleCreateSubmit = async () => {
    const t = newTime.trim()
    if (!t.includes(":") || t.length) {

    }
    const n = newTitle.trim()
    const loc = newLocation.trim()
    if (!t || !n) return

    await handleCreate(t, n, loc)
    resetCreateForm()
  }

  const handleEditSubmit = async () => {
    if (!editingId) return

    const t = editTime.trim()
    const n = editTitle.trim()
    const loc = editLocation.trim()
    if (!t || !n) return

    await handleUpdate(editingId, t, n, loc)
    resetEditForm()
  }

  const handleEdit = (e: CalendarEventItem) => {
    setEditingId(e.id)
    setEditTime(e.time)
    setEditTitle(e.title)
    setEditLocation(e.location)
  }

  const handleDelete = async (id: string) => {
    await fetch(eventsUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setEvents((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) resetEditForm()
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

      <ThemedText
        style={styles.sectionLabel}
        lightColor={L.text}
        darkColor={L.text}
      >
        Add event
      </ThemedText>

      <TextInput
        placeholder="Time (e.g. 4:30)"
        placeholderTextColor={L.icon}
        value={newTime}
        onChangeText={setNewTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Title"
        placeholderTextColor={L.icon}
        value={newTitle}
        onChangeText={setNewTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Location (optional)"
        placeholderTextColor={L.icon}
        value={newLocation}
        onChangeText={setNewLocation}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Pressable onPress={handleCreateSubmit} style={styles.formButton}>
          <ThemedText lightColor={L.text} darkColor={L.text}>
            Add event
          </ThemedText>
        </Pressable>
      </View>

      {editingId ? (
        <>
          <ThemedText
            style={styles.sectionLabel}
            lightColor={L.text}
            darkColor={L.text}
          >
            Edit event
          </ThemedText>

          <TextInput
            placeholder="Time (e.g. 4:30)"
            placeholderTextColor={L.icon}
            value={editTime}
            onChangeText={setEditTime}
            style={styles.input}
          />
          <TextInput
            placeholder="Title"
            placeholderTextColor={L.icon}
            value={editTitle}
            onChangeText={setEditTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Location (optional)"
            placeholderTextColor={L.icon}
            value={editLocation}
            onChangeText={setEditLocation}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <Pressable onPress={handleEditSubmit} style={styles.formButton}>
              <ThemedText lightColor={L.text} darkColor={L.text}>
                Save changes
              </ThemedText>
            </Pressable>
            <Pressable onPress={resetEditForm} style={styles.formButton}>
              <ThemedText lightColor={L.text} darkColor={L.text}>
                Cancel edit
              </ThemedText>
            </Pressable>
          </View>
        </>
      ) : null}

      <ThemedText
        style={styles.eventsTitle}
        lightColor={L.text}
        darkColor={L.text}
      >
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

              <Pressable
                onPress={() => handleEdit(e)}
                style={styles.rowActionBtn}
              >
                <ThemedText lightColor={L.text} darkColor={L.text}>
                  Edit
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => handleDelete(e.id)}
                style={styles.rowActionBtn}
              >
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
