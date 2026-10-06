import React, {useContext} from 'react'
import {AppContext} from '../context/AppContext'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

const MyAppointments = () => {
 // const {doctors} = useContext(AppContext); to show dummy doctors in appointments page
 const {backendUrl,token,getDoctorsData} = useContext(AppContext);

 const [appointments,setAppointments] = useState([])

 // to show the date in a more better format like 26 July 2025
 const months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

 const slotDateFormat = (slotDate) => {
  const dateArray = slotDate.split(' ');
  return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
};
 const navigate = useNavigate()

 const getUserAppointments = async () => {
  try {
    const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})

    if(data.success){
      setAppointments(data.appointments.reverse())
      console.log(data.appointments);
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
 }

 //to cancel appointments and make the booked slots free and again visible in the doctors profile

 const cancelAppointment = async (appointmentId) => {
  try {
    //console.log(appointmentId) just to check that we are getting different appointments id when clicking on cancel appointment
    const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
    if(data.success){
      toast.success(data.message)
      getUserAppointments()
      getDoctorsData()
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
    
  }
 }

 //to make payment of the appointment fees
 const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name:'Appointment Payment', 
    description:'Appointment Payment',
    order_id:order.id,
    receipt: order.receipt,
    handler: async(response) => {
      console.log(response)
      //API call to verify the payment
      try {
        const {data} = await axios.post(backendUrl + '/api/user/verifyRazorpay',response,{headers:{token}})
        if(data.success)
        {
          getUserAppointments()
          navigate('/Myappointments')
        }
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }

    }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()

 }

 const appointmentRazorpay = async (appointmentId) => {
  try {
    const {data} = await axios.post(backendUrl + '/api/user/payment-razorpay',{appointmentId},{headers:{token}})
    if(data.success)
    {
     // console.log(data.order) just to check if we are getting the order in console or not
      initPay(data.order)
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }

 } 

 useEffect(()=>{
  if(token){
    getUserAppointments()
  }
},[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
       {/* {doctors.slice(0,3).map((item,index)=>(  to show dummy doctors in appointments page* */}
      { appointments.map((item,index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p >{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{slotDateFormat( item.slotData)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button> }
             {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'>Pay Online</button>} 
             {!item.cancelled && !item.isCompleted  && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>} 
             {item.cancelled && !item.isCompleted  && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 '>Appointment cancelled</button> }
             {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
            </div>

          </div>
        ))}

      </div>
      
    </div>
  )
}

export default MyAppointments
