import { toast } from 'sonner';
import { logoutUser } from '../../store/auth/authSlice';
import { Button } from '../ui/button';
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from 'react-redux';

const Header = ({ setOpen }) => {

    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser()).then((data) => {
            console.log(data);
            toast(data.payload.message);
        });
    }
    return (
        <div className="flex items-center justify-between px-8 py-3 bg-background border-b">
            <Button onClick={() => setOpen(true)} className="lg:hidden">
                <AlignJustify />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button
                    onClick={handleLogout}
                    className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
                >
                    <LogOut />
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default Header