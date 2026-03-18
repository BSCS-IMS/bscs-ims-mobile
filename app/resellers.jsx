import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Platform, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { subscribeToActiveResellersSortedByName } from '../services/resellerApi'
import { subscribeToAllResellerProductCounts } from '../services/resellerProductApi'

import ResellerScreenHeader from '../modules/reseller-screen/ResellerScreenHeader'
import ResellerListContainer from '../modules/reseller-screen/ResellerListContainer'
import ResellerModal from '../modules/reseller-screen/ResellerModal'

const NAVY = '#1F384C'
const BG = '#F1F2F7'

export default function ResellersScreen() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState(null)
  const [asc, setAsc] = useState(true)
  const [limit, setLimit] = useState(10)
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [limitOptionsOpen, setLimitOptionsOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedReseller, setSelectedReseller] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const [allData, setAllData] = useState([])
  const [productCounts, setProductCounts] = useState({})

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [search])

  // Subcribe to product counts for all resellers
  useEffect(() => {
    const unsubscribe = subscribeToAllResellerProductCounts((counts) => {
      setProductCounts(counts)
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Process data: filter by search and append product counts synchronously
  useEffect(() => {
    const searchedResellers = allData.filter((item) =>
      (item.businessName || item.ownerName || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    const resellersWithCounts = searchedResellers.map((reseller) => ({
      ...reseller,
      productCount: productCounts[reseller.id] || 0
    }))

    setData(resellersWithCounts)
  }, [allData, debouncedSearch, productCounts])

  // Real-time subscription
  useEffect(() => {
    setLoading(true)
    setError(null)
    setLastVisibleDoc(null)
    setHasMore(true) // Reset state when params change, but subscription manages its own

    const unsubscribe = subscribeToActiveResellersSortedByName({
      sortBy,
      asc,
      limit,
      onUpdate: ({ resellers: fetchedResellers, lastVisibleDoc: newLastVisibleDoc, hasMore: newHasMore }) => {
        setAllData(fetchedResellers)
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

  const handleCardPress = (reseller) => {
    setSelectedReseller(reseller)
    setModalVisible(true)
  }

  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: BG }}>
      <StatusBar barStyle='dark-content' backgroundColor={BG} />
      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <View className='flex-1 px-0' style={{ backgroundColor: BG }}>
        <ResellerScreenHeader
          search={search}
          setSearch={setSearch}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          asc={asc}
          setAsc={setAsc}
        />

        {debouncedSearch.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8EEF4', borderRadius: 20, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5 }}>
              <Ionicons name='search-outline' size={13} color='#1F384C' />
              <Text style={{ fontSize: 12, color: '#1F384C', fontFamily: 'Inter' }}>{debouncedSearch}</Text>
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name='close-circle' size={15} color='#1F384C' />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <ResellerListContainer
            loading={loading}
            error={error}
            filteredData={data}
            loadResellers={handleRefresh}
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

      <ResellerModal
        visible={modalVisible}
        item={selectedReseller}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  )
}
