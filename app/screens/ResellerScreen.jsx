import React, { useState, useRef, useEffect, useMemo } from 'react'
import { View, Text, Animated, Platform, StatusBar, SafeAreaView, Dimensions } from 'react-native'
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

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.96)).current

  const loadResellers = async () => {
    try {
      setLoading(true)
      const fetchedResellers = await fetchActiveResellersSortedByName({ sortBy, asc })

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

      setData(enhancedResellers)
      setError(null)
    } catch (err) {
      console.error('Error fetching resellers:', err)
      setError('Failed to load resellers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResellers()
  }, [search, sortBy, asc]) // Updated dependencies

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
    // If sortBy is 'Name' (already sorted by backend) or null (no sort)
    // data is already in the correct state after loadResellers
    return data
  }, [data, sortBy, asc]) // Updated dependencies

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
    <SafeAreaView className='flex-1' style={{ backgroundColor: COLORS.background }}>
      <StatusBar barStyle='dark-content' backgroundColor={COLORS.background} />

      <View style={{ paddingTop: Platform.OS === 'android' ? 30 : 0 }} />

      <View className='flex-1 px-0'>
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
