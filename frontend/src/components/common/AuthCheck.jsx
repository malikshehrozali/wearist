
import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { toast } from 'sonner'

const AuthCheck = ({ isAuthenticated, children, user }) => {
    const location = useLocation()
    if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
        toast.error("Please login first");
        return <Navigate to={`/auth/login`} />;
    }
    if (isAuthenticated && location.pathname.startsWith("/auth")) {
        if (user?.isAdmin) {
            toast("Welcome Admin");
            return <Navigate to={`/admin/dashboard`} />
        } else {
            toast("Welcome!");
            return <Navigate to={`/shop/home`} />;
        }
    }
    if (isAuthenticated && location.pathname.startsWith("/admin") && !user?.isAdmin) {
        toast("You are not authorized as admin");
        return <Navigate to={`/shop/home`} />;
    }
    return <>{children}</>
}

export default AuthCheck