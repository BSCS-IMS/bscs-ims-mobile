import { db } from '../config/firebase'
import {
  collection,
  onSnapshot,
} from 'firebase/firestore'

/**
 * Subscribes to the inventory collection and calculates the total quantity for each product.
 * @param {Function} onUpdate - Callback that receives an object mapping productId to total quantity.
 * @returns {Function} Unsubscribe function
 */
export const subscribeToInventoryQuantities = (onUpdate) => {
  try {
    const inventoryRef = collection(db, 'inventory')
    
    return onSnapshot(inventoryRef, (querySnapshot) => {
      const quantitiesByProduct = {}
      
      querySnapshot.docs.forEach((doc) => {
        const { productId, quantity } = doc.data()
        if (productId) {
          const qty = parseInt(quantity, 10) || 0
          quantitiesByProduct[productId] = (quantitiesByProduct[productId] || 0) + qty
        }
      })
      
      onUpdate(quantitiesByProduct)
    })
  } catch (error) {
    console.error('Error subscribing to inventory quantities:', error)
    throw error
  }
}
