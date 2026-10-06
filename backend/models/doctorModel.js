import mongoose from "mongoose";
import _default from "validator";

const doctorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, // by adding unique, we can create a doctor with unique email id
    password: {type: String, required: true}, 
    image: {type: String, required: true},
    speciality: {type: String, required: true},
    degree: {type: String, required: true},
    experience: {type: String, required: true},
    about: {type: String, required: true},
    availability: {type:Boolean, default: true}, // if false then user cannot book the appointment with that doctor
    fees: {type: Number, required: true},
    address: {type: Object, required: true},
    date: {type: Number, required: true}, // to know when this doctor profile was created
    slots_booked: {type:Object, default: {}}, // whenever doctor data is created the doctor data will be a empty object
},{minimize: false}) // false to use empty object as default value if true then we cannot create this data with empty object

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
/*mongoose.models.doctor:
Checks if a model named "doctor" already exists in Mongoose's internal models cache.
This prevents redefining the model if the file is imported multiple times (which would otherwise throw an error).

mongoose.model("doctor", doctorSchema):
If the model does not exist yet, this creates a new Mongoose model named "doctor" using the provided doctorSchema.

The || operator:
Returns the existing model if it exists, otherwise creates and returns a new one.*/

export default doctorModel;