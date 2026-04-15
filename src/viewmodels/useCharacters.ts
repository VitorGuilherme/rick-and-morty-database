/**
 * useCharacters.ts — Camada ViewModel (MVVC)
 *
 * Responsabilidade: Gerenciar estado, paginação cursor-based, busca e scroll infinito.
 *
 * DIFERENÇA CHAVE EM RELAÇÃO AO PROJETO ANTERIOR:
 *   A Rick & Morty API usa paginação por cursor (URL "next"), não por offset.
 *   Isso muda a estratégia de estado:
 *     - Antes: guardávamos `offset` (número)
 *     - Agora: guardamos `nextPageUrl` (string | null)
 *
 *   Quando `nextPageUrl` é null, chegamos na última página.
 *   Quando não é null, ela JÁ CONTÉM todos os parâmetros para a próxima requisição.
 *   Isso é cursor-based pagination — o servidor controla o estado de paginação.
 *
 * Doc paginação R&M: https://rickandmortyapi.com/documentation/#info-and-pagination
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchCharacters } from '@/models/rickAndMortyApi'
import { normalizeForSearch } from '@/utils/helpers'
import type { AsyncStatus, Character } from '@/models/types'

// ─── Interface pública do hook ────────────────────────────────────────────────

export interface UseCharactersReturn {
  characters: Character[]
  status: AsyncStatus
  error: string | null
  hasMore: boolean
  totalLoaded: number
  totalAvailable: number
  searchQuery: string
  setSearchQuery: (query: string) => void
  loadMore: () => void
  retry: () => void
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useCharacters(): UseCharactersReturn {
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * nextPageUrlRef: guarda a URL do cursor de paginação.
   * null = primeira página OU última página já carregada.
   * Ref (não state) porque mudar o cursor não deve causar re-render — só o
   * resultado do fetch deve.
   */
  const nextPageUrlRef = useRef<string | null>(null)
  const hasMoreRef = useRef(true)
  const isFetchingRef = useRef(false)

  // ─── Carregamento ───────────────────────────────────────────────────────

  const loadCharacters = useCallback(async (reset = false) => {
    if (isFetchingRef.current) return
    if (!reset && !hasMoreRef.current) return

    isFetchingRef.current = true
    setStatus('loading')
    setError(null)

    try {
      // No reset, voltamos ao início (null = primeira página)
      const urlToFetch = reset ? null : nextPageUrlRef.current

      const { characters, nextPageUrl, total } = await fetchCharacters(urlToFetch)

      setAllCharacters((prev) => reset ? characters : [...prev, ...characters])
      setTotalAvailable(total)

      // Atualiza o cursor para a próxima chamada
      nextPageUrlRef.current = nextPageUrl
      hasMoreRef.current = nextPageUrl !== null

      setStatus('success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido.'

      // A R&M API retorna 404 quando não encontra personagens pelo filtro de nome
      if (message.includes('404') || message.includes('404')) {
        setError('Nenhum personagem encontrado com esse nome.')
      } else if (message.includes('Network Error') || message.includes('timeout')) {
        setError('Problema de conexão. Verifique sua internet.')
      } else {
        setError(`Erro ao carregar: ${message}`)
      }

      setStatus('error')
    } finally {
      isFetchingRef.current = false
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  // ─── Filtro local (client-side) ─────────────────────────────────────────

  /**
   * useMemo: recalcula só quando a lista ou a query muda.
   * Filtragem client-side — funciona bem para os ~826 personagens já carregados.
   * Para datasets maiores, usaríamos o parâmetro ?name= da API (server-side filter).
   */
  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return allCharacters
    const q = normalizeForSearch(searchQuery)
    return allCharacters.filter((c) =>
      normalizeForSearch(c.name).includes(q) ||
      normalizeForSearch(c.species).includes(q)
    )
  }, [allCharacters, searchQuery])

  // ─── Callbacks públicos ─────────────────────────────────────────────────

  const loadMore = useCallback(() => {
    if (status !== 'loading' && hasMoreRef.current) {
      loadCharacters()
    }
  }, [status, loadCharacters])

  const retry = useCallback(() => {
    nextPageUrlRef.current = null
    hasMoreRef.current = true
    setAllCharacters([])
    setTotalAvailable(0)
    loadCharacters(true)
  }, [loadCharacters])

  return {
    characters: filteredCharacters,
    status,
    error,
    hasMore: hasMoreRef.current,
    totalLoaded: allCharacters.length,
    totalAvailable,
    searchQuery,
    setSearchQuery,
    loadMore,
    retry,
  }
}
