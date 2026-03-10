import { db } from '../config/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore'

/**
 * Fetch published announcements ordered by most recent
 * @param {number} limitCount - Maximum number of announcements to fetch (default: 10)
 * @returns {Promise<Array>} Array of published announcement documents
 */
export const fetchPublishedAnnouncements = async (limitCount = 10) => {
  try {
    const announcementsRef = collection(db, 'announcements')
    const q = query(
      announcementsRef,
      where('isPublished', '==', true),
      orderBy('publishAt', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching published announcements:', error)
    throw error
  }
}

/**
 * Subscribe to real-time published announcements
 * @param {number} limitCount - Maximum number of announcements to fetch
 * @param {Function} onUpdate - Callback function when data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToPublishedAnnouncements = (limitCount = 10, onUpdate) => {
  try {
    const announcementsRef = collection(db, 'announcements')
    const q = query(
      announcementsRef,
      where('isPublished', '==', true),
      orderBy('publishAt', 'desc'),
      limit(limitCount)
    )

    return onSnapshot(q, (querySnapshot) => {
      const announcements = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      onUpdate(announcements)
    })
  } catch (error) {
    console.error('Error subscribing to announcements:', error)
    throw error
  }
}

/**
 * Fetch all published announcements ordered by most recent (no limit)
 * @returns {Promise<Array>} Array of all published announcement documents
 */
export const fetchAllPublishedAnnouncements = async () => {
  try {
    const announcementsRef = collection(db, 'announcements')
    const q = query(
      announcementsRef,
      where('isPublished', '==', true),
      orderBy('publishAt', 'desc')
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching all published announcements:', error)
    throw error
  }
}

/**
 * Get total count of published announcements
 * @returns {Promise<number>} Total count of published announcements
 */
export const getPublishedAnnouncementsCount = async () => {
  try {
    const announcementsRef = collection(db, 'announcements')
    const q = query(announcementsRef, where('isPublished', '==', true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  } catch (error) {
    console.error('Error getting announcements count:', error)
    throw error
  }
}
