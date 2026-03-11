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
  orderBy,
  limit,
  startAfter,
  onSnapshot,
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
 * Fetch only active products (top-level `products` collection)
 * @returns {Promise<Array>} Array of active product documents
 */
export const fetchActiveProducts = async () => {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('isActive', '==', true))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw error
  }
}

/**
 * Fetch active products with optional sorting and pagination
 * @param {Object} options - Filtering, sorting, and pagination options
 * @param {string} [options.sortBy=null] - Field to sort by ('Name', 'Price', 'Quantity')
 * @param {boolean} [options.asc=true] - Ascending or Descending order
 * @param {number} [options.limit=10] - Number of products to fetch
 * @param {DocumentSnapshot} [options.lastVisibleDoc=null] - Last document from previous query for pagination
 * @returns {Promise<Object>} Object containing products array, lastVisibleDoc, and hasMore flag
 */
export const fetchActiveProductsSorted = async ({
  sortBy = null,
  asc = true,
  limit: queryLimit = 10,
  lastVisibleDoc = null
} = {}) => {
  try {
    const productsRef = collection(db, 'products')
    let q = query(productsRef, where('isActive', '==', true))

    // Map sortBy to actual field names
    let sortField = 'name' // default sort
    if (sortBy === 'Name') {
      sortField = 'name'
    } else if (sortBy === 'Price') {
      sortField = 'currentPrice'
    } else if (sortBy === 'Quantity') {
      sortField = 'quantity'
    }

    // Apply sorting
    if (sortBy) {
      q = query(q, orderBy(sortField, asc ? 'asc' : 'desc'))
    } else {
      // Always need an orderBy for startAfter to work consistently
      q = query(q, orderBy('name', 'asc'))
    }

    // Apply pagination
    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc))
    }

    q = query(q, limit(queryLimit))

    const querySnapshot = await getDocs(q)

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const newLastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
    const hasMore = querySnapshot.docs.length === queryLimit

    return { products, lastVisibleDoc: newLastVisibleDoc, hasMore }
  } catch (error) {
    console.error('Error fetching active products sorted:', error)
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

/**
 * Subscribe to active products with optional sorting and pagination.
 * Replaces fetchActiveProductsSorted for real-time updates.
 */
export const subscribeToActiveProductsSorted = ({
  sortBy = null,
  asc = true,
  limit: queryLimit = 10,
  onUpdate
} = {}) => {
  try {
    const productsRef = collection(db, 'products')
    let q = query(productsRef, where('isActive', '==', true))

    let sortField = 'name'
    if (sortBy === 'Name') sortField = 'name'
    else if (sortBy === 'Price') sortField = 'currentPrice'
    else if (sortBy === 'Quantity') sortField = 'quantity'

    if (sortBy) {
      q = query(q, orderBy(sortField, asc ? 'asc' : 'desc'))
    } else {
      q = query(q, orderBy('name', 'asc'))
    }

    q = query(q, limit(queryLimit))

    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      const newLastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      const hasMore = querySnapshot.docs.length === queryLimit
      
      onUpdate({ products, lastVisibleDoc: newLastVisibleDoc, hasMore })
    })
  } catch (error) {
    console.error('Error subscribing to active products:', error)
    throw error
  }
}

/**
 * Subscribe to the total count of all products (for the dashboard).
 */
export const subscribeToAllProductsCount = (onUpdate) => {
  try {
    const productsRef = collection(db, 'products')
    // We cannot use getCountFromServer in onSnapshot directly, so we listen to changes on the collection.
    return onSnapshot(productsRef, (querySnapshot) => {
      onUpdate(querySnapshot.size)
    })
  } catch (error) {
    console.error('Error subscribing to products count:', error)
    throw error
  }
}
