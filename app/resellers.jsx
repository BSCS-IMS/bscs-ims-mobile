import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, Platform, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchActiveResellersSortedByName } from '../services/resellerApi'
import { fetchLinksByReseller } from '../services/resellerProductApi'

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [search])

  const loadResellers = async (loadMore = false) => {
    if (!hasMore && loadMore) return
    setLoading(true)
    setError(null)

    try {
      const {
        resellers: fetchedResellers,
        lastVisibleDoc: newLastVisibleDoc,
        hasMore: newHasMore,
      } = await fetchActiveResellersSortedByName({
        sortBy,
        asc,
        limit,
        lastVisibleDoc: loadMore ? lastVisibleDoc : null,
      })

      const searchedResellers = fetchedResellers.filter((item) =>
        (item.businessName || item.ownerName || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      )

      const enhancedResellers = await Promise.all(
        searchedResellers.map(async (r) => {
          try {
            const links = await fetchLinksByReseller(r.id)
            const activeCount = Array.isArray(links) ? links.filter((l) => l.isActive).length : 0
            return { ...r, productCount: activeCount }
          } catch {
            return { ...r, productCount: 0 }
          }
        })
      )

      setData((prev) => (loadMore ? [...prev, ...enhancedResellers] : enhancedResellers))
      setLastVisibleDoc(newLastVisibleDoc)
      setHasMore(newHasMore)
    } catch (err) {
      console.error('Error fetching resellers:', err)
      setError('Failed to load resellers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLastVisibleDoc(null)
    setHasMore(true)
    loadResellers(false)
  }, [debouncedSearch, sortBy, asc, limit])

  const filteredData = useMemo(() => {
    if (sortBy === 'Products') {
      const result = [...data]
      result.sort((a, b) => {
        const pa = a.productCount || 0
        const pb = b.productCount || 0
        return asc ? pa - pb : pb - pa
      })
      return result
    }
    return data
  }, [data, sortBy, asc])

  const handleRefresh = async () => {
    setRefreshing(true)
    setLastVisibleDoc(null)
    setHasMore(true)
    await loadResellers(false)
    setRefreshing(false)
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

        <View style={{ flex: 1 }}>
          <ResellerListContainer
            loading={loading}
            error={error}
            filteredData={filteredData}
            loadResellers={loadResellers}
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
