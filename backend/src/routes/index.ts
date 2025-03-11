import express from 'express';
import { userRouter } from './users';
import { signinSchema, signupSchema } from '../types';
import { userModel } from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const router = express.Router();


router.post("/signin", async (req, res)=> {
	const parsedData = signinSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "Invalid credentials"
		})
		return
	}
	const user = await userModel.findOne({
		mobile: parsedData.data.mobile,
	})
	if(!user){
		res.status(400).json({
			msg: "user does not exist"
		})
		return
	}
	const isCorrectPass = await bcrypt.compare(parsedData.data.password, user.password!);

	if(!isCorrectPass){
		res.status(400).json({
			msg: "password incorrect"
		})
		return
	}

	try{
		const token = await jwt.sign({mobile: user.mobile,  username: user.username}, JWT_SECRET);
		res.status(200).json({
			token
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})




router.post("/signup", async (req, res)=> {
	const parsedData = signupSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "please provide all the credentials"
		})
		return
	}

	const hashedPass = await bcrypt.hash(parsedData.data.password, 5);

	try{
		await userModel.create({
			username: parsedData.data.username,
			password: parsedData.data.password,
			firstname: parsedData.data.firstname,
			lastname: parsedData.data.lastname,
			mobile: parsedData.data.mobile
		})
		res.status(200).json({
			msg: "successfully signed up"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

router.use("/users", userRouter);