import { View, StyleSheet, Dimensions } from 'react-native'

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2

export default function ProductCardSkeleton() {
  return (
    <View style={[s.card, { width: CARD_WIDTH }]}>
      <View style={s.image} />
      <View style={s.body}>
        <View style={s.line74} />
        <View style={s.line50} />
        <View style={s.lineSmall} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    marginLeft: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  image: { width: '100%', height: 110, backgroundColor: '#F1F5F9' },
  body: { padding: 10, gap: 6 },
  line74:    { height: 11, borderRadius: 6, backgroundColor: '#F1F5F9', width: '74%' },
  line50:    { height: 10, borderRadius: 6, backgroundColor: '#F1F5F9', width: '50%' },
  lineSmall: { height: 9,  borderRadius: 6, backgroundColor: '#F1F5F9', width: '30%', marginTop: 2 },
})
