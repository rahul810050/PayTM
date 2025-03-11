import express from 'express'
import { router } from './routes';
import mongoose from 'mongoose';
import { MONGODB_URL, PORT } from './config';

const app = express();

app.use(express.json())

app.use("/api/v1", router);

async function main(){
	try{
		// console.log(MONGODB_URL)
		await mongoose.connect(MONGODB_URL)

		app.listen(PORT, ()=> {
			console.log("server is runnig on port 3000");
		})
	} catch(e){
		throw new Error(`${e}`);
	}
}

main()