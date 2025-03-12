import Image from "next/image";

const GoogleIcon = () => {
	return (
		<Image
			src="/google.svg"
			alt="google icon"
			className="w-5 h-5 mr-2"
			width={20}
			height={20}
		/>
	);
};

export default GoogleIcon;
