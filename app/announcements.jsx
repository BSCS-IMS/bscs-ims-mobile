import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { fetchAllPublishedAnnouncements } from '../services/announcementApi'

const NAVY = '#1F384C'
const BG = '#F1F2F7'

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AnnouncementsScreen() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllPublishedAnnouncements()
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error('Failed to fetch announcements:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle='dark-content' backgroundColor={BG} />
      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name='chevron-back' size={22} color={NAVY} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Announcements</Text>
      </View>

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size='large' color={NAVY} />
        </View>
      ) : (
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {announcements.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>No announcements yet</Text>
            </View>
          ) : (
            announcements.map((item) => (
              <View key={item.id} style={s.card}>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardContent}>{item.content}</Text>
                <Text style={s.cardDate}>{formatTimestamp(item.publishAt)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    marginRight: 8,
    padding: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
    letterSpacing: 0.2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 12,
    fontWeight: '400',
    color: '#475569',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
})
