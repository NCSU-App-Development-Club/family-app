import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native'
import { z } from 'zod'
import {
  CalendarEventItemSchema,
  CreateCalendarEventResponseSchema,
  ListCalendarEventsResponseSchema,
  UpdateCalendarEventResponseSchema,
} from '@family-app/types'

type CalendarEventItem = z.infer<typeof CalendarEventItemSchema>

const API_URL = process.env.EXPO_PUBLIC_API_URL
// TODO make calendar work with groups.
// Temporary placeholder
const GROUP_ID = 1
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const meridiem = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${hour12}:${minute} ${meridiem}`
})

export default function CalendarScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const C = isDark ? Colors.dark : Colors.light
  const S = {
    pageBg: isDark ? '#0b1220' : '#f3f6fb',
    cardBg: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#374151' : '#e5e7eb',
    muted: isDark ? '#9ca3af' : '#6b7280',
    primary: '#2563eb',
    primaryText: '#ffffff',
    danger: '#ef4444',
    inputBg: isDark ? '#1f2937' : '#f9fafb',
  } as const

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
    <ThemedView style={[styles.screen, { backgroundColor: S.pageBg }]}>
      <ThemedText type="title" style={styles.pageTitle}>
        Family Calendar
      </ThemedText>

      <View
        style={[
          styles.formCard,
          { borderColor: S.border, backgroundColor: S.cardBg },
        ]}
      >
        <ThemedText style={styles.sectionLabel}>Add event</ThemedText>
        <View
          style={[
            styles.pickerWrap,
            { borderColor: S.border, backgroundColor: S.inputBg },
          ]}
        >
          <Picker
            selectedValue={newTime}
            onValueChange={(v) => setNewTime(v)}
            style={[styles.picker, { color: C.text }]}
          >
            <Picker.Item label="Select time..." value="" />
            {TIME_OPTIONS.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Title"
          placeholderTextColor={S.muted}
          value={newTitle}
          onChangeText={setNewTitle}
          style={[
            styles.input,
            {
              borderColor: S.border,
              backgroundColor: S.inputBg,
              color: C.text,
            },
          ]}
        />
        <TextInput
          placeholder="Location (optional)"
          placeholderTextColor={S.muted}
          value={newLocation}
          onChangeText={setNewLocation}
          style={[
            styles.input,
            {
              borderColor: S.border,
              backgroundColor: S.inputBg,
              color: C.text,
            },
          ]}
        />

        <View style={styles.buttonRow}>
          <Pressable
            onPress={handleCreateSubmit}
            style={[
              styles.formButton,
              styles.primaryButton,
              { borderColor: S.primary, backgroundColor: S.primary },
            ]}
          >
            <ThemedText lightColor={S.primaryText} darkColor={S.primaryText}>
              Add event
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {editingId ? (
        <View
          style={[
            styles.formCard,
            { borderColor: S.border, backgroundColor: S.cardBg },
          ]}
        >
          <ThemedText style={styles.sectionLabel}>Edit event</ThemedText>

          <View
            style={[
              styles.pickerWrap,
              {
                borderColor: S.border,
                backgroundColor: S.inputBg,
              },
            ]}
          >
            <Picker
              selectedValue={editTime}
              onValueChange={(v) => setEditTime(v)}
              style={[styles.picker, { color: C.text }]}
            >
              <Picker.Item label="Select time..." value="" />
              {TIME_OPTIONS.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Title"
            placeholderTextColor={S.muted}
            value={editTitle}
            onChangeText={setEditTitle}
            style={[
              styles.input,
              {
                borderColor: S.border,
                backgroundColor: S.inputBg,
                color: C.text,
              },
            ]}
          />
          <TextInput
            placeholder="Location (optional)"
            placeholderTextColor={S.muted}
            value={editLocation}
            onChangeText={setEditLocation}
            style={[
              styles.input,
              {
                borderColor: S.border,
                backgroundColor: S.inputBg,
                color: C.text,
              },
            ]}
          />

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleEditSubmit}
              style={[
                styles.formButton,
                styles.primaryButton,
                { borderColor: S.primary, backgroundColor: S.primary },
              ]}
            >
              <ThemedText lightColor={S.primaryText} darkColor={S.primaryText}>
                Save changes
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={resetEditForm}
              style={[
                styles.formButton,
                styles.secondaryButton,
                { borderColor: S.border, backgroundColor: S.cardBg },
              ]}
            >
              <ThemedText>Cancel edit</ThemedText>
            </Pressable>
          </View>
        </View>
      ) : null}

      <ThemedText style={styles.eventsTitle}>Events</ThemedText>
      <ScrollView style={styles.scroll}>
        {events.length === 0 ? (
          <ThemedText
            style={styles.emptyState}
            lightColor={S.muted}
            darkColor={S.muted}
          >
            No events yet.
          </ThemedText>
        ) : (
          events.map((e) => (
            <View
              key={e.id}
              style={[
                styles.card,
                { borderColor: S.border, backgroundColor: S.cardBg },
              ]}
            >
              <View style={styles.cardMain}>
                <ThemedText style={styles.eventTitle}>{e.title}</ThemedText>
                <ThemedText
                  style={styles.timeLine}
                  lightColor={S.muted}
                  darkColor={S.muted}
                >
                  {e.time}
                </ThemedText>
                {e.location ? (
                  <ThemedText
                    style={styles.locationLine}
                    lightColor={S.muted}
                    darkColor={S.muted}
                  >
                    {e.location}
                  </ThemedText>
                ) : null}
              </View>

              <Pressable
                onPress={() => handleEdit(e)}
                style={[
                  styles.rowActionBtn,
                  styles.editButton,
                  { backgroundColor: S.primary },
                ]}
              >
                <ThemedText
                  lightColor={S.primaryText}
                  darkColor={S.primaryText}
                >
                  Edit
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => handleDelete(e.id)}
                style={[
                  styles.rowActionBtn,
                  styles.deleteButton,
                  { backgroundColor: S.danger },
                ]}
              >
                <ThemedText
                  lightColor={S.primaryText}
                  darkColor={S.primaryText}
                >
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
    padding: 16,
  },
  pageTitle: {
    marginBottom: 12,
  },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    minHeight: 40,
  },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    minHeight: 40,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  formButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  primaryButton: {
    // dynamic colors applied inline
  },
  secondaryButton: {
    // dynamic colors applied inline
  },
  eventsTitle: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  emptyState: {
    paddingVertical: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardMain: {
    flex: 1,
    minWidth: 120,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeLine: {
    marginTop: 2,
    fontSize: 13,
  },
  locationLine: {
    marginTop: 4,
    fontSize: 13,
  },
  rowActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  editButton: {
    // dynamic colors applied inline
  },
  deleteButton: {
    // dynamic colors applied inline
  },
})
