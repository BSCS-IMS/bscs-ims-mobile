import { db } from '../config/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  limit, // Added limit
  startAfter, // Added startAfter
} from 'firebase/firestore'

// Reseller fields
const RESELLER_FIELDS = [
  'address',
  'businessName',
  'contactNumber',
  'createdAt',
  'email',
  'notes',
  'ownerName',
  'status',
  'imageUrl',
]

/**
 * Fetch all resellers from the resellers collection
 * @returns {Promise<Array>} Array of reseller documents with all fields
 */
export const fetchAllResellers = async () => {
  try {
    const resellersRef = collection(db, 'resellers')
    const querySnapshot = await getDocs(resellersRef)

    const resellers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return resellers
  } catch (error) {
    console.error('Error fetching resellers:', error)
    throw error
  }
}

/**
 * Fetch a single reseller by ID
 * @param {string} resellerId - The reseller document ID
 * @returns {Promise<Object>} Reseller document data
 */
export const fetchResellerById = async (resellerId) => {
  try {
    const resellerRef = doc(db, 'resellers', resellerId)
    const resellerSnap = await getDoc(resellerRef)

    if (resellerSnap.exists()) {
      return {
        id: resellerSnap.id,
        ...resellerSnap.data(),
      }
    } else {
      throw new Error(`Reseller with ID ${resellerId} not found`)
    }
  } catch (error) {
    console.error('Error fetching reseller:', error)
    throw error
  }
}

/**
 * Fetch resellers with specific status
 * @param {string} status - The status to filter by (e.g., 'active', 'inactive', 'pending')
 * @returns {Promise<Array>} Array of reseller documents matching the status
 */
export const fetchResellersByStatus = async (status) => {
  try {
    const resellersRef = collection(db, 'resellers')
    const q = query(resellersRef, where('status', '==', status))
    const querySnapshot = await getDocs(q)

    const resellers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return resellers
  } catch (error) {
    console.error('Error fetching resellers by status:', error)
    throw error
  }
}

/**
 * Fetch resellers by email
 * @param {string} email - The email to search for
 * @returns {Promise<Array>} Array of reseller documents with matching email
 */
export const fetchResellerByEmail = async (email) => {
  try {
    const resellersRef = collection(db, 'resellers')
    const q = query(resellersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    const resellers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return resellers
  } catch (error) {
    console.error('Error fetching reseller by email:', error)
    throw error
  }
}

/**
 * Create a new reseller
 * @param {Object} resellerData - Reseller data object
 * @returns {Promise<string>} The new reseller document ID
 */
export const createReseller = async (resellerData) => {
  try {
    const resellerWithTimestamp = {
      ...resellerData,
      createdAt: Timestamp.now(),
    }

    const resellersRef = collection(db, 'resellers')
    const docRef = await addDoc(resellersRef, resellerWithTimestamp)

    return docRef.id
  } catch (error) {
    console.error('Error creating reseller:', error)
    throw error
  }
}

/**
 * Update a reseller
 * @param {string} resellerId - The reseller document ID
 * @param {Object} updateData - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateReseller = async (resellerId, updateData) => {
  try {
    const resellerRef = doc(db, 'resellers', resellerId)
    await updateDoc(resellerRef, updateData)
  } catch (error) {
    console.error('Error updating reseller:', error)
    throw error
  }
}

/**
 * Delete a reseller
 * @param {string} resellerId - The reseller document ID
 * @returns {Promise<void>}
 */
export const deleteReseller = async (resellerId) => {
  try {
    const resellerRef = doc(db, 'resellers', resellerId)
    await deleteDoc(resellerRef)
  } catch (error) {
    console.error('Error deleting reseller:', error)
    throw error
  }
}

/**
 * Search resellers by business name (case-insensitive partial match)
 * @param {string} searchTerm - The business name to search for
 * @returns {Promise<Array>} Array of matching reseller documents
 */
export const searchResellersByBusinessName = async (searchTerm) => {
  try {
    const resellersRef = collection(db, 'resellers')
    const querySnapshot = await getDocs(resellersRef)

    const resellers = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((reseller) =>
        reseller.businessName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )

    return resellers
  } catch (error) {
    console.error('Error searching resellers:', error)
    throw error
  }
}

/**
 * Fetch products stored as a subcollection under a reseller: `resellers/{resellerId}/products`
 * @param {string} resellerId
 * @returns {Promise<Array>} Array of product documents
 */
export const fetchProductsForResellerSubcollection = async (resellerId) => {
  try {
    const productsRef = collection(db, 'resellers', resellerId, 'products')
    const querySnapshot = await getDocs(productsRef)
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching products for reseller subcollection:', error)
    throw error
  }
}

/**
 * Fetch active resellers with optional sorting by name.
 * Does not handle search or product count sorting due to Firestore limitations.
 * @param {Object} options - Filtering and sorting options
 * @param {string} [options.sortBy=null] - Field to sort by ('Name')
 * @param {boolean} [options.asc=true] - Ascending or Descending order
 * @returns {Promise<Array>} Array of active reseller documents
 */
export const fetchActiveResellersSortedByName = async ({ sortBy = null, asc = true, limit: queryLimit = 10, lastVisibleDoc = null } = {}) => {
  try {
    const resellersRef = collection(db, 'resellers')
    let q = query(resellersRef, where('status', '==', 'active'))

    if (sortBy === 'Name') {
      q = query(q, orderBy('businessName', asc ? 'asc' : 'desc'))
    } else {
      // Always need an orderBy for startAfter to work consistently,
      // default to businessName if no specific sort is applied
      q = query(q, orderBy('businessName', 'asc'))
    }

    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc))
    }

    q = query(q, limit(queryLimit))

    const querySnapshot = await getDocs(q)

    const resellers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const newLastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    const hasMore = querySnapshot.docs.length === queryLimit

    return { resellers, lastVisibleDoc: newLastVisibleDoc, hasMore }
  } catch (error) {
    console.error('Error fetching active resellers sorted by name:', error)
    throw error
  }
}
