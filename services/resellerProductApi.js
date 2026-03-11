import { db } from '../config/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getCountFromServer,
  onSnapshot,
} from 'firebase/firestore'
import { fetchProductById } from './productApi'

/**
 * Top-level collection name used to link resellers and products
 * Each document fields: isActive, productId, resellerId
 */
const LINK_COLLECTION = 'resellers-product'

export const createResellerProductLink = async ({ resellerId, productId, isActive = true }) => {
  try {
    const data = { resellerId, productId, isActive, createdAt: Timestamp.now() }
    const colRef = collection(db, LINK_COLLECTION)
    const docRef = await addDoc(colRef, data)
    return docRef.id
  } catch (error) {
    console.error('Error creating reseller-product link:', error)
    throw error
  }
}

export const fetchLinksByReseller = async (resellerId) => {
  try {
    const colRef = collection(db, LINK_COLLECTION)
    const q = query(colRef, where('resellerId', '==', resellerId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching links by reseller:', error)
    throw error
  }
}

export const fetchLinksByProduct = async (productId) => {
  try {
    const colRef = collection(db, LINK_COLLECTION)
    const q = query(colRef, where('productId', '==', productId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching links by product:', error)
    throw error
  }
}

export const updateResellerProductLink = async (linkId, updateData) => {
  try {
    const linkRef = doc(db, LINK_COLLECTION, linkId)
    await updateDoc(linkRef, updateData)
  } catch (error) {
    console.error('Error updating reseller-product link:', error)
    throw error
  }
}

export const deleteResellerProductLink = async (linkId) => {
  try {
    const linkRef = doc(db, LINK_COLLECTION, linkId)
    await deleteDoc(linkRef)
  } catch (error) {
    console.error('Error deleting reseller-product link:', error)
    throw error
  }
}

/**
 * Fetch active product details (merged) for a reseller.
 * Returns array of { linkId, product, isActive }
 */
export const fetchActiveProductsForReseller = async (resellerId) => {
  try {
    const links = await fetchLinksByReseller(resellerId)
    const activeLinks = links.filter(l => l.isActive)

    const products = await Promise.all(
      activeLinks.map(async (link) => {
        try {
          const prod = await fetchProductById(link.productId)
          return { linkId: link.id, product: prod, isActive: link.isActive }
        } catch (err) {
          return { linkId: link.id, product: null, isActive: link.isActive }
        }
      })
    )

    return products
  } catch (error) {
    console.error('Error fetching active products for reseller:', error)
    throw error
  }
}

/**
 * Fetch the count of active products for a reseller.
 */
export const fetchActiveProductCountForReseller = async (resellerId) => {
  try {
    const colRef = collection(db, LINK_COLLECTION)
    const q = query(colRef, where('resellerId', '==', resellerId), where('isActive', '==', true))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  } catch (error) {
    console.error('Error fetching active product count for reseller:', error)
    // Fallback to fetching documents if getCountFromServer is restricted or fails
    try {
      const colRef = collection(db, LINK_COLLECTION)
      const q = query(colRef, where('resellerId', '==', resellerId), where('isActive', '==', true))
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (fallbackError) {
      console.error('Fallback error fetching active product count:', fallbackError)
      return 0
    }
  }
}

/**
 * Subscribes to the reseller-product links collection and calculates total active links for each reseller.
 * @param {Function} onUpdate - Callback that receives an object mapping resellerId to active product count.
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAllResellerProductCounts = (onUpdate) => {
  try {
    const colRef = collection(db, LINK_COLLECTION)
    const q = query(colRef, where('isActive', '==', true))
    
    return onSnapshot(q, (querySnapshot) => {
      const countsByReseller = {}
      
      querySnapshot.docs.forEach((doc) => {
        const { resellerId } = doc.data()
        if (resellerId) {
          countsByReseller[resellerId] = (countsByReseller[resellerId] || 0) + 1
        }
      })
      
      onUpdate(countsByReseller)
    })
  } catch (error) {
    console.error('Error subscribing to reseller product counts:', error)
    throw error
  }
}

