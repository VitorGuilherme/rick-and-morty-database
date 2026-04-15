/**
 * helpers.ts — Utils
 * Funções puras, sem side effects, sem React.
 */

import type { CharacterStatus } from '@/models/types'

export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}...`
}

export function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Retorna classe CSS e label traduzido para o status do personagem.
 * Centralizado aqui para não duplicar em Card + Modal.
 */
export function getStatusMeta(status: CharacterStatus): {
  label: string
  className: string
  dotClass: string
} {
  switch (status) {
    case 'Alive':
      return { label: 'Vivo', className: 'text-rm-green', dotClass: 'bg-rm-green' }
    case 'Dead':
      return { label: 'Morto', className: 'text-red-500', dotClass: 'bg-red-500' }
    default:
      return { label: 'Desconhecido', className: 'text-rm-gray-light', dotClass: 'bg-rm-gray-light' }
  }
}

/**
 * Traduz o gênero do inglês para português.
 */
export function translateGender(gender: string): string {
  const map: Record<string, string> = {
    Male: 'Masculino',
    Female: 'Feminino',
    Genderless: 'Sem gênero',
    unknown: 'Desconhecido',
  }
  return map[gender] ?? gender
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let id: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), delay)
  }
}