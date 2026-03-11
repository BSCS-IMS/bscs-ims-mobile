import React, { useState, useEffect, useCallback } from 'react'
import { View, SafeAreaView, StatusBar, Platform, TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { subscribeToActiveProductsSorted } from '../services/productApi'
import { subscribeToInventoryQuantities } from '../services/inventoryApi'

import ProductScreenHeader from '../modules/product-screen/ProductScreenHeader'
import ProductListContainer from '../modules/product-screen/ProductListContainer'
import ProductModal from '../modules/product-screen/ProductModal'

const NAVY = '#1F384C'
const BG = '#F1F2F7'

export default function ProductsScreen() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState(null)
  const [asc, setAsc] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [limit, setLimit] = useState(10)
  const [limitOptionsOpen, setLimitOptionsOpen] = useState(false)
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const [allData, setAllData] = useState([])
  const [inventoryQuantities, setInventoryQuantities] = useState({})

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [search])

  // Subcribe to inventory quantities
  useEffect(() => {
    const unsubscribe = subscribeToInventoryQuantities((quantities) => {
      setInventoryQuantities(quantities)
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Filter data client-side and attach calculated quantities
  useEffect(() => {
    const searchedProducts = allData.filter((item) =>
      (item.name || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    const productsWithQuantities = searchedProducts.map((product) => ({
      ...product,
      quantity: inventoryQuantities[product.id] || parseInt(product.quantity) || 0
    }))

    setData(productsWithQuantities)
  }, [allData, debouncedSearch, inventoryQuantities])

  // Real-time subscription
  useEffect(() => {
    setLoading(true)
    setError(null)
    setLastVisibleDoc(null)
    setHasMore(true) // Reset state when params change, but subscription manages its own

    const unsubscribe = subscribeToActiveProductsSorted({
      sortBy,
      asc,
      limit, // For infinite scroll logic, we'd add loadMore logic, but dropdown limits limit this query 
      onUpdate: ({ products: fetchedProducts, lastVisibleDoc: newLastVisibleDoc, hasMore: newHasMore }) => {
        setAllData(fetchedProducts)
        setLastVisibleDoc(newLastVisibleDoc)
        setHasMore(newHasMore)
        setLoading(false)
        setRefreshing(false)
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [sortBy, asc, limit])

  const handleRefresh = () => {
    setRefreshing(true)
    // The query is fixed by params, so refresh just triggers UI state temporarily. 
    // Real updates handle the rest.
    setTimeout(() => setRefreshing(false), 500)
  }

  const handleCardPress = (product) => {
    setSelectedProduct(product)
    setModalVisible(true)
  }

  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: BG }}>
      <StatusBar barStyle='dark-content' backgroundColor={BG} />
      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <View className='flex-1 px-0' style={{ backgroundColor: BG }}>
        <ProductScreenHeader
          search={search}
          setSearch={setSearch}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          asc={asc}
          setAsc={setAsc}
        />

        <View style={{ flex: 1 }}>
          <ProductListContainer
            loading={loading}
            error={error}
            data={data}
            onRetry={handleRefresh}
            onCardPress={handleCardPress}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />

          {/* Pagination dropdown — overlaid bottom-right */}
          <View style={{ position: 'absolute', bottom: 12, right: 20, zIndex: 10 }}>
            <TouchableOpacity
              onPress={() => setLimitOptionsOpen(!limitOptionsOpen)}
              className='flex-row items-center px-3 py-1.5 rounded-full border border-gray-300 bg-white'
            >
              <Text className='ml-1 text-sm font-semibold text-gray-500'>
                {limit} items
              </Text>
              <MaterialCommunityIcons
                name={limitOptionsOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={NAVY}
              />
            </TouchableOpacity>

            {limitOptionsOpen && (
              <View
                className='bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-36'
                style={{ position: 'absolute', bottom: 40, right: 0 }}
              >
                {[5, 10, 15, 25].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setLimit(option)
                      setLimitOptionsOpen(false)
                    }}
                    className={`py-2 px-3 rounded-md ${limit === option ? 'bg-slate-100' : ''}`}
                  >
                    <Text
                      className='text-sm font-semibold'
                      style={{ color: limit === option ? NAVY : '#4B5563' }}
                    >
                      {option} items
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <ProductModal
        visible={modalVisible}
        item={selectedProduct}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  )
}
