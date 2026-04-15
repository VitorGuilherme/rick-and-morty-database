/**
 * CharacterCard.tsx — View Component
 *
 * Card de personagem Rick & Morty.
 * Campos adicionais vs Marvel: status (Alive/Dead/unknown), species, origin, episodeCount.
 * Componente puro — zero estado, zero efeitos, zero lógica de negócio.
 *
 * data-testid="character-card" / data-testid-specific="character-card-{id}"
 */

import { useState } from 'react'
import { getStatusMeta, truncateText } from '@/utils/helpers'
import type { Character } from '@/models/types'

const MAX_ABILITIES = 2

interface CharacterCardProps {
  character: Character
  onSelect: (character: Character) => void
  index?: number
}

export function CharacterCard({ character, onSelect, index = 0 }: CharacterCardProps) {
  const [imgError, setImgError] = useState(false)
  const status = getStatusMeta(character.status)
  const animationDelay = `${Math.min(index % 20, 19) * 40}ms`

  return (
    <article
      data-testid="character-card"
      data-testid-specific={`character-card-${character.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${character.name}`}
      onClick={() => onSelect(character)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(character) }
      }}
      className="
        group relative
        bg-rm-dark-2 border border-rm-dark-4
        rounded-2xl cursor-pointer overflow-hidden
        animate-slide-up
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_8px_30px_rgba(57,255,20,0.15)]
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rm-green/50
      "
      style={{ animationDelay, animationFillMode: 'both' }}
    >
      {/* ── Imagem ─────────────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-rm-dark-3">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-rm-dark-3">
            <span className="text-rm-gray-muted font-body text-xs">SEM IMAGEM</span>
          </div>
        ) : (
          <img
            src={character.imageUrl}
            alt={character.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Gradiente bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rm-dark-1/95 via-rm-dark-1/30 to-transparent" />

        {/* Badge de status — canto superior esquerdo */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-rm-dark-1/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className={`w-1.5 h-1.5 rounded-full ${status.dotClass} animate-pulse`} />
          <span className={`text-[9px] font-body uppercase tracking-widest ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Badge de episódios — canto superior direito */}
        <div className="absolute top-2 right-2 bg-rm-dark-1/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-[9px] font-body text-rm-gray-light tracking-wider">
            {character.episodeCount} EP
          </span>
        </div>
      </div>

      {/* ── Conteúdo ───────────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5">
        {/* Nome */}
        <h3 className="font-display text-lg leading-tight text-rm-white tracking-wide group-hover:text-rm-green transition-colors duration-200">
          {character.name}
        </h3>

        {/* Species + type */}
        <p className="text-[10px] font-body text-rm-gray-light">
          {character.species}
          {character.type && ` — ${truncateText(character.type, 20)}`}
        </p>

        {/* Origem */}
        <div className="text-[10px] font-body text-rm-gray-muted truncate">
          <span className="text-rm-green/60">origin: </span>
          {truncateText(character.origin, 22)}
        </div>

        {/* Habilidades */}
        <div className="space-y-1">
          <span className="text-[9px] font-body uppercase tracking-[0.15em] text-rm-green/70">
            habilidades
          </span>
          <ul className="flex flex-wrap gap-1">
            {character.abilities.slice(0, MAX_ABILITIES).map((a) => (
              <li key={a} className="text-[9px] font-body bg-rm-dark-3 border border-rm-dark-4 text-rm-gray-light px-1.5 py-0.5 leading-tight rounded-full">
                {truncateText(a, 24)}
              </li>
            ))}
            {character.abilities.length > MAX_ABILITIES && (
              <li className="text-[9px] font-body text-rm-gray-muted px-1 py-0.5">
                +{character.abilities.length - MAX_ABILITIES}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Portal vortex overlay — mix-blend-mode: screen faz o fundo preto virar transparente */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      >
        <img
          src="https://media.giphy.com/media/IgA2AJscUx3gTfITIY/giphy.gif"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-10"
        />
      </div>
    </article>
  )
}
