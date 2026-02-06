import React from 'react'
import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'

export default function Index() {
  return (
    <SafeAreaView className='flex-1 bg-white p-4'>
      {/* Header */}
      <View className='mb-6 flex-row items-center justify-between'>
        <View className='h-12 w-12 items-center justify-center rounded-lg bg-gray-200'>
          <Text className='text-xs font-bold'>LOGO</Text>
        </View>

        <Text className='text-2xl font-bold'>Home</Text>
      </View>

      {/* Buttons */}
      <View className='mb-6 flex-row justify-between'>
        <TouchableOpacity
          className='mx-1 flex-1 items-center rounded-lg bg-blue-600 py-4 active:bg-blue-700'
          onPress={() => router.push('/screens/HomeScreen')}
        >
          <Text className='text-base font-semibold text-white'>Go to HomeScreen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className='mx-1 flex-1 items-center rounded-lg bg-blue-600 py-4 active:bg-blue-700'
          onPress={()=> router.push('/screens/ResellerScreen')}>
          <Text className='text-base font-semibold text-white'>Button 2</Text>
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <View className='flex-1'>
        <Text className='mb-3 text-lg font-bold'>Announcements</Text>

        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} className='mb-2 h-4 rounded bg-gray-200' />
        ))}
      </View>
    </SafeAreaView>
  )
}
