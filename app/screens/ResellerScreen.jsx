import React, { useState, useRef, useEffect, useMemo } from 'react'
import { View, Text, Animated, Platform, StatusBar, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchActiveResellersSortedByName } from '../../services/resellerApi'
import { fetchLinksByReseller } from '../../services/resellerProductApi'

import ResellerScreenHeader from '../modules/reseller-screen/ResellerScreenHeader'
import ResellerListContainer from '../modules/reseller-screen/ResellerListContainer'
import SideMenu from '../modules/reseller-screen/SideMenu'

const COLORS = {
  primary: '#2C5282',
  background: '#F1F2F7',
};

const SCREEN_WIDTH = Dimensions.get('window').width

export default function ResellerScreen() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState(null)
  const [asc, setAsc] = useState(true)
  const [limit, setLimit] = useState(10)
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [limitOptionsOpen, setLimitOptionsOpen] = useState(false)

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.96)).current

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

      const searchedResellers = fetchedResellers.filter(
        (item) =>
          (item.businessName || item.ownerName || '').toLowerCase().includes(search.toLowerCase())
      )

      const enhancedResellers = await Promise.all(
        searchedResellers.map(async (r) => {
          try {
            const links = await fetchLinksByReseller(r.id)
            const activeCount = Array.isArray(links) ? links.filter((l) => l.isActive).length : 0
            return { ...r, productCount: activeCount }
          } catch (err) {
            return { ...r, productCount: 0 }
          }
        })
      )

      setData((prevData) => (loadMore ? [...prevData, ...enhancedResellers] : enhancedResellers))
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
  }, [search, sortBy, asc, limit])

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: menuOpen ? 0 : SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: menuOpen ? 1 : 0.96,
        duration: 220,
        useNativeDriver: true
      })
    ]).start()
  }, [menuOpen])

  return (
    <SafeAreaView className='flex-1'>
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.background} />

      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <View className='flex-1 px-0' style={{ backgroundColor: COLORS.background }}>
        <ResellerScreenHeader
          setMenuOpen={setMenuOpen}
          search={search}
          setSearch={setSearch}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          asc={asc}
          setAsc={setAsc}
        />

        <ResellerListContainer
          loading={loading}
          error={error}
          filteredData={filteredData}
          loadResellers={loadResellers}
        />
      </View>

      {/* Pagination Limit Dropdown at the bottom */}
        <View className='flex-row justify-end items-center px-5 mt-5 relative z-10'>
            <TouchableOpacity
                onPress={() => setLimitOptionsOpen(!limitOptionsOpen)}
                className='flex-row items-center px-3 py-1.5 rounded-full border border-gray-300 bg-white'
            >
                <Text className='ml-1 text-sm font-semibold text-gray-500' style={{ fontFamily: 'Inter' }}>
                    {limit} items
                </Text>
                <MaterialCommunityIcons name={limitOptionsOpen ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary} />
            </TouchableOpacity>

            {limitOptionsOpen && (
                <View className='absolute bottom-full right-5 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-36'>
                    {[5, 10, 15, 25].map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => {
                                setLimit(option)
                                setLimitOptionsOpen(false)
                            }}
                            className={`py-2 px-3 rounded-md ${limit === option ? 'bg-blue-50' : ''}`}
                        >
                            <Text
                                className={`text-sm font-semibold ${limit === option ? 'text-[#2C5282]' : 'text-gray-600'}`}
                                style={{ fontFamily: 'Inter' }}
                            >
                                {option} items
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>

      <SideMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
      />
    </SafeAreaView>
  )
}
