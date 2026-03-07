import React, { useState, useEffect, useMemo } from 'react'
import { View, SafeAreaView, StatusBar, Platform, TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchActiveProducts } from '../services/productApi'

import ProductScreenHeader from '../modules/product-screen/ProductScreenHeader'
import ProductListContainer from '../modules/product-screen/ProductListContainer'
import ProductModal from '../modules/product-screen/ProductModal'

const NAVY = '#1F384C'
const BG = '#F1F2F7'

export default function ProductsScreen() {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState(null)
  const [asc, setAsc] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
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

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchActiveProducts()
      setAllProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadProducts()
    setRefreshing(false)
  }

  const displayedProducts = useMemo(() => {
    let result = [...allProducts]

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((p) => (p.name || '').toLowerCase().includes(q))
    }

    if (sortBy === 'Price') {
      result.sort((a, b) =>
        asc ? (a.currentPrice ?? 0) - (b.currentPrice ?? 0) : (b.currentPrice ?? 0) - (a.currentPrice ?? 0)
      )
    } else if (sortBy === 'Qty') {
      result.sort((a, b) =>
        asc ? (a.quantity ?? 0) - (b.quantity ?? 0) : (b.quantity ?? 0) - (a.quantity ?? 0)
      )
    }

    return result.slice(0, pageSize)
  }, [allProducts, debouncedSearch, sortBy, asc, pageSize])

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
            data={displayedProducts}
            onRetry={loadProducts}
            onCardPress={handleCardPress}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />

          {/* Pagination dropdown — overlaid bottom-right */}
          <View style={{ position: 'absolute', bottom: 12, right: 20, zIndex: 10 }}>
            <TouchableOpacity
              onPress={() => setPageSizeOpen(!pageSizeOpen)}
              className='flex-row items-center px-3 py-1.5 rounded-full border border-gray-300 bg-white'
            >
              <Text className='ml-1 text-sm font-semibold text-gray-500'>
                {pageSize} items
              </Text>
              <MaterialCommunityIcons
                name={pageSizeOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={NAVY}
              />
            </TouchableOpacity>

            {pageSizeOpen && (
              <View
                className='bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-36'
                style={{ position: 'absolute', bottom: 40, right: 0 }}
              >
                {[5, 10, 15, 25].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setPageSize(option)
                      setPageSizeOpen(false)
                    }}
                    className={`py-2 px-3 rounded-md ${pageSize === option ? 'bg-slate-100' : ''}`}
                  >
                    <Text
                      className='text-sm font-semibold'
                      style={{ color: pageSize === option ? NAVY : '#4B5563' }}
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
