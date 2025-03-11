import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config';
import { userModel } from '../db/db';

declare module 'express'{
	export interface Request{
		userId?: string; 
	}
}

export async function userMiddleware(req: Request, res: Response, next: NextFunction){
	const token = req.headers.authorization;
	if(!token){
		res.status(400).json({
			msg: 'no token provided'
		})
		return
	}
	const validate = await jwt.verify(token, JWT_SECRET) as JwtPayload;
	if(!validate){
		res.status(400).json({
			msg: "invalid token"
		})
		return
	}
	try{
		const userDetails = await userModel.findOne({mobile: validate.mobile})
		if(!userDetails){
			res.status(400).json({
				msg: "user not found"
			})
			return
		}
		req.userId = userDetails._id.toString();
		next();
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
}