import express, { Request, Response } from 'express'
import { userMiddleware } from '../middleware/userMiddleware'
import { accountModel } from '../db/db';
import { transferSchema } from '../types';
import mongoose from 'mongoose';

export const accountRouter = express.Router()

accountRouter.get("/balance", userMiddleware, async (req: Request, res: Response)=> {
	const userId = req.userId;
	if(!userId){
		res.status(403).json({
			msg: "no userid"
		})
		return
	}
	try{
		const account = await accountModel.findOne({userId: userId});
		if(!account || !account.balance){
			res.status(403).json({
				msg: "no balance"
			})
			return
		}
		res.status(200).json({
			balance: account?.balance
		})
	} catch(e){
		res.status(403).json({
			error: (e as Error).message
		})
	}
})


accountRouter.post("/transfer", userMiddleware, async (req: Request, res: Response)=> {
	const parsedData = transferSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "invalid credentials"
		})
		return
	}
	const userId = req.userId;
	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const userAccount = await accountModel.findOne({userId: userId}).session(session);
		if(!userAccount || !userAccount.balance){
			await session.abortTransaction();
			session.endSession();
			res.status(400).json({
				msg: "user has no account"
			})
			return
		}
		if(parsedData.data.amount > userAccount?.balance){
			await session.abortTransaction();
			session.endSession();
			res.status(400).json({
				msg: "insufficient balance"
			})
			return
		}
		const toUserAccount = await accountModel.findOne({userId: parsedData.data.to});
		if(!toUserAccount){
			await session.abortTransaction();
			session.endSession();
			res.status(400).json({
				msg: "user does not exist"
			})
			return
		}
		// we have to use transaction to prevent any type of data inconsistancy
		userAccount.balance -= parsedData.data.amount;
		toUserAccount.balance += parsedData.data.amount;
		await userAccount.save({session});
		await toUserAccount.save({session});

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			msg: "Transaction successful"
		})
	} catch(e){
		await session.abortTransaction();
		session.endSession();
		res.status(400).json({
			error: (e as Error).message
		})
	}
})