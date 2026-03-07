import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Platform, TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchActiveProductsSorted } from '../services/productApi'

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [search])

  const loadProducts = async (loadMore = false) => {
    if (!hasMore && loadMore) return
    setLoading(true)
    setError(null)

    try {
      const {
        products: fetchedProducts,
        lastVisibleDoc: newLastVisibleDoc,
        hasMore: newHasMore,
      } = await fetchActiveProductsSorted({
        sortBy,
        asc,
        limit,
        lastVisibleDoc: loadMore ? lastVisibleDoc : null,
      })

      const searchedProducts = fetchedProducts.filter((item) =>
        (item.name || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      )

      setData((prev) => (loadMore ? [...prev, ...searchedProducts] : searchedProducts))
      setLastVisibleDoc(newLastVisibleDoc)
      setHasMore(newHasMore)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLastVisibleDoc(null)
    setHasMore(true)
    loadProducts(false)
  }, [debouncedSearch, sortBy, asc, limit])

  const handleRefresh = async () => {
    setRefreshing(true)
    setLastVisibleDoc(null)
    setHasMore(true)
    await loadProducts(false)
    setRefreshing(false)
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
            onRetry={loadProducts}
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
