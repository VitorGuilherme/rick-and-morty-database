/**
 * App.tsx — Bootstrap da árvore React.
 * BrowserRouter + MainLayout + Routes.
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/views/layouts/MainLayout'
import { HomePage } from '@/views/pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
