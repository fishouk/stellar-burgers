import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  if (!onlyUnAuth && !user.isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user.data) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user.data) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
