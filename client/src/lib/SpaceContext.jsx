import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const SpaceContext = createContext(null)

const STORAGE_KEY = 'zumo_active_space_id'

export function SpaceProvider({ children }) {
  const [activeSpaceId, setActiveSpaceIdState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  )
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(false)
  // Unread counts for the sidebar's Inbox / Contact Center badges — lives
  // here (already a top-level provider) so both the inbox pages that
  // populate it and the layouts that display it can share it.
  const [unreadBySpace, setUnreadBySpace] = useState({})
  const [contactCenterUnread, setContactCenterUnread] = useState(0)

  function incrementSpaceUnread(widgetId) {
    setUnreadBySpace((prev) => ({ ...prev, [widgetId]: (prev[widgetId] || 0) + 1 }))
  }

  function clearSpaceUnread(widgetId) {
    setUnreadBySpace((prev) => (prev[widgetId] ? { ...prev, [widgetId]: 0 } : prev))
  }

  function incrementContactCenterUnread() {
    setContactCenterUnread((n) => n + 1)
  }

  function clearContactCenterUnread() {
    setContactCenterUnread(0)
  }

  useEffect(() => {
    if (!activeSpaceId) {
      setSpace(null)
      return
    }
    setLoading(true)
    fetchSpace(activeSpaceId)
  }, [activeSpaceId])

  function fetchSpace(id) {
    return supabase
      .from('widgets')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setSpace(data)
        setLoading(false)
      })
  }

  function refreshSpace() {
    if (activeSpaceId) fetchSpace(activeSpaceId)
  }

  function setActiveSpaceId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setActiveSpaceIdState(id)
  }

  return (
    <SpaceContext.Provider
      value={{
        activeSpaceId,
        space,
        loading,
        setActiveSpaceId,
        refreshSpace,
        unreadBySpace,
        incrementSpaceUnread,
        clearSpaceUnread,
        contactCenterUnread,
        incrementContactCenterUnread,
        clearContactCenterUnread,
      }}
    >
      {children}
    </SpaceContext.Provider>
  )
}

export function useSpace() {
  const ctx = useContext(SpaceContext)
  if (!ctx) throw new Error('useSpace must be used within SpaceProvider')
  return ctx
}
