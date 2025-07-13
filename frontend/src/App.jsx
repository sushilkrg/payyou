
// import './App.css'

import { BrowserRouter } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import AppRoutes from "./routes/AppRoutes"
import { store } from "./app/store"
import { login } from "./features/auth/authSlice";

function App() {

  const storedUser = localStorage.getItem("payyou-user");
  // console.log(storedUser);

  if (storedUser) {
    store.dispatch(login(JSON.parse(storedUser)))
  }


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
