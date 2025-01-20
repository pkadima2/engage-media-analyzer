import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Auth from "./pages/Auth"
import Pricing from "./pages/Pricing"
import TopBar from "./components/TopBar"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App