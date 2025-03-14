import express, { Request, Response } from 'express';
import { metadataSchema, userdataSchema } from '../types';
import { userMiddleware } from '../middleware/userMiddleware';
import { userModel } from '../db/db';
import bcrypt from 'bcrypt'

export const userRouter = express.Router();

userRouter.put("/metadata",userMiddleware, async (req: Request, res: Response)=> {
	const parsedData = metadataSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "please provide all the credentials"
		})
		return
	}
	const userId = req.userId;
	try{
		const user = await userModel.findOne({_id: userId});
		if(!user){
			res.status(400).json({
				msg: "user not found"
			})
			return
		}
		if(parsedData.data.firstname){
			user.firstname = parsedData.data.firstname;
		}
		if(parsedData.data.lastname){
			user.lastname = parsedData.data.lastname;
		}
		if(parsedData.data.password){
			const hashedPass = await bcrypt.hash(parsedData.data.password, 5);
			user.password = hashedPass;
		}
		await user.save();

		res.status(200).json({
			msg: "user data updated successfully"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

userRouter.get("/bulk", userMiddleware,async (req: Request, res: Response)=> {
	// const filter = req.query.filter || "";
	// console.log(filter)
	const userId = req.userId;
	try{
	// 	const users = await userModel.find({
	// 		$or: [{
	// 				firstName: {
	// 						"$regex": filter
	// 				}
	// 		}, {
	// 				lastName: {
	// 						"$regex": filter
	// 				}
	// 		}]
	// })

	const bulkUsers = await userModel.find({});
	const users = bulkUsers.filter(x => x._id.toString() !== userId);

		if(!users){
			res.status(403).json({
				msg: "no user found"
			})
			return
		}
		res.json({
			user: users.map(user => ({
					username: user.username,
					firstname: user.firstname,
					lastname: user.lastname,
					_id: user._id
			}))
	})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

userRouter.get("/userdata", async(req: Request, res: Response)=> {
	const parsedData = userdataSchema.safeParse(req.query);
	if(!parsedData.success){
		res.status(400).json({
			msg: "no userId"
		})
		return
	}
	console.log(parsedData.data.userId)
	try{
		const user = await userModel.findOne({
			_id: parsedData.data.userId
		})
		if(!user){
			res.status(400).json({
				msg: "user does not exist with this userId"
			})
			return
		}
		res.status(200).json({
			user: user
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

userRouter.get("/metadata", userMiddleware, async(req: Request, res: Response)=> {
	const userId = req.userId;
	if(!userId){
		res.status(400).json({
			msg: "no userId"
		})
		return
	}
	try{
		const user = await userModel.findOne({
			_id: userId
		})
		if(!user){
			res.status(400).json({
				msg: "user does not exist with this userId"
			})
			return
		}
		res.status(200).json({
			user: user
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

