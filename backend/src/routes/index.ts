import express, { Request, Response } from 'express';
import { userRouter } from './users';
import { signinSchema, signupSchema } from '../types';
import { accountModel, userModel } from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { accountRouter } from './account';

export const router = express.Router();


router.post("/signin", async (req: Request, res: Response)=> {
	const parsedData = signinSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "Invalid credentials"
		})
		return
	}
	try{
	const user = await userModel.findOne({
		email: parsedData?.data.email,
		mobile: parsedData?.data.mobile
	})
	if(!user || !user.password){
		res.status(400).json({
			msg: "user does not exist"
		})
		return
	}
	
	const isCorrectPass = await bcrypt.compare(parsedData.data.password, user.password);
	if(!isCorrectPass){
		res.status(400).json({
			msg: "password incorrect"
		})
		return
	}
	
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


router.post("/signup", async (req: Request, res: Response)=> {
	const parsedData = signupSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "please provide all the credentials"
		})
		return
	}
	const existUser = await userModel.findOne({mobile: parsedData.data.mobile, email: parsedData.data.email})
	if(existUser){
		res.status(500).json({
			msg: "user already exist please go to signin page"
		})
	}

	const hashedPass = await bcrypt.hash(parsedData.data.password, 5);

	try{
		const user = await userModel.create({
			username: parsedData.data.username,
			email: parsedData.data.email,
			password: hashedPass,
			firstname: parsedData.data.firstname,
			lastname: parsedData.data.lastname,
			mobile: parsedData.data.mobile
		})

		const amount = Math.floor(Math.random() * (10000-1)) + 1;

		await accountModel.create({
			userId: user._id,
			balance: amount
		})

		res.status(200).json({
			msg: "successfully signed up",
			balance: amount
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})


router.use("/users", userRouter);
router.use("/account", accountRouter);