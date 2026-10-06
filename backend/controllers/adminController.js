import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken' //for admin login
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


//API for adding doctor
const addDoctor = async(req,res) => {



    try{
        const {name,email,password,speciality,degree,experience, about,fees ,address} =req.body
        const imageFile=req.file
       // console.log({name,email,password,speciality,degree,experience, about,fees ,address},imageFile) this line was executed just to check in postman

       //checking for all data to add doctor
       if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
       {
        return res.json({success:false,message:"Missing Details"})
       }
       //validating email format
       if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid E-mail"})
       }

       //validating strong password
       if(password.length < 8){
         return res.json({success:false,message:"Please enter a strong password"})
       }
       //hashing doctor password i.e encrypting this password and save it in our database for this we use the bycrypt package
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt)

       //upload image to cloudinary
       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
       const imageUrl = imageUpload.secure_url

       //now save these data in our database
       const doctorData = {
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address), //convert string to object
        date:Date.now()
       }

       const newDoctor = new doctorModel(doctorData)
       await newDoctor.save()

       res.json({success:true,message:"Doctor Added"})



    } catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//API for admin login
const loginAdmin = async (req,res) => {
    try{
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})


        } else{
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req,res) => {
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    } catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//API to get all appointments list
const appointmentsAdmin = async (req,res) => {
    try {
        const appointments = await appointmentModel.find({}) //since empty object {} this will provide all the appointments from all the doctors
    res.json({success:true,appointments})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

//API for appointment cancelling directly from admin panel AllAppointments page
//API to cancel appointment this is copied from userController.js file then modified
const appointmentcancel = async (req,res) => {
    try {
        
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        
         
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctors slot on the appointment being cancelled
        const {docId,slotData,slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotData] = slots_booked[slotData].filter(e => e!== slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"appointment cancelled"})

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
} 

//API to get dashboard data for admin panel , we have to display the total number of doctors and number of appointments
const adminDashboard = async (req,res) => {
    try {
        //we need total number of users and total number of appointments and we will fetch the latest five appointments
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }
}

export {addDoctor,loginAdmin,allDoctors, appointmentsAdmin,appointmentcancel, adminDashboard }