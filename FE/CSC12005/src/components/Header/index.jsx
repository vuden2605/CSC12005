import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import "./style.scss";

export const Header = () => {
  const location = useLocation();
  
  // Xác định role dựa vào URL
  const path = location.pathname.toLowerCase();
  let role = "GUEST";
  if (path.startsWith("/admin")) role = "ADMIN";
  else if (path.startsWith("/manager")) role = "MANAGER";
  else if (path.startsWith("/employee")) role = "EMPLOYEE";

  // Menu tương ứng với role
  const menuItems = {
    ADMIN: [
      { label: "Trang tổng quan", path: "/admin/dashboard" },
      { label: "Yêu cầu", path: "/admin/requests" },
      { label: "Sự kiện", path: "/admin/events" },
      { label: "Ứng viên", path: "/admin/candidates" },
    ],
    MANAGER: [
      { label: "Trang tổng quan", path: "/manager/dashboard" },
      { label: "Yêu cầu", path: "/manager/requests" },
      { label: "Sự kiện", path: "/manager/events" },
      { label: "Ứng viên", path: "/manager/candidates" },
    ],
    EMPLOYEE: [
      { label: "Trang tổng quan", path: "/employee/dashboard" },
      { label: "Yêu cầu", path: "/employee/requests" },
      { label: "Sự kiện", path: "/employee/events" },
      { label: "Ứng viên", path: "/employee/candidates" },
    ],
    GUEST: [
      { label: "Trang tổng quan", path: "/" },
      { label: "Yêu cầu", path: "/requests" },
      { label: "Sự kiện", path: "/events" },
      { label: "Ứng viên", path: "/candidates" },
    ],
  };

  return (
    <header className="header">
      <nav className="header-nav">
        {menuItems[role].map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={isActive ? "active" : ""}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="header-right">
        {/* <button className="icon-button language-button">
          <span className="flag">🇻🇳</span>
          <span className="lang-text">VN</span>
        </button> */}
        
        <button className="icon-button notification-button">
          <Bell size={20} />
          <span className="notification-badge">5</span>
        </button>

        <button className="icon-button profile-button">
          <div className="avatar">
            <User size={20} />
          </div>
        </button>
      </div>
    </header>
  );
};