import { useEffect, useRef } from 'react'
import { subscribeToPublishedAnnouncements } from '../services/announcementApi'
import { useToast } from '../contexts/ToastContext'

export default function AnnouncementListener() {
  const { showToastMessage } = useToast()
  const previousAnnouncementIds = useRef(new Set())
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const unsubscribe = subscribeToPublishedAnnouncements(5, (data) => {
      // Skip toast on initial load
      if (isInitialLoad.current) {
        previousAnnouncementIds.current = new Set(data.map((a) => a.id))
        isInitialLoad.current = false
        return
      }

      // Check for new announcements
      if (previousAnnouncementIds.current.size > 0 && data.length > 0) {
        const newAnnouncements = data.filter(
          (announcement) => !previousAnnouncementIds.current.has(announcement.id)
        )

        if (newAnnouncements.length > 0) {
          showToastMessage('New announcement posted!')
        }
      }

      // Update the set of announcement IDs
      previousAnnouncementIds.current = new Set(data.map((a) => a.id))
    })

    return () => {
      unsubscribe()
    }
  }, [showToastMessage])

  return null
}
