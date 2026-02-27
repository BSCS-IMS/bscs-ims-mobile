import { db } from '../config/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  collectionGroup,
} from 'firebase/firestore'

// Product fields
const PRODUCT_FIELDS = [
  'currentPrice',
  'description',
  'imageUrl',
  'isActive',
  'name',
  'priceUnit',
  'quantity',
  'sku',
  // optional: 'resellerId' if stored on top-level products collection
]

/**
 * Fetch all products (top-level `products` collection)
 * @returns {Promise<Array>} Array of product documents
 */
export const fetchAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const querySnapshot = await getDocs(productsRef)

    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

/**
 * Fetch a single product by ID (top-level)
 */
export const fetchProductById = async (productId) => {
  try {
    const prodRef = doc(db, 'products', productId)
    const snap = await getDoc(prodRef)
    if (snap.exists()) return { id: snap.id, ...snap.data() }
    throw new Error(`Product ${productId} not found`)
  } catch (error) {
    console.error('Error fetching product by id:', error)
    throw error
  }
}

/**
 * Fetch products for a reseller stored in a top-level `products` collection via `resellerId` field
 */
export const fetchProductsByReseller = async (resellerId) => {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('resellerId', '==', resellerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching products by reseller:', error)
    throw error
  }
}

/**
 * Fetch products stored as a subcollection `resellers/{resellerId}/products`
 */
export const fetchProductsForResellerSubcollection = async (resellerId) => {
  try {
    const productsRef = collection(db, 'resellers', resellerId, 'products')
    const querySnapshot = await getDocs(productsRef)
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching subcollection products:', error)
    throw error
  }
}

/**
 * Create a product in the top-level `products` collection
 */
export const createProduct = async (productData) => {
  try {
    const data = { ...productData, createdAt: Timestamp.now() }
    const productsRef = collection(db, 'products')
    const docRef = await addDoc(productsRef, data)
    return docRef.id
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

/**
 * Create a product inside a reseller's `products` subcollection
 */
export const createProductForReseller = async (resellerId, productData) => {
  try {
    const data = { ...productData, createdAt: Timestamp.now() }
    const productsRef = collection(db, 'resellers', resellerId, 'products')
    const docRef = await addDoc(productsRef, data)
    return docRef.id
  } catch (error) {
    console.error('Error creating subcollection product:', error)
    throw error
  }
}

/**
 * Update a top-level product
 */
export const updateProduct = async (productId, updateData) => {
  try {
    const prodRef = doc(db, 'products', productId)
    await updateDoc(prodRef, updateData)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

/**
 * Delete a top-level product
 */
export const deleteProduct = async (productId) => {
  try {
    const prodRef = doc(db, 'products', productId)
    await deleteDoc(prodRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

/**
 * Search products by name (case-insensitive substring) — client-side filter
 */
export const searchProductsByName = async (searchTerm) => {
  try {
    const all = await fetchAllProducts()
    return all.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

/**
 * Optionally find products across subcollections using collectionGroup
 * (finds any `products` subcollection docs regardless of path)
 */
export const fetchProductsAcrossSubcollections = async () => {
  try {
    const q = collectionGroup(db, 'products')
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching products across subcollections:', error)
    throw error
  }
}
