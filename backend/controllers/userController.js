//here we will create the api logic for the user
//like login, register,get profile, update profile,book appointmnet, display booked appointments and cancelling the appointmnet and payment gateway

import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'

//api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing details" })
        }
        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })

        }
        //validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        //save userData in database
        const newUser = new userModel(userData) //new user created
        //save new user in database
        const user = await newUser.save()
        // _id
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user doesnot exist" })

        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to get user profiles data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to update userprofile

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data missing" })

        }
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        if(imageFile){
            //upload image to cloudindary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            //save imageURL in user data
            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"Profile updated"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to book appointment
const bookAppointment = async (req,res) => {
    try {
        const userId = req.userId;
        const {docId,slotDate,slotTime} = req.body;

        const docData = await doctorModel.findById(docId).select('-password')

        //check if doctor is available or not to take the bookings
        if(!docData.availability)
        {
            return res.json({success:false,message:'Doctor not available'})

        }
        let slots_booked = docData.slots_booked

        //checking for slots avalability
        if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:'slots not available'})

        } else {
            slots_booked[slotDate].push(slotTime)
        }
    } else {
        slots_booked[slotDate] = []
        slots_booked[slotDate].push(slotTime)
    }
    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotData:slotDate,
        date:Date.now()
    }
//save this data in the database
    const newAppointment =  new appointmentModel(appointmentData)
    await newAppointment.save()

    //save new slots data in docData

    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:"appointment booked"})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

// API to get user appointments for frontend myAppointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API to cancel appointment
const cancelAppointment = async (req,res) => {
    try {
        const userId = req.userId; // get from auth middleware
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        
        //verify appointment user if appointmentData user is same as the cancelling user
        if (appointmentData.userId !== userId) {
            return res.json({success:false, message:"unauthorized action"})
            
        } 
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

//APi to make payment of appointment using razorpay

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

const paymentRazorpay = async (req,res) => {


    try {
        const {appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if(!appointmentData || appointmentData.cancelled)
    {
        return res.json ({success:false,message:"Appointment canclled or not found"})
    }
    //Creating options for razorpay payment
    const options = {
        amount: appointmentData.amount * 100,
        currency:process.env.CURRENCY,
        receipt:appointmentId
    }
    // creation of an order
    const order = await razorpayInstance.orders.create(options)
    res.json({success:true,order})

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }

    
}
//API to verify payment of razorpay
const verifyRazorpay = async(req,res) => {
    try {
        const {razorpay_order_id} =req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        //console.log(orderInfo)
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"payment successfull"})

        } else {
            res.json({success:false,message:"Payment failed"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment,listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay }