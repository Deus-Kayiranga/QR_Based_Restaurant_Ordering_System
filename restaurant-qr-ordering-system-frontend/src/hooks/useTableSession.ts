import { useContext } from 'react'
import { TableSessionContext } from '../contexts/TableSessionContext'

export function useTableSession() {
  const ctx = useContext(TableSessionContext)
  if (!ctx) throw new Error('useTableSession must be used within TableSessionProvider')
  return ctx
}
