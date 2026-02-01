import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

export default function HomeScreen() {
  const [products, setProducts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setRefreshing(true)
      const productsCol = collection(db, 'products')
      const snapshot = await getDocs(productsCol)
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsList)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-indigo-600 px-6 pb-6 pt-12'>
        <Text className='text-3xl font-bold text-white'>Product List</Text>
        <Text className='mt-1 text-indigo-200'>{products.length} products</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm'>
            <Text className='mb-2 text-lg font-bold text-gray-900'>{item.name}</Text>
            <Text className='mb-1 text-sm text-gray-600'>SKU: {item.sku}</Text>
            <Text className='mb-2 text-base font-semibold text-indigo-600'>
              Price: {item.currentPrice} {item.priceUnit}
            </Text>
            <View className={`self-start rounded-full px-3 py-1 ${item.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-semibold ${item.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProducts} />}
        contentContainerClassName='pb-4'
      />

      {/* Refresh Button */}
      <View className='p-4'>
        <TouchableOpacity className='rounded-lg bg-indigo-600 py-4 active:bg-indigo-700' onPress={fetchProducts}>
          <Text className='text-center text-base font-semibold text-white'>Refresh Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
