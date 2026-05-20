import Login from "./components/Login"
import { Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup"
import LandingPage from "./pages/LandingPage"
import Layout from "./Layout"
import Video from "./pages/Video"
import Chat from "./pages/ChatAI"
import Feed from "./pages/Feed"
import DoctorDashboard from "./components/DoctorDashboard"
import DoctorLogin from "./components/DoctorLogin"
import DoctorSignup from "./components/DoctorSignup"
import Query from "./components/Query"
import Contact from "./components/Contact"

function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index  element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="doctor-login" element={<DoctorLogin />} />
          <Route path="doctor-signup" element={<DoctorSignup />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="signup" element={<Signup />} />
          <Route path="video" element={<Video />} />
          <Route path="chat" element={<Chat />} />
          <Route path="news" element={<Feed />} />
          <Route path="query" element={<Query />} />
          <Route path="contact" element={<Contact />} />

        </Route>
      </Routes>
      
    </>
  )
}

export default App
