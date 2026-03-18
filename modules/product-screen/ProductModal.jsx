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
  Share,
  Dimensions,
} from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchLinksByProduct } from '../../services/resellerProductApi'
import { fetchResellerById } from '../../services/resellerApi'

const NAVY = '#1F384C'
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

const statusStyle = (status) => {
  if (status === true || status === 'active') return { bg: '#D1FAE5', text: '#065F46', label: 'active' }
  if (status === false || status === 'inactive') return { bg: '#FEE2E2', text: '#991B1B', label: 'inactive' }
  return { bg: '#FEF3C7', text: '#92400E', label: 'pending' }
}

export default function ProductModal({ visible, item, onClose }) {
  const [resellers, setResellers] = useState([])
  const [loadingResellers, setLoadingResellers] = useState(false)
  const [lightboxVisible, setLightboxVisible] = useState(false)

  useEffect(() => {
    if (!item?.id) return
    setLoadingResellers(true)
    fetchLinksByProduct(item.id)
      .then(async (links) => {
        const resolved = await Promise.all(
          links.map(async (link) => {
            try {
              const reseller = await fetchResellerById(link.resellerId)
              return { linkId: link.id, reseller, isActive: link.isActive }
            } catch {
              return null
            }
          })
        )
        setResellers(resolved.filter(Boolean))
      })
      .catch(() => setResellers([]))
      .finally(() => setLoadingResellers(false))
  }, [item?.id])

  const st = statusStyle(item?.isActive ?? item?.status)

  const handleShare = () => {
    const price = item?.currentPrice ? `₱${item.currentPrice}${item?.priceUnit ? `/${item.priceUnit}` : ''}` : ''
    const qty = item?.quantity ? ` • Qty: ${parseInt(item.quantity)}` : ''
    Share.share({ message: `${item?.name || 'Product'}${price ? ' — ' + price : ''}${qty}` })
  }

  return (
    <>
      <Modal visible={visible} transparent animationType='slide' onRequestClose={lightboxVisible ? () => setLightboxVisible(false) : onClose}>
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
                  <MaterialCommunityIcons name='package-variant-closed' size={44} color='#CBD5E1' />
                </View>
              )}

              {/* Name + badge */}
              <View style={s.nameRow}>
                <Text style={s.name} numberOfLines={2}>
                  {item?.name || 'N/A'}
                </Text>
                <View style={[s.badge, { backgroundColor: st.bg }]}>
                  <Text style={[s.badgeText, { color: st.text }]}>{st.label}</Text>
                </View>
              </View>

              {/* SKU */}
              {item?.sku ? (
                <Text style={s.sku}>SKU: {item.sku}</Text>
              ) : null}

              {/* Price + Qty row */}
              <View style={s.statsRow}>
                <View style={s.statBox}>
                  <Text style={s.statLabel}>Price</Text>
                  <Text style={s.statValue}>
                    ₱{item?.currentPrice ?? '—'}{item?.priceUnit ? `/${item.priceUnit}` : ''}
                  </Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statBox}>
                  <Text style={s.statLabel}>Quantity</Text>
                  <Text style={s.statValue}>{parseInt(item?.quantity) || 0}</Text>
                </View>
              </View>

              {/* Description */}
              {item?.description ? (
                <View style={s.notesBlock}>
                  <Text style={s.notesLabel}>Description</Text>
                  <Text style={s.notesText}>{item.description}</Text>
                </View>
              ) : null}

              {/* Divider */}
              <View style={s.divider} />

              {/* Available at */}
              <Text style={s.sectionTitle}>Available at</Text>

              {loadingResellers ? (
                <ActivityIndicator size='small' color={NAVY} style={{ marginTop: 8 }} />
              ) : resellers.length === 0 ? (
                <Text style={s.emptyText}>Not available at any reseller.</Text>
              ) : (
                resellers.map(({ linkId, reseller }) => {
                  const rst = statusStyle(reseller.status)
                  return (
                    <View key={linkId} style={s.listRow}>
                      {reseller.imageUrl ? (
                        <Image source={{ uri: reseller.imageUrl }} style={s.thumb} resizeMode='cover' />
                      ) : (
                        <View style={[s.thumb, s.thumbPlaceholder]}>
                          <Ionicons name='person-outline' size={18} color='#CBD5E1' />
                        </View>
                      )}
                      <Text style={[s.listRowName, { flex: 1 }]} numberOfLines={1}>
                        {reseller.businessName || reseller.ownerName || 'N/A'}
                      </Text>
                      <View style={[s.badge, { backgroundColor: rst.bg }]}>
                        <Text style={[s.badgeText, { color: rst.text }]}>{rst.label}</Text>
                      </View>
                    </View>
                  )
                })
              )}

            </ScrollView>
          </View>
        </View>

        {/* Lightbox overlay — inside the modal to avoid nested-modal iOS bug */}
        {lightboxVisible && (
          <View style={s.lightboxOverlay}>
            <TouchableOpacity style={s.lightboxClose} onPress={() => setLightboxVisible(false)}>
              <Ionicons name='close' size={24} color='#fff' />
            </TouchableOpacity>
            <Image source={{ uri: item?.imageUrl }} style={s.lightboxImage} resizeMode='contain' />
          </View>
        )}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
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
  sku: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
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
  listRowName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
})
