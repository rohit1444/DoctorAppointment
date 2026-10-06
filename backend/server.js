import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';


//app config

const app = express(); // create express app
const port = process.env.PORT || 4000; // set port from environment variable or default to 4000
connectDB(); // connect to MongoDB database
connectCloudinary(); // connect to Cloudinary for image storage

//middleware
app.use(express.json()); // parse incoming JSON requests
app.use(cors()); // enable CORS for all routes

//api endpoints
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/', (req, res) => { // root endpoint
  res.send('API WORKING'); // send a response
});

app.listen(port, () => console.log("server started",port)) // start the server and listen on the specified port
