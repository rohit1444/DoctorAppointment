import React, { useEffect , useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios'
// The AppContext is imported from the context folder, which provides access to the global state of

const Appointment = () => {
  const {docId} = useParams() // Using useParams to get the docId from the URL parameters
  // The useParams hook is used to access the URL parameters in React Router.
  const {doctors , currencySymbol, backendUrl,token,getDoctorsData} = useContext(AppContext) // Using useContext to access the doctors data from AppContext
  // The useContext hook allows you to access the context value provided by AppContext.Provider.
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  // The daysOfWeek array contains the abbreviated names of the days of the week.

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null);
  // The useState hook is used to manage the state of the doctor information.
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  // The useState hook is used to manage the state of the doctor's slots and the selected
  // slot index. docSlots will hold the available slots for the doctor, and slotIndex will track the currently selected slot.
  // The docInfo state is initialized to null, which will be updated with the doctor's information once fetched.
  // The docSlots state is initialized to an empty array, which will be used to store the available slots for the doctor.
  // The slotIndex state is initialized to 0, which will be used to track the currently selected slot index.
  const [slotTime, setSlotTime] = useState('');
  // The useState hook is used to manage the state of the selected slot time.
  useEffect(() => {
    fetchDocInfo();
    // The useEffect hook is used to call the fetchDocInfo function when the component mounts or when the doctors or docId changes.

  },[doctors, docId])
  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    // The find method is used to search for the doctor with the matching docId in the doctors array.
    setDocInfo(docInfo);
    // The setDocInfo function is used to update the state with the found doctor information.

  }
  const getAvailableSlots = async () => {
    setDocSlots([])
    //getting current date
    let today = new Date();
    // The new Date() constructor is used to create a new Date object representing the current date
    for(let i = 0; i < 7; i++) {
      // The for loop iterates 7 times to generate the next 7 days from today
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      // The setDate method is used to set the date of the currentDate object to today
      // settings and time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      //setting hours
      if(today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() >10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);


      } else{
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots =[];
      // The timeSlots array will hold the available time slots for the current date.
      while(currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        // The toLocaleTimeString method is used to format the time in a 2-digit format (e.g., "10:00 AM", "11:30 PM").

        //hide booked time slot
        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()

        const slotDate= day +" "+ month + " " + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true


        if(isSlotAvailable){
          //add slot to the timeSlots array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        }

        
        // Increament the currentDate by 30 minutes to get the next time slot
        currentDate.setMinutes(currentDate.getMinutes() + 30);

      }
      setDocSlots(prev =>( [...prev,  timeSlots]));
  }}
  
  const bookAppointment = async () =>{
    if(!token){
      toast.warn("Login to book appointment")
      return  navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()
      const slotDate = day +" "+ month + " " + year

      //console.log(slotDate)
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/MyAppointments')
      }
      else{
        toast.error(data.message)

      }    
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

  useEffect(() => {
    if (docInfo) {
      setDocSlots([])
      getAvailableSlots()
    }
  }, [docInfo])
  return docInfo &&  (
    <div>
      {/**----------Doctor Details-------- */}
      <div className='flex flex-col sm:flex-row gap-5'> {/** This div contains the doctor's image and information and the classname property separtes the image and info from left to right */ }
        <div>
          <img className='bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'> {/** This div contains the doctor's information and the classname property makes it look like a card  and the mt-[-80px] property makes it look like the image is overlapping the card */}
          {/**--------Doctor Info: name degree experience-------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>
            {/** ------Doctor About*/}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
            </p>
        </div>
      </div>
      {/**----------Doctor Booking Slots-------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex=== index ? 'bg-[#5f6FFF] text white': 'border border-gray-200'}` } key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full mt-4 overflow-x-scroll'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#5f6FFF] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>

          ))}
        </div>
        <button onClick={bookAppointment} className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
        
      </div>
      {/**----------Listing Relate Doctors-------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      
    </div>
  )
}

export default Appointment
