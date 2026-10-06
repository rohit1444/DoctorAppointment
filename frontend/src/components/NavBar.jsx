import React , {useContext, useState} from 'react'
import { assets } from '../assets/assets' // Make sure this path and spelling are correct
import { NavLink , useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const NavBar = () => {
    const navigate = useNavigate();
    const {token,setToken,userData} = useContext(AppContext)
    const [showMenu, setShowMenu] = useState(false);

    //logout
    const logout = () => {
      setToken(false)
      localStorage.removeItem('token')
    }
     
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={()=>navigate('/')} className='w-44 cursor-pointer'  src={assets.logo} alt="" />
      <ul className='hidden md:flex items-center gap-5 font-medium'>
        
          <NavLink to='/'>
            <li className='py-1'>HOME</li>
            <hr  className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
          </NavLink>
          <NavLink to='/Doctors'>
            <li className='py-1'>ALL DOCTORS</li>
            <hr  className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
          </NavLink>
          <NavLink to='/About'> 
            <li className='py-1'>ABOUT</li>
            <hr  className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
          </NavLink>
          <NavLink to='/Contact'>
            <li className='py-1'>CONTACT</li>
            <hr  className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
          </NavLink>
       
      </ul>
      <div className='flex items-center gap-4'>
        {
          token && userData // userData is used here so that the changed profile picture will also reflect in the navigation bar
           ? <div className='flex items-center gap-2 cursor-pointer group relative' > {/* here we are using a group to show the dropdown menu */}
           {/* <img className='w-8 rounded-full' src={assets.profile_pic} alt="" /> */}
           <img className='w-8 rounded-full' src={userData.image} alt="" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'> {/* this will show the dropdown menu when we hover over the group */}
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=> navigate('/MyProfile')} className='hover:text-black cursor-pointer'>My Profile</p> {/* hover effect to change text color */}
                <p onClick={()=> navigate('/MyAppointments')} className='hover:text-black cursor-pointer'>My Appointments</p> {/* hover effect to change text color and onClick function to go to those pages */}
                <p onClick={logout}className='hover:text-black cursor-pointer'>Logout</p> {/* hover effect to change text color and setToken to get the create account button on logout*/}
              </div>
            </div>
          </div> :
          <button onClick={()=>navigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light'>Create account</button>
        }
        <img onClick={()=> setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
        {/**---------Mobile Menu--------- */}
        <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'}md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 font-medium text-lg'>
            <NavLink onClick={()=> setShowMenu(false)} to='/'className={({ isActive }) =>`px-4 py-2 rounded inline-block ${isActive ? 'bg-[#5f6FFF] text-white' : ''}`}>HOME</NavLink>
            <NavLink onClick={() => setShowMenu(false)}to='/Doctors'className={({ isActive }) =>`px-4 py-2 rounded inline-block ${isActive ? 'bg-[#5f6FFF] text-white' : ''}`}>ALL DOCTORS</NavLink>
            <NavLink onClick={()=> setShowMenu(false)} to='/About'className={({ isActive }) =>`px-4 py-2 rounded inline-block ${isActive ? 'bg-[#5f6FFF] text-white' : ''}`}>ABOUT</NavLink>
            <NavLink onClick={()=> setShowMenu(false)} to='/Contact'className={({ isActive }) =>`px-4 py-2 rounded inline-block ${isActive ? 'bg-[#5f6FFF] text-white' : ''}`}>CONTACT</NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NavBar