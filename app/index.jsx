import { useEffect, useState, useCallback } from 'react'
import { View, Text, SafeAreaView, StatusBar, Platform, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { subscribeToAllProductsCount } from '../services/productApi'
import { subscribeToAllResellersCount } from '../services/resellerApi'
import { subscribeToPublishedAnnouncements, getPublishedAnnouncementsCount } from '../services/announcementApi'

const NAVY = '#1F384C'

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleString('en-US', options)
}

export default function HomeScreen() {
  const router = useRouter()
  const [productCount, setProductCount] = useState(null)
  const [resellerCount, setResellerCount] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [totalAnnouncements, setTotalAnnouncements] = useState(0)

  useEffect(() => {
    const unsubscribeProducts = subscribeToAllProductsCount((count) => {
      setProductCount(count)
    })

    const unsubscribeResellers = subscribeToAllResellersCount((count) => {
      setResellerCount(count)
    })

    // Get total count of announcements (no real-time listener needed for just the total > 5 check, but can be done)
    getPublishedAnnouncementsCount()
      .then((count) => setTotalAnnouncements(count))
      .catch((err) => console.error('Failed to get announcement count:', err))

    return () => {
      if (unsubscribeProducts) unsubscribeProducts()
      if (unsubscribeResellers) unsubscribeResellers()
    }
  }, [])

  useEffect(() => {

    // Subscribe to real-time announcements for display
    const unsubscribe = subscribeToPublishedAnnouncements(5, (data) => {
      setAnnouncements(data)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-slate-50'>
      <StatusBar barStyle='dark-content' backgroundColor='#F8FAFC' />
      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <ScrollView className='flex-1 px-5' showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='flex-row items-center gap-3 mb-6 pt-4'>
          <Image
            source={require('../assets/LOGO_CLEAR.png')}
            style={{ width: 44, height: 44, borderRadius: 22 }}
            resizeMode='contain'
          />
          <View>
            <Text className='text-lg font-bold text-slate-900'>MURANG BIGAS</Text>
            <Text className='text-xs text-slate-500 tracking-widest uppercase'>Livelihood</Text>
          </View>
        </View>

        {/* Welcome banner */}
        <View className='rounded-2xl px-5 py-6 mb-6' style={{ backgroundColor: NAVY }}>
          <Text className='text-white text-xl font-bold mb-1'>Welcome back!</Text>
          <Text className='text-blue-200 text-sm'>
            Here's an overview of your inventory and reseller network.
          </Text>
        </View>

        {/* Stat cards */}
        <View className='flex-row gap-4 mb-6'>
          <View
            className='flex-1 rounded-2xl px-4 py-5 items-center justify-center'
            style={{ backgroundColor: '#E8EEF4', borderWidth: 1, borderColor: '#C6D4E0' }}
          >
            <Text className='text-3xl font-bold' style={{ color: NAVY }}>
              {productCount === null ? '…' : productCount}
            </Text>
            <Text className='text-sm font-semibold mt-1' style={{ color: NAVY }}>Products</Text>
          </View>

          <View
            className='flex-1 rounded-2xl px-4 py-5 items-center justify-center'
            style={{ backgroundColor: '#E8EEF4', borderWidth: 1, borderColor: '#C6D4E0' }}
          >
            <Text className='text-3xl font-bold' style={{ color: NAVY }}>
              {resellerCount === null ? '…' : resellerCount}
            </Text>
            <Text className='text-sm font-semibold mt-1' style={{ color: NAVY }}>Resellers</Text>
          </View>
        </View>

        {/* Announcements */}
        <View className='mb-6'>
          <Text className='text-lg font-bold text-slate-900 mb-3'>Announcements</Text>

          {announcements.length === 0 ? (
            <View className='bg-white rounded-xl px-4 py-6 border border-gray-100'>
              <Text className='text-sm text-slate-400 text-center'>No announcements yet</Text>
            </View>
          ) : (
            <>
              {announcements.map((item) => (
                <View
                  key={item.id}
                  className='bg-white rounded-xl px-4 py-4 mb-3 border border-gray-100'
                  style={{
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                  }}
                >
                  <Text className='text-sm font-semibold text-slate-800 mb-1'>{item.title}</Text>
                  <Text className='text-xs text-slate-600 mb-2' numberOfLines={3}>
                    {item.content}
                  </Text>
                  <Text className='text-xs text-slate-400'>{formatTimestamp(item.publishAt)}</Text>
                </View>
              ))}

              {totalAnnouncements > 5 && (
                <TouchableOpacity
                  className='items-center py-2'
                  onPress={() => router.push('/announcements')}
                >
                  <Text className='text-sm font-semibold' style={{ color: NAVY }}>
                    View more announcements
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
