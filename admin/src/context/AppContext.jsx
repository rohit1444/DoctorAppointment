import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    //currency to show fees in allAppointments page 
    const currency = '₹'
    //to calculate age of patient using his/her dob
    const calculateAge = (dob) => {
        const today = new Date()
        const birthdate = new Date(dob)

        let age = today.getFullYear() - birthdate.getFullYear()
        return age
    }
     // to show the date in a more better format like 26 July 2025
 const months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

 const slotDateFormat = (slotDate) => {
  const dateArray = slotDate.split(' ');
  return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
};
    const value = {
        calculateAge,
        slotDateFormat,
        currency

    }
    return(
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider