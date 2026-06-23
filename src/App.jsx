import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import EntenderProblema from './pages/EntenderProblema'
import Placeholder from './pages/Placeholder'
import { phases } from './phases'

const placeholderPhases = phases.filter((p) => p.slug !== 'entender-problema')

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/entender-problema" replace />} />
        <Route path="/entender-problema" element={<EntenderProblema />} />
        {placeholderPhases.map((p) => (
          <Route
            key={p.slug}
            path={`/${p.slug}`}
            element={<Placeholder num={p.num} title={p.title} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/entender-problema" replace />} />
      </Route>
    </Routes>
  )
}

export default App
