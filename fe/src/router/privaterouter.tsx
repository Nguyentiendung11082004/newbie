import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';
const PrivateRouter = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector((state) => state);
    if (user.user.userInfo) {
        return children; 
    } else {
        return <Navigate to="/login" />;
    }
}

export default PrivateRouter;

