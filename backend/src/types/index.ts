import z from 'zod';

export const signupSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	password: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	mobile: z.number().int(),
})

export const signinSchema = z.object({
	mobile: z.number().int().optional(),
	email: z.string().email().optional(),
	password: z.string()
})

export const metadataSchema = z.object({
	firstname:  z.string().optional(),
	lastname: z.string().optional(),
	password: z.string().optional()
})