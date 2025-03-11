import express, { Request, Response } from 'express';
import { metadataSchema } from '../types';
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

userRouter.get("/bulk", async (req: Request, res: Response)=> {
	const filter = req.query.filter || "";
	try{
		const users = await userModel.find({
			$or: [{
				firstname: {
					"$regex": filter,
					"$options": "i"
				},
				lastname: {
					"$regex": filter,
					"$options": "i"
				}
			}]
		})

		if(!users){
			res.status(403).json({
				msg: "no user found"
			})
			return
		}
		res.status(200).json({
			user: users.map(u=> ({
				username: u.username,
				firstname: u.firstname,
				lastname: u.lastname,
				id: u._id
			}))
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})