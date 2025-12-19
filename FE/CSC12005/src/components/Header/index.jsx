import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux";
import { AuthService } from "../../services/AuthService";

export const Header = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  console.log("role", user.role);
  const role = user?.position?.role?.toUpperCase();
  const menuItems = {
    ADMIN: [{ label: "Trang tổng quan", path: "/admin/dashboard" }],
    EMP: [{ label: "Trang tổng quan", path: "/employee/dashboard" }],
    HRM: [
      { label: "Trang tổng quan", path: "/employee/dashboard" },
      { label: "Quản lý Sự kiện", path: "/hr/events" },
      { label: "Nhân viên/ Ứng viên", path: "/hr/humans" },
    ],
    MN: [
      { label: "Trang tổng quan", path: "/employee/dashboard" },
      { label: "Quản lý yêu cầu", path: "employee/manager/requests" },
      { label: "Quản lý phòng ban", path: "/manager/department" },
    ],
  };

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("persist:root");
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const isActiveMenu = (menuPath) => {
    if (menuPath === "/" && location.pathname === "/") return true;
    return location.pathname.startsWith(menuPath);
  };

  return (
    <header className="header">
      <nav className="header-nav">
        {menuItems[role]?.map((item) => {
          const isActive = isActiveMenu(item.path);
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
        <button className="icon-button notification-button">
          <Bell size={20} />
          <span className="notification-badge">5</span>
        </button>

        <div className="avatar-wrapper" ref={dropdownRef}>
          <button
            className="icon-button profile-button"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <div className="avatar">
                <User size={20} />
              </div>
              <div className="UserName">{user.fullName}</div>
            </div>
          </button>

          {openDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={logout}>
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
