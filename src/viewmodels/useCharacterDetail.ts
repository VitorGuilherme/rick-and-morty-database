/**
 * useCharacterDetail.ts — Camada ViewModel (MVVC)
 * Mesmo padrão do projeto anterior: Observer via useEffect + cleanup de cancelamento.
 */

import { useCallback, useEffect, useState } from 'react'
import { fetchCharacterById } from '@/models/rickAndMortyApi'
import type { AsyncStatus, Character } from '@/models/types'

export interface UseCharacterDetailReturn {
  selectedCharacter: Character | null
  detailStatus: AsyncStatus
  detailError: string | null
  openDetail: (character: Character) => void
  closeDetail: () => void
}

export function useCharacterDetail(): UseCharacterDetailReturn {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [detailStatus, setDetailStatus] = useState<AsyncStatus>('idle')
  const [detailError, setDetailError] = useState<string | null>(null)

  const openDetail = useCallback((character: Character) => {
    setSelectedCharacter(character)
    setDetailStatus('idle')
    setDetailError(null)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedCharacter(null)
    setDetailStatus('idle')
    setDetailError(null)
  }, [])

  useEffect(() => {
    if (!selectedCharacter) return
    let cancelled = false

    const fetchDetails = async () => {
      setDetailStatus('loading')
      try {
        const detailed = await fetchCharacterById(selectedCharacter.id)
        if (!cancelled) {
          setSelectedCharacter(detailed)
          setDetailStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setDetailError(err instanceof Error ? err.message : 'Erro.')
          setDetailStatus('error')
          // Mantém os dados do card — degradação elegante
        }
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [selectedCharacter?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { selectedCharacter, detailStatus, detailError, openDetail, closeDetail }
}
