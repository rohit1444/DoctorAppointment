import { createContext, useEffect, useState } from 'react';
// This file creates a context for the application, which can be used to share state and functions across components without prop drilling.
// The createContext function is imported from React, which allows us to create a context object.
// The AppContext will be used to provide global state or functions that can be accessed by any component within the AppContext.Provider.
import axios from 'axios'
import {toast} from 'react-toastify'
export const AppContext = createContext();
// The AppContext is created using React's createContext function, which allows components to subscribe to context changes.
// This context can be used to provide global state or functions that can be accessed by any component within the AppContext.Provider.
const AppContextProvider = (props) => {
    // This is the provider component that will wrap around the components that need access to the context.
    // It will provide the context value to all child components that are wrapped inside this provider.

    const currencySymbol = '₹'; // Define a currency symbol to be used in the application, e.g., for displaying prices or fees.
    // this currency symbol is displayed in all the components that consume this context, such as in the appointment fees or any other monetary values.
    // if we want to change the currency symbol, we can simply update this variable, and it will reflect across all components that use this context.
    
    //now we have to get our backend URL from our environment variable
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    //to save data in a state variable
    const [doctors,setDoctors] = useState([])
    //to save token for userLogin and not logout on refreshing the webpage
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)


    // API to get profile and update profile with frontend
    const [userData, setUserData] = useState(false)


    

        //arrow function to call API
        const getDoctorsData = async () => {
            try {
                const {data} = await axios.get(backendUrl + '/api/doctor/list')
                if(data.success){
                    setDoctors(data.doctors)

                } else{
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
                
            }
    }
    const loadUserProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success)
            {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
                toast.error(error.message)
            
        }
    }
    const value = {
        // Define any state or functions that you want to share across components here
        // For example, you can add user information, theme settings, etc.
        doctors , 
        getDoctorsData,
        currencySymbol,
        // The value object contains the doctors array and the currencySymbol, which can be accessed by
        // any component that consumes this context.
        // The doctors array is imported from the assets folder and contains a list of doctor objects.
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData
        }
    useEffect (() => {
        getDoctorsData()
    })
     useEffect (() => {
        if(token){
            loadUserProfileData()
        } else{
            setUserData(false)
        }
    },[token])
    return(
        <AppContext.Provider value={value} >
            {/* This is the provider component that will wrap around the components that need access to the context */}
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;
// The AppContextProvider component wraps its children with the AppContext.Provider, passing the value object as the context value.
// This allows any component within the AppContext.Provider to access the context value using the useContext hook or the AppContext.Consumer component.
// The value object can contain any state or functions that you want to share across components, such as user information, theme settings, etc.
// The AppContextProvider component is exported as the default export of this module, allowing it to be imported and used in other parts of the application.
// Components that need access to the context can use the useContext hook to consume the context value.