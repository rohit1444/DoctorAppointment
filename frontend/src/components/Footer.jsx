import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'> {/*all contents are alligned in 3 colomns */}
            {/*--------Left Section---- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellendus, accusantium atque earum iure doloribus. Nam, sit. Expedita quaerat, veniam illum nobis ad molestias quas? Nulla aliquid doloremque quibusdam consectetur.</p>


            </div>
            {/*--------Center Section---- */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
                
            </div>
            {/*--------Right Section---- */}
            <div>
                 <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+1 -212-456-5678</li>
                <li>priyabratapanda34710@gmail.com</li>
            </ul>
                
            </div>
        </div>
        {/*--------Copyright TEXT---- */}
        <div>
            <hr />
            <p className='py-5 test-sm text-center'>Copyright 2025@ prescripto - All Rights Reserved </p>
            
        </div>
      
    </div>
  )
}

export default Footer
