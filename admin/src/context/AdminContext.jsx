import { createContext , useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken,setAtoken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    
    const [doctors,setDoctors] = useState([])
    //state varibale to store appointments data
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const getAllDoctors = async() => {
        try {
            const {data} =await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers:{aToken}})
            console.log(data);
            
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    const changeAvailability = async (docId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability',{docId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            } else{
                toast.error(error.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    //to get all the booked appointments of all the doctors
    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}})
            if(data.success)
            {
                setAppointments(data.appointments)
                console.log(data.appointments);
                
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    // Link appointment cancellation Api from backend in admin panel to directly cancel appointment from admin panel AllAppointments page
    const cancelAppointment = async (appointmentId) => {
        try {
            //api call to cancel the appointment
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    //arrow function to get dashboard data from API
    const getDashData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}})
            console.log(data,aToken);
                if (data.success) {
                    setDashData(data.dashData)
                    console.log(data.dashData);
                    
                    
                } else {
                    toast.error(data.message)
                }

            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAtoken,
        backendUrl,doctors,
        getAllDoctors , changeAvailability,
        appointments,setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,getDashData
    }
    return(
        <AdminContext.Provider value={value}>
        {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider