import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, Platform, Image, ScrollView } from 'react-native'
import { fetchAllProducts } from '../services/productApi'
import { fetchActiveResellersSortedByName } from '../services/resellerApi'

const NAVY = '#1F384C'

export default function HomeScreen() {
  const [productCount, setProductCount] = useState(null)
  const [resellerCount, setResellerCount] = useState(null)

  useEffect(() => {
    fetchAllProducts()
      .then((data) => setProductCount(data.length))
      .catch(() => setProductCount('—'))

    fetchActiveResellersSortedByName({ limit: 100 })
      .then(({ resellers }) => setResellerCount(resellers.length))
      .catch(() => setResellerCount('—'))
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

          {[
            { title: 'Price update for Bigas Dinorado', time: 'Today' },
            { title: 'New reseller onboarded: Marilou Store', time: 'Yesterday' },
            { title: 'Monthly inventory check scheduled', time: '2 days ago' },
          ].map((item, index) => (
            <View
              key={index}
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
              <Text className='text-xs text-slate-400'>{item.time}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}
