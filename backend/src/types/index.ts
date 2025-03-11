import z from 'zod';

export const signupSchema = z.object({
	username: z.string(),
	password: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	mobile: z.number().int(),
})

export const signinSchema = z.object({
	mobile: z.number(),
	password: z.string()
})