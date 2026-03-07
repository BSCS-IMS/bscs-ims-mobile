import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useWindowDimensions, RefreshControl } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ResellerCard from './ResellerCard'

const NAVY = '#1F384C'

const Skeleton = ({ cardWidth }) => (
  <View style={[sk.card, { width: cardWidth }]}>
    <View style={sk.image} />
    <View style={sk.body}>
      <View style={sk.line74} />
      <View style={sk.line50} />
      <View style={sk.lineSmall} />
    </View>
  </View>
)

export default function ResellerListContainer({
  loading, error, filteredData, loadResellers,
  onCardPress, refreshing, onRefresh,
}) {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 48) / 2
  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Resellers</Text>

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <Skeleton cardWidth={cardWidth} />}
          keyExtractor={(i) => i.toString()}
          numColumns={2}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      ) : error ? (
        <View style={s.center}>
          <MaterialCommunityIcons name='alert-circle-outline' size={44} color='#FDA4AF' />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={loadResellers}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={s.center}>
          <MaterialCommunityIcons name='inbox-outline' size={44} color='#CBD5E1' />
          <Text style={s.emptyText}>No resellers found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <ResellerCard item={item} onPress={onCardPress} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh
              ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={NAVY} />
              : undefined
          }
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: NAVY,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
})

const sk = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    marginLeft: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#F1F5F9',
  },
  body: {
    padding: 10,
    gap: 6,
  },
  line74: {
    height: 11,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    width: '74%',
  },
  line50: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    width: '50%',
  },
  lineSmall: {
    height: 9,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    width: '30%',
    marginTop: 2,
  },
})
