/**
 * CharacterModal.tsx — View Page
 *
 * Modal de detalhes do personagem. Campos R&M: status, species, origin,
 * location atual, primeiro episódio, total de episódios.
 * data-testid="character-modal"
 */

import { useEffect, useRef } from 'react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { getStatusMeta, translateGender } from '@/utils/helpers'
import type { AsyncStatus, Character } from '@/models/types'

interface CharacterModalProps {
  character: Character
  status: AsyncStatus
  error: string | null
  onClose: () => void
}

export function CharacterModal({ character, status, error, onClose }: CharacterModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const statusMeta = getStatusMeta(character.status)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="presentation"
    >
      <div
        data-testid="character-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-char-name"
        className="relative w-full sm:max-w-md flex flex-col animate-slide-up"
        style={{ maxHeight: '92dvh' }}
      >
        {/* Botão fechar */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-30 text-rm-gray-muted hover:text-rm-green transition-colors bg-rm-dark-1/90 backdrop-blur-sm p-1.5 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Imagem hero ─────────────────────────────────────────── */}
        <div className="
          relative flex-shrink-0 mx-4 rounded-3xl overflow-hidden h-64 sm:h-72 z-10
          shadow-[0_16px_48px_rgba(0,0,0,0.85)]
          ring-1 ring-white/10
        ">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-full object-cover object-top"
          />

          {/* Gradiente para o nome ficar legível */}
          <div className="absolute inset-0 bg-gradient-to-t from-rm-dark-1 via-rm-dark-1/30 to-transparent" />

          {/* Badge de status */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rm-dark-1/75 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass} animate-pulse`} />
            <span className={`text-[9px] font-body uppercase tracking-widest ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
          </div>

          {/* Badge de episódios */}
          <div className="absolute top-3 right-10 bg-rm-dark-1/75 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="text-[9px] font-body text-rm-gray-light tracking-wider">
              {character.episodeCount} EP
            </span>
          </div>

          {/* Nome + species sobre o gradiente */}
          <div className="absolute bottom-0 inset-x-0 px-5 pb-5">
            <h2 id="modal-char-name" className="font-display text-4xl sm:text-5xl text-rm-white leading-none tracking-wide">
              {character.name}
            </h2>
            <p className="text-xs font-body text-rm-gray-light mt-1">
              {character.species}{character.type && ` — ${character.type}`}
            </p>
          </div>
        </div>

        {/* ── Painel de dados ─────────────────────────────────────── */}
        <div className="
          -mt-6 flex-1 min-h-0 overflow-y-auto
          rounded-3xl bg-rm-dark-1 border border-rm-dark-4
          pt-9 pb-6 px-5 space-y-5
        ">
          {status === 'loading' && <LoadingSpinner message="Sincronizando dados..." size="sm" />}
          {status === 'error' && error && (
            <p className="text-[10px] font-body text-rm-gray-muted italic">// dados adicionais indisponíveis</p>
          )}

          {/* Ficha técnica */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'gênero', value: translateGender(character.gender) },
              { label: 'origem', value: character.origin },
              { label: 'localização', value: character.location },
              { label: 'visto em', value: character.firstSeen },
            ].map(({ label, value }) => (
              <div key={label} className="bg-rm-dark-2 border border-rm-dark-4 p-3 rounded-xl">
                <p className="text-[9px] font-body uppercase tracking-widest text-rm-green/60 mb-1">{label}</p>
                <p className="text-xs font-body text-rm-white leading-snug">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Episódios */}
          <div className="bg-rm-dark-2 border border-rm-dark-4 p-3 rounded-xl flex items-center justify-between">
            <p className="text-[9px] font-body uppercase tracking-widest text-rm-green/60">episódios</p>
            <p className="font-display text-3xl text-rm-green">{character.episodeCount}</p>
          </div>

          {/* Habilidades */}
          <div className="space-y-2">
            <p className="text-[9px] font-body uppercase tracking-widest text-rm-green/70">habilidades</p>
            <ul className="flex flex-wrap gap-1.5">
              {character.abilities.map((a) => (
                <li key={a} className="text-[10px] font-body bg-rm-green/5 border border-rm-green/15 text-rm-white px-2.5 py-1 rounded-full">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Fraquezas */}
          <div className="space-y-2">
            <p className="text-[9px] font-body uppercase tracking-widest text-rm-gray-muted">fraquezas</p>
            <ul className="flex flex-wrap gap-1.5">
              {character.weaknesses.map((w) => (
                <li key={w} className="text-[10px] font-body border border-rm-dark-4 text-rm-gray-light px-2.5 py-1 rounded-full">
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <p className="text-[9px] text-rm-gray-muted font-body border-t border-rm-dark-4 pt-3">
            // rickandmortyapi.com — trevorhenderson.com © 2013–2023 Adult Swim
          </p>
        </div>
      </div>
    </div>
  )
}
