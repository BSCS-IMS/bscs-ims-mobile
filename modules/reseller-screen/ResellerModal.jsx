import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Share,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fetchActiveProductsForReseller } from '../../services/resellerProductApi'

const NAVY = '#1F384C'
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

const statusStyle = (status) => {
  if (status === 'active') return { bg: '#D1FAE5', text: '#065F46', label: 'active' }
  if (status === 'inactive') return { bg: '#FEE2E2', text: '#991B1B', label: 'inactive' }
  return { bg: '#FEF3C7', text: '#92400E', label: 'pending' }
}

export default function ResellerModal({ visible, item, onClose }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [lightboxVisible, setLightboxVisible] = useState(false)

  useEffect(() => {
    if (!item?.id) return
    setLoadingProducts(true)
    fetchActiveProductsForReseller(item.id)
      .then((data) => setProducts(data.filter((p) => p.product)))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [item?.id])

  const st = statusStyle(item?.status)

  const handleShare = () => {
    const parts = [item?.businessName || item?.ownerName || 'Reseller']
    if (item?.contactNumber) parts.push(item.contactNumber)
    if (item?.address) parts.push(item.address)
    Share.share({ message: parts.join(' • ') })
  }

  const handleOpenMaps = (address) => {
    const encoded = encodeURIComponent(address)
    Linking.openURL(`maps:?q=${encoded}`).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
    )
  }

  return (
    <>
      {/* Lightbox */}
      <Modal visible={lightboxVisible} transparent animationType='fade' onRequestClose={() => setLightboxVisible(false)}>
        <View style={s.lightboxOverlay}>
          <TouchableOpacity style={s.lightboxClose} onPress={() => setLightboxVisible(false)}>
            <Ionicons name='close' size={24} color='#fff' />
          </TouchableOpacity>
          <Image source={{ uri: item?.imageUrl }} style={s.lightboxImage} resizeMode='contain' />
        </View>
      </Modal>

      <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
        <View style={s.overlay}>
          <View style={s.sheet}>

            {/* Handle + close + share */}
            <View style={s.handleRow}>
              <View style={s.handle} />
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name='close' size={20} color='#9CA3AF' />
            </TouchableOpacity>
            <TouchableOpacity style={s.shareBtn} onPress={handleShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name='share-outline' size={18} color={NAVY} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

              {/* Image */}
              {item?.imageUrl ? (
                <TouchableOpacity onPress={() => setLightboxVisible(true)} activeOpacity={0.85}>
                  <Image source={{ uri: item.imageUrl }} style={s.image} resizeMode='contain' />
                  <View style={s.imageZoomHint}>
                    <Ionicons name='expand-outline' size={13} color='#fff' />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[s.image, s.imagePlaceholder]}>
                  <Ionicons name='person-outline' size={40} color='#CBD5E1' />
                </View>
              )}

              {/* Name + badge */}
              <View style={s.nameRow}>
                <Text style={s.name} numberOfLines={2}>
                  {item?.businessName || item?.ownerName || 'N/A'}
                </Text>
                <View style={[s.badge, { backgroundColor: st.bg }]}>
                  <Text style={[s.badgeText, { color: st.text }]}>{st.label}</Text>
                </View>
              </View>

              {/* Owner subtitle */}
              {item?.ownerName && item?.businessName ? (
                <Text style={s.subtitle}>{item.ownerName}</Text>
              ) : null}

              {/* Contact info */}
              <View style={s.infoBlock}>
                {item?.contactNumber ? (
                  <TouchableOpacity style={s.infoRow} onPress={() => Linking.openURL('tel:' + item.contactNumber)}>
                    <Ionicons name='call-outline' size={15} color={NAVY} />
                    <Text style={[s.infoText, s.infoTextLink]}>{item.contactNumber}</Text>
                  </TouchableOpacity>
                ) : null}
                {item?.email ? (
                  <TouchableOpacity style={s.infoRow} onPress={() => Linking.openURL('mailto:' + item.email)}>
                    <Ionicons name='mail-outline' size={15} color={NAVY} />
                    <Text style={[s.infoText, s.infoTextLink]}>{item.email}</Text>
                  </TouchableOpacity>
                ) : null}
                {item?.address ? (
                  <TouchableOpacity style={s.infoRow} onPress={() => handleOpenMaps(item.address)}>
                    <Ionicons name='location-outline' size={15} color={NAVY} style={{ marginTop: 1 }} />
                    <Text style={[s.infoText, s.infoTextLink, { flex: 1 }]}>{item.address}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Notes */}
              {item?.notes ? (
                <View style={s.notesBlock}>
                  <Text style={s.notesLabel}>Notes</Text>
                  <Text style={s.notesText}>{item.notes}</Text>
                </View>
              ) : null}

              {/* Divider */}
              <View style={s.divider} />

              {/* Active products */}
              <Text style={s.sectionTitle}>Active Products</Text>

              {loadingProducts ? (
                <ActivityIndicator size='small' color={NAVY} style={{ marginTop: 8 }} />
              ) : products.length === 0 ? (
                <Text style={s.emptyText}>No active products linked.</Text>
              ) : (
                products.map(({ linkId, product }) => (
                  <View key={linkId} style={s.listRow}>
                    {product.imageUrl ? (
                      <Image source={{ uri: product.imageUrl }} style={s.thumb} resizeMode='cover' />
                    ) : (
                      <View style={[s.thumb, s.thumbPlaceholder]}>
                        <Ionicons name='cube-outline' size={18} color='#CBD5E1' />
                      </View>
                    )}
                    <View style={s.listRowText}>
                      <Text style={s.listRowName} numberOfLines={1}>{product.name || 'N/A'}</Text>
                      <Text style={s.listRowSub}>
                        ₱{product.currentPrice ?? '—'}{product.priceUnit ? `/${product.priceUnit}` : ''}
                      </Text>
                    </View>
                  </View>
                ))
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 6,
  },
  shareBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
    zIndex: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 6,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageZoomHint: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 6,
    padding: 4,
  },
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxClose: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  lightboxImage: {
    width: SCREEN_W,
    height: SCREEN_H * 0.75,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: NAVY,
    lineHeight: 24,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  infoBlock: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  infoTextLink: {
    color: '#1F384C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  notesBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  thumbPlaceholder: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowText: {
    flex: 1,
  },
  listRowName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  listRowSub: {
    fontSize: 12,
    color: '#64748B',
  },
})
