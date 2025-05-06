import { Navigate } from 'react-router-dom';
import LayoutDashboard from '../layout';
import { useAppSelector } from '../redux/hook';
import { JSX } from 'react';
const PrivateRouter = ({ children }: { children: JSX.Element }) => {
    const user = useAppSelector((state) => state);
    if (user.user.userInfo) {
        return children; 
    } else {
        return <Navigate to="/login" />;
    }
}

export default PrivateRouter;

