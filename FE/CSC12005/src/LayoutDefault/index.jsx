import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const LayoutDefault = () => {
  return (
    <div className="layout-default">
      <Header />
      <main>
        <Outlet />  {/* <--- Route con sẽ hiển thị ở đây */}
      </main>
      <Footer />
    </div>
  );
};
