import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDoc] = useState([]);
  // The useContext hook is used to access the context value from AppContext, which contains
  // the list of doctors.
  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality.toLowerCase() === speciality.toLowerCase() && doc._id !== docId);
      // The filter method is used to filter the doctors based on the selected speciality and exclude the current doctor using docId.
      setRelDoc(doctorsData);
      // The setRelDoc function is used to update the state with the filtered list of related
      // doctors.


    }

  }, [doctors, speciality, docId])
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {/* [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] The following class uses Tailwind v4's arbitrary property feature to set a custom grid-template-columns.
  This makes the grid automatically fill the row with as many 200px-wide cards as will fit, 
  and each card will expand to fill available space (minmax(200px, 1fr)).
*/}
        {relDoc.slice(0, 5).map((item, index) => (    /* This slice function allows only 10 doctors to be displayed */
          <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
            <img className='bg-blue-50' src={item.image} alt="" />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.availability ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.availability ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.availability ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>

          </div>
        ))}
      </div>
      <button onClick={() => { navigate('/Doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default RelatedDoctors
