import './style.scss';
import { Outlet } from 'react-router-dom';
export const Employee = () => {
  return (
    <div className="employee-page">
      <Outlet />
    </div>
  );
};

