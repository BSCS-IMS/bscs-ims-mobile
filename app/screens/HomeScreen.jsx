import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import HomeText from '../modules/home-screen/HomeText' // receive this from modules folder

export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-gray-50 px-6'>
      <Text className='mb-6 text-2xl font-bold'>This is HomeScreen</Text>

      <TouchableOpacity
        className='rounded-lg bg-indigo-600 px-6 py-3 active:bg-indigo-700'
        onPress={() => router.back()}
      >
        <Text className='text-base font-semibold text-white'>Go Back</Text>
      </TouchableOpacity>
      <HomeText />
    </View>
  )
}
