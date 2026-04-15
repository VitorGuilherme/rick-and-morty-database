/**
 * types.ts — Camada Model (MVVC)
 *
 * Responsabilidade: Contratos de dados da aplicação.
 *
 * A Rick & Morty API (https://rickandmortyapi.com/documentation) é bem mais
 * simples que a Marvel: sem auth, paginação via URL ("next"), imagens diretas.
 * Os tipos aqui refletem fielmente o que a API retorna.
 */

// ─── Tipos da Rick & Morty API (raw) ─────────────────────────────────────────

/** Status de vida do personagem */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

/** Gênero do personagem */
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

/** Localização (origin ou location atual) */
export interface RMLocation {
  readonly name: string
  readonly url: string
}

/** Personagem bruto retornado pela API */
export interface RMCharacterRaw {
  readonly id: number
  readonly name: string
  readonly status: CharacterStatus
  readonly species: string
  readonly type: string           // Subtipo (ex: "Parasite", "Robot") — pode ser string vazia
  readonly gender: CharacterGender
  readonly origin: RMLocation
  readonly location: RMLocation
  readonly image: string          // URL direta, sem montagem necessária — que luxo
  readonly episode: string[]      // Array de URLs dos episódios
  readonly url: string
  readonly created: string
}

/** Envelope de paginação da API */
export interface RMApiInfo {
  readonly count: number   // Total de personagens
  readonly pages: number   // Total de páginas
  readonly next: string | null   // URL da próxima página (null se for a última)
  readonly prev: string | null
}

/** Resposta paginada da API */
export interface RMApiResponse {
  readonly info: RMApiInfo
  readonly results: RMCharacterRaw[]
}

// ─── Tipos do Domínio ────────────────────────────────────────────────────────

/** Mock local de habilidades/fraquezas — mesma estratégia do projeto anterior */
export interface CharacterAbilities {
  readonly abilities: string[]
  readonly weaknesses: string[]
}

/**
 * Personagem enriquecido com dados locais.
 * `episodeCount` é calculado na transformação — não precisamos guardar todas as URLs.
 */
export interface Character {
  readonly id: number
  readonly name: string
  readonly status: CharacterStatus
  readonly species: string
  readonly type: string
  readonly gender: CharacterGender
  readonly origin: string          // Só o nome, não a URL interna
  readonly location: string        // Idem
  readonly imageUrl: string
  readonly episodeCount: number    // Derivado de episode.length
  readonly firstSeen: string       // Nome do primeiro episódio (buscado sob demanda)
  readonly abilities: string[]
  readonly weaknesses: string[]
  readonly profileUrl: string
}

// ─── Estado da UI ────────────────────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
