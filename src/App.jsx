import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import EntenderProblema from './pages/EntenderProblema'
import EDA from './pages/EDA'
import Baseline from './pages/Baseline'
import Validacion from './pages/Validacion'
import FeatureEngineering from './pages/FeatureEngineering'
import Ensembling from './pages/Ensembling'
import Placeholder from './pages/Placeholder'
import { phases } from './phases'

const builtSlugs = ['entender-problema', 'eda', 'baseline', 'validacion', 'feature-engineering', 'ensembling']
const placeholderPhases = phases.filter((p) => !builtSlugs.includes(p.slug))

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/entender-problema" replace />} />
        <Route path="/entender-problema" element={<EntenderProblema />} />
        <Route path="/eda" element={<EDA />} />
        <Route path="/baseline" element={<Baseline />} />
        <Route path="/validacion" element={<Validacion />} />
        <Route path="/feature-engineering" element={<FeatureEngineering />} />
        <Route path="/ensembling" element={<Ensembling />} />
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
