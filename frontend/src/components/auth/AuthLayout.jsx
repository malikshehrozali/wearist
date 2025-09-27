import { ShoppingCart } from "lucide-react"; // if you use lucide-react
import { Outlet } from "react-router-dom";

const CartAnimation = () => {
    return (
        <div className="flex items-center gap-5 flex-col justify-center h-full ">
            <ShoppingCart className="w-20 h-20 text-white animate-wiggle" />
            <h2 className="text-5xl text-white text-center"> <strong>Wearist!</strong> Your Clothing Partner</h2>
        </div>
    );
};

const AuthLayout = () => {
    return (
        <div className='flex justify-center items-center h-screen w-full'>
            <div className='w-1/2 lg:flex items-center justify-center h-screen bg-yellow-original rounded-r-2xl hidden '><CartAnimation /></div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout