/**
 * SearchBar.tsx — View Component
 * Campo de busca estilo terminal. Controlado via props.
 * data-testid="search-input" / "search-button"
 */

import portalImg from '../../public/portal.png'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
  totalLoaded?: number
}

export function SearchBar({ value, onChange, placeholder = 'Buscar personagem...', resultCount }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Ícone vortex/portal */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-rm-green/60 group-focus-within:text-rm-green transition-colors">
          <img src={portalImg} alt="" className="w-5 h-5 object-contain" />
        </div>

        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid="search-input"
          aria-label="Buscar personagem do Rick & Morty"
          className="
            w-full
            bg-rm-dark-2
            border border-rm-dark-4
            text-rm-white font-body
            pl-12 pr-10 py-3
            text-sm tracking-wide
            placeholder:text-rm-gray-muted
            outline-none
            transition-all duration-200
            focus:border-rm-green/50
            focus:bg-rm-dark-1
            focus:shadow-[0_0_0_1px_rgba(57,255,20,0.15)]
            rounded-full
            [-webkit-appearance:none]
          "
          autoComplete="off"
          spellCheck={false}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            data-testid="search-button"
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-rm-gray-muted hover:text-rm-green transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status da busca */}
      <div className="mt-2 px-1 flex items-center justify-between">
        {value.trim() && resultCount !== undefined && (
          <p className="text-[10px] font-body text-rm-gray-muted tracking-widest">
            {resultCount === 0
              ? '// nenhum resultado'
              : `// ${resultCount} resultado${resultCount !== 1 ? 's' : ''} encontrado${resultCount !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>
    </div>
  )
}
