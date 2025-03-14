
interface IButton{
	classname?: string;
	text: string;
	onClick?: ()=> void;
}

export default function Button(props: IButton){
	return (
		<button className={`p-2 cursor-pointer rounded-md border-none ${props.classname}`} onClick={props.onClick}>{props.text}</button>
	)
}