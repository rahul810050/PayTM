import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	mobile: Number
})




const userModel = mongoose.model('users', userSchema);


export  {
	userModel
}