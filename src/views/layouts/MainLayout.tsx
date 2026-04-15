/**
 * MainLayout.tsx — View Layout
 * Header com logo R&M + indicador de API pública + footer.
 */

import type { ReactNode } from 'react'

interface MainLayoutProps { children: ReactNode }

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-rm-black">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-rm-black/95 backdrop-blur-sm border-b border-rm-dark-4">
        {/* Linha verde no topo */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-rm-green/50 to-transparent" />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Portal icon */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-rm-green/30 animate-[portalSpin_8s_linear_infinite]" />
              <div className="absolute inset-1 rounded-full border border-rm-green/20 animate-[portalSpin_5s_linear_infinite_reverse]" />
              <div className="w-3 h-3 rounded-full bg-rm-green animate-glow-pulse" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-rm-white tracking-[0.12em] leading-none">
                RICK & MORTY
              </h1>
              <p className="text-[9px] font-body uppercase tracking-[0.3em] text-rm-green/60 leading-none mt-0.5">
                multiverso explorer
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* ── Conteúdo ─────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-rm-dark-4 mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[9px] font-body text-rm-gray-muted uppercase tracking-widest">
            // rickandmortyapi.com — dados fornecidos por Axel Fuhrmann
          </p>
          <a
            href="https://rickandmortyapi.com/documentation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-body text-rm-gray-muted hover:text-rm-green transition-colors uppercase tracking-widest"
          >
            documentação da api →
          </a>
        </div>
      </footer>
    </div>
  )
}
