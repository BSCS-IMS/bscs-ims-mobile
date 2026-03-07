import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const NAVY = '#1F384C'

const statusStyle = (status) => {
  if (status === 'active')   return { bg: '#D1FAE5', text: '#065F46', label: 'Active' }
  if (status === 'inactive') return { bg: '#FEE2E2', text: '#991B1B', label: 'Inactive' }
  return                            { bg: '#FEF3C7', text: '#92400E', label: 'Pending' }
}

export default function ResellerCard({ item, onPress }) {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 48) / 2
  const st = statusStyle(item.status)

  return (
    <TouchableOpacity style={[s.card, { width: cardWidth }]} onPress={() => onPress?.(item)} activeOpacity={0.75}>
      {/* Image */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={s.image} resizeMode='contain' />
      ) : (
        <View style={[s.image, s.imagePlaceholder]}>
          <Ionicons name='person-outline' size={28} color='#CBD5E1' />
        </View>
      )}

      {/* Content */}
      <View style={s.body}>
        <Text style={s.name} numberOfLines={1}>
          {item.businessName || item.ownerName || 'N/A'}
        </Text>

        <Text style={s.meta} numberOfLines={1}>
          {item.ownerName && item.businessName ? item.ownerName : (item.contactNumber || '—')}
        </Text>

        <View style={s.footer}>
          <View style={s.productCount}>
            <Ionicons name='cube-outline' size={11} color='#94A3B8' />
            <Text style={s.productCountText}>{item.productCount ?? 0}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: st.bg }]}>
            <Text style={[s.badgeText, { color: st.text }]}>{st.label}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    marginLeft: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 110,
  },
  imagePlaceholder: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 3,
  },
  meta: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  productCountText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
})
