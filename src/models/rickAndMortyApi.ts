/**
 * rickAndMortyApi.ts — Camada Model (MVVC)
 *
 * Responsabilidade: Comunicação com a Rick & Morty API.
 *
 * Diferenças cruciais em relação à Marvel API (e por que são relevantes para estudo):
 *
 *   1. ZERO autenticação — sem API key, sem hash, sem header especial.
 *      A API é pública e aberta. Basta fazer GET e receber dados.
 *
 *   2. Paginação por cursor (URL "next") em vez de offset/limit.
 *      A API retorna `info.next` com a URL da próxima página.
 *      Isso é o padrão "cursor-based pagination" — mais eficiente em grandes datasets
 *      porque o servidor não precisa contar registros anteriores toda vez.
 *      Doc: https://rickandmortyapi.com/documentation/#info-and-pagination
 *
 *   3. Imagens diretas — nenhuma montagem de URL necessária.
 *      A API retorna `image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg"`
 *      Pronto. Sem path + extension + variant. A vida pode ser simples.
 *
 * Total de personagens na API: ~826 (cresce com novas temporadas).
 * Personagens por página: 20 (fixo, não configurável).
 *
 * API oficial: https://rickandmortyapi.com/documentation
 */

import axios from 'axios'
import abilitiesData from './abilities.json'
import type {
  Character,
  CharacterAbilities,
  RMApiResponse,
  RMCharacterRaw,
} from './types'

// ─── Configuração ────────────────────────────────────────────────────────────

const BASE_URL = 'https://rickandmortyapi.com/api'

/**
 * Instância axios com baseURL e timeout.
 * Sem interceptors de auth — porque não precisamos. Saudade disso, né?
 */
const rmAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// ─── Mapa local de habilidades ───────────────────────────────────────────────

const abilitiesMap = abilitiesData as unknown as Record<string, CharacterAbilities>

function getAbilities(id: number): CharacterAbilities {
  return abilitiesMap[id.toString()] ?? {
    abilities: ['Habilidades desconhecidas'],
    weaknesses: ['Fraquezas desconhecidas'],
  }
}

// ─── Transformação raw → domínio ─────────────────────────────────────────────

/**
 * Converte personagem cru da API para o tipo Character do domínio.
 *
 * Decisões de transformação:
 *   - origin/location: guardamos só o name (a URL interna não tem uso no front)
 *   - episodeCount: derivado de episode.length — mais útil que as URLs cruas
 *   - firstSeen: número do primeiro episódio extraído da URL (ex: ".../episode/1" → "EP 1")
 *     Em produção, faríamos um fetch para buscar o nome real do episódio.
 *     Para fins de estudo, extraímos o número — evita N+1 requests na listagem.
 */
function rawToCharacter(raw: RMCharacterRaw): Character {
  const { abilities, weaknesses } = getAbilities(raw.id)

  // Extrai o número do episódio da URL: "https://.../api/episode/28" → "EP 28"
  const firstEpisodeUrl = raw.episode[0] ?? ''
  const episodeNumber = firstEpisodeUrl.split('/').pop() ?? '?'
  const firstSeen = `EP ${episodeNumber}`

  return {
    id: raw.id,
    name: raw.name,
    status: raw.status,
    species: raw.species,
    type: raw.type,
    gender: raw.gender,
    origin: raw.origin.name,
    location: raw.location.name,
    imageUrl: raw.image,           // URL direta — zero transformação necessária
    episodeCount: raw.episode.length,
    firstSeen,
    abilities,
    weaknesses,
    profileUrl: raw.url,
  }
}

// ─── Funções públicas ────────────────────────────────────────────────────────

/** Resultado de uma página de personagens */
export interface FetchCharactersResult {
  characters: Character[]
  nextPageUrl: string | null  // null = última página
  total: number
}

/**
 * Busca uma página de personagens.
 *
 * @param pageUrl - URL completa da página (null = primeira página).
 *   Na primeira chamada, passamos null → usa a URL base.
 *   Nas chamadas seguintes, passamos o `info.next` retornado pela API.
 *
 *   Esse padrão de "passar a próxima URL" é diferente do offset tradicional:
 *   o servidor controla o cursor, não o cliente. Menos bug, mais elegância.
 *
 * @param nameFilter - Filtro por nome (busca server-side — a API suporta).
 */
export async function fetchCharacters(
  pageUrl: string | null,
  nameFilter?: string,
): Promise<FetchCharactersResult> {
  // Na primeira página, construímos a URL base; nas demais, usamos o cursor
  let url: string
  if (pageUrl) {
    url = pageUrl
  } else {
    url = `${BASE_URL}/character`
    if (nameFilter?.trim()) {
      url += `?name=${encodeURIComponent(nameFilter.trim())}`
    }
  }

  const response = await rmAxios.get<RMApiResponse>(url)
  const { info, results } = response.data

  return {
    characters: results.map(rawToCharacter),
    nextPageUrl: info.next,
    total: info.count,
  }
}

/**
 * Busca um personagem específico pelo ID.
 * Usado pelo modal de detalhes.
 */
export async function fetchCharacterById(id: number): Promise<Character> {
  const response = await rmAxios.get<RMCharacterRaw>(`/character/${id}`)
  return rawToCharacter(response.data)
}
