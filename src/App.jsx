import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import EntenderProblema from './pages/EntenderProblema'
import EDA from './pages/EDA'
import Baseline from './pages/Baseline'
import Validacion from './pages/Validacion'
import FeatureEngineering from './pages/FeatureEngineering'
import Ensembling from './pages/Ensembling'
import Submissions from './pages/Submissions'

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
        <Route path="/submissions" element={<Submissions />} />
        <Route path="*" element={<Navigate to="/entender-problema" replace />} />
      </Route>
    </Routes>
  )
}

export default App
