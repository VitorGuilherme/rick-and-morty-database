/**
 * HomePage.tsx — View Page
 *
 * Página principal: orquestra ViewModels, grid de cards,
 * scroll infinito e modal de detalhes.
 *
 * Adicionado em relação ao projeto anterior:
 *   - Filtros visuais de status (Alive / Dead / unknown)
 *   - Contador de progresso de carregamento (X de Y personagens)
 *   - Grid 2→3→4→5 colunas
 */

import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useCharacters } from '@/viewmodels/useCharacters'
import { useCharacterDetail } from '@/viewmodels/useCharacterDetail'
import { CharacterCard } from '../components/CharacterCard'
import { SearchBar } from '../components/SearchBar'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { CharacterModal } from './CharacterModal'
import type { CharacterStatus } from '@/models/types'

// ─── Filtro de status ─────────────────────────────────────────────────────────

type StatusFilter = CharacterStatus | 'All'

const STATUS_OPTIONS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: 'All',     label: 'Todos',       dot: 'bg-rm-gray-muted' },
  { value: 'Alive',   label: 'Vivos',       dot: 'bg-rm-green' },
  { value: 'Dead',    label: 'Mortos',      dot: 'bg-red-500' },
  { value: 'unknown', label: 'Desconhecido', dot: 'bg-rm-gray-light' },
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function HomePage() {
  const {
    characters,
    status,
    error,
    hasMore,
    totalLoaded,
    totalAvailable,
    searchQuery,
    setSearchQuery,
    loadMore,
    retry,
  } = useCharacters()

  const { selectedCharacter, detailStatus, detailError, openDetail, closeDetail } =
    useCharacterDetail()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  // ─── Filtro local de status ────────────────────────────────────────────

  /**
   * useMemo: aplica o filtro de status POR CIMA da lista já filtrada por nome.
   * Dois filtros independentes compostos — um de busca (no ViewModel) e
   * um de status (local aqui, na Page). A composição é simples porque cada
   * filtro tem responsabilidade única.
   */
  const displayedCharacters = useMemo(() => {
    if (statusFilter === 'All') return characters
    return characters.filter((c) => c.status === statusFilter)
  }, [characters, statusFilter])

  // ─── Scroll infinito ───────────────────────────────────────────────────

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '300px',
  })

  useEffect(() => {
    if (inView && hasMore && status !== 'loading') {
      loadMore()
    }
  }, [inView, hasMore, status, loadMore])

  // ─── Progresso de carregamento ─────────────────────────────────────────

  const loadPercent = totalAvailable > 0
    ? Math.round((totalLoaded / totalAvailable) * 100)
    : 0

  // ─── Estado de erro inicial ────────────────────────────────────────────

  if (status === 'error' && totalLoaded === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32 gap-6 text-center"
        data-testid="error-message"
        role="alert"
      >
        <div className="border border-red-500/30 p-6 space-y-4 max-w-md">
          <p className="text-[10px] font-body uppercase tracking-widest text-red-400">
            // erro de conexão
          </p>
          <p className="text-sm font-body text-rm-gray-light leading-relaxed">{error}</p>
          <button
            onClick={retry}
            className="
              w-full py-2.5
              border border-rm-green/30 hover:border-rm-green/60
              text-rm-green font-body text-xs uppercase tracking-widest
              transition-colors duration-150
            "
          >
            &gt;_ tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3">
        <div className="flex items-end gap-4 flex-wrap">
          <h2 className="font-display text-5xl sm:text-7xl text-rm-white tracking-wide leading-none">
            PERSONAGENS
          </h2>
          {totalAvailable > 0 && (
            <span className="font-body text-xs text-rm-gray-muted mb-1">
              // {totalLoaded} de {totalAvailable} carregados
            </span>
          )}
        </div>

        {/* Barra de progresso */}
        {totalAvailable > 0 && (
          <div className="w-full h-px bg-rm-dark-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-rm-green/60 transition-all duration-500"
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        )}

        <p className="text-[11px] font-body text-rm-gray-muted">
          // clique em um card para abrir o portal de detalhes
        </p>
      </div>

      {/* ── Busca + filtros ───────────────────────────────────────────── */}
      <div className="mb-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="buscar por nome ou espécie..."
          resultCount={searchQuery.trim() ? displayedCharacters.length : undefined}
          totalLoaded={totalLoaded}
        />

        {/* Filtros de status */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(({ value, label, dot }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5
                border text-[10px] font-body uppercase tracking-widest
                transition-all duration-150
                ${statusFilter === value
                  ? 'border-rm-green/50 text-rm-green bg-rm-green/5'
                  : 'border-rm-dark-4 text-rm-gray-muted hover:border-rm-dark-3 hover:text-rm-gray-light'
                }
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading inicial ───────────────────────────────────────────── */}
      {status === 'loading' && totalLoaded === 0 && (
        <LoadingSpinner message="Abrindo portal interdimensional..." />
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {totalLoaded > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {displayedCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                onSelect={openDetail}
                index={index}
              />
            ))}
          </div>

          {/* Sem resultados */}
          {displayedCharacters.length === 0 && (
            <div className="py-20 text-center space-y-2" data-testid="error-message">
              <p className="font-display text-4xl text-rm-dark-4 tracking-wide">
                DIMENSÃO VAZIA
              </p>
              <p className="text-xs font-body text-rm-gray-muted">
                // nenhum personagem encontrado com esses filtros
              </p>
            </div>
          )}

          {/* ── Sentinela do scroll infinito ───────────────────────── */}
          {!searchQuery.trim() && (
            <div ref={sentinelRef} className="py-10 flex justify-center">
              {status === 'loading' && (
                <LoadingSpinner message="Carregando mais dimensões..." size="sm" />
              )}
              {status === 'error' && totalLoaded > 0 && (
                <div className="text-center space-y-3" data-testid="error-message">
                  <p className="text-xs font-body text-rm-gray-light">{error}</p>
                  <button
                    onClick={retry}
                    className="text-[10px] font-body uppercase tracking-widest text-rm-green hover:underline"
                  >
                    &gt;_ tentar novamente
                  </button>
                </div>
              )}
              {!hasMore && status === 'success' && (
                <div className="text-center space-y-2">
                  <div className="w-6 h-px bg-rm-green/40 mx-auto" />
                  <p className="text-[10px] font-body uppercase tracking-widest text-rm-gray-muted">
                    // fim do multiverso — {totalLoaded} personagens carregados
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Modal ────────────────────────────────────────────────────── */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          status={detailStatus}
          error={detailError}
          onClose={closeDetail}
        />
      )}
    </>
  )
}
