import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const NAVY = '#1F384C'

const statusStyle = (status) => {
  if (status === true  || status === 'active')   return { bg: '#D1FAE5', text: '#065F46', label: 'Active' }
  if (status === false || status === 'inactive') return { bg: '#FEE2E2', text: '#991B1B', label: 'Inactive' }
  return                                                { bg: '#FEF3C7', text: '#92400E', label: 'Pending' }
}

export default function ProductCard({ item, onPress }) {
  const { width } = useWindowDimensions()
  const cardWidth = (width - 48) / 2
  const st = statusStyle(item.isActive ?? item.status)

  return (
    <TouchableOpacity style={[s.card, { width: cardWidth }]} onPress={() => onPress?.(item)} activeOpacity={0.75}>
      {/* Image */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={s.image} resizeMode='cover' />
      ) : (
        <View style={[s.image, s.imagePlaceholder]}>
          <MaterialCommunityIcons name='package-variant-closed' size={28} color='#CBD5E1' />
        </View>
      )}

      {/* Content */}
      <View style={s.body}>
        <Text style={s.name} numberOfLines={1}>{item.name || 'N/A'}</Text>

        <Text style={s.price}>
          ₱{item.currentPrice ?? '—'}{item.priceUnit ? `/${item.priceUnit}` : ''}
        </Text>

        <View style={s.footer}>
          <Text style={s.qty}>Qty {item.quantity ?? 0}</Text>
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
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qty: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
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
