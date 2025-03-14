import { forwardRef } from "react";


interface InputProps{
	label: string;
	placeholder: string;
	type: string;
	classname?: string 
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({label, placeholder, type, classname}, ref) => {
		return (
			<div>
				<label className={classname}>{label}</label>
				<input className="border-1 rounded w-full p-2 bg-white text-black " ref={ref} placeholder={placeholder} type={type} />
			</div>
		)
	}
)

export default Input