/**
 * MainLayout.tsx — View Layout
 * Header com logo R&M + indicador de API pública + footer.
 */

import type { ReactNode } from 'react'

interface MainLayoutProps { children: ReactNode }

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-rm-black">

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
