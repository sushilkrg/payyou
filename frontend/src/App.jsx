
// import './App.css'

import { BrowserRouter } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import AppRoutes from "./routes/AppRoutes"

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-black">
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
