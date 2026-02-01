import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { router } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import HomeText from '../modules/home-screen/HomeText'

export default function HomeScreen() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'products'))
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsList)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <View className='flex-1 bg-gray-50 px-6 pt-12'>
      <Text className='mb-6 text-2xl font-bold'>This is HomeScreen</Text>

      <TouchableOpacity
        className='mb-6 rounded-lg bg-indigo-600 px-6 py-3 active:bg-indigo-700'
        onPress={() => router.back()}
      >
        <Text className='text-base font-semibold text-white'>Go Back</Text>
      </TouchableOpacity>

      <HomeText />

      <Text className='mt-6 mb-3 text-lg font-bold'>Products:</Text>
      {loading && <Text>Loading...</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='mb-3 rounded-lg bg-white p-4 shadow'>
            <Text className='text-base font-bold'>{item.name}</Text>
            <Text className='text-sm text-gray-600'>SKU: {item.sku}</Text>
            <Text className='text-base text-indigo-600'>
              Price: {item.currentPrice} {item.priceUnit}
            </Text>
            <View className={`self-start rounded-full px-3 py-1 ${item.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-semibold ${item.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}
