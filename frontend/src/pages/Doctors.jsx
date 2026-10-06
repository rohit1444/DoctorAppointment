import React, { use, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
// The useParams hook is used to access the URL parameters in React Router.
import { useNavigate } from 'react-router-dom';
// The useNavigate hook is used to programmatically navigate to different routes in the application.

const Doctors = () => {
  const navigate = useNavigate();
  // The useNavigate hook is used to programmatically navigate to different routes in the application.
  const { speciality } = useParams();
  // The useParams hook is used to access the URL parameters, in this case, the `speciality` parameter from the URL.
  // This allows us to dynamically render content based on the selected speciality.
  //console.log(speciality);
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  // The useContext hook is used to access the context value from AppContext, which contains the list of doctors.
  // The filterDoc state is initialized to an empty array, which will be used to store
  // the filtered list of doctors based on the selected speciality.
  // The useState hook is used to manage the state of the filtered doctors.
  const [showFilter, setShowFilter] = useState(false);
  // The showFilter state is used to toggle the visibility of the filter options.
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality.toLowerCase() === speciality.toLowerCase()));
      // The applyFilter function filters the list of doctors based on the selected speciality.
    } else {
      setFilterDoc(doctors);
      // If no speciality is selected, it sets the filterDoc state to the entire list of doctors.
    }
  }
  useEffect(() => {
    applyFilter();
    // The useEffect hook is used to apply the filter whenever the Doctors list or speciality changes.
    // It calls the applyFilter function to update the filterDoc state with the filtered list of doctors.
  }, [doctors, speciality]);
  // The useEffect hook is used to apply the filter whenever the Doctors list or speciality changes
  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/* The following button is used to toggle the visibility of the filter options on smaller screens. */}
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6FFF] text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/Doctors') : navigate('/Doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/Doctors') : navigate('/Doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/Doctors') : navigate('/Doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/Doctors') : navigate('/Doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/Doctors') : navigate('/Doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/Doctors') : navigate('/Doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.availability ? 'text-green-500' : 'text-gray-500'}`}>
                    <p className={`w-2 h-2 ${item.availability ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.availability ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
