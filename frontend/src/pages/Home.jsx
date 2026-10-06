import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header /> {/* This is the header component that will be displayed on the home page from Header.jsx */}
      <SpecialityMenu /> {/* This is the speciality menu component that will be displayed on the home page from SpecialityMenu.jsx */}
      <TopDoctors /> {/* This is the top doctors component that will be displayed on the home page from TopDoctors.jsx */}
      <Banner /> {/* This is the banner component that will be displayed on the home page from Banner.jsx */}
    </div>
  )
}

export default Home
