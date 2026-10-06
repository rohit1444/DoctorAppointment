import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/appointment'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
  import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Doctors' element={<Doctors />} />
        <Route path='/Doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/MyProfile' element={<MyProfile />} />
        <Route path='/MyAppointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer /> {/* Assuming you have a Footer component to include at the bottom of your app on all pages */}
    </div>
  )
}

export default App
