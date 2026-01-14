import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux";
import { AuthService } from "../../services/AuthService";
import { stompService } from "../../services/StompService";
import { Notifications } from "../Notification/Notifications";
import { NotificationService } from "../../services/NotificationService";
import {
  addNotifications,
  clearNotifications,
  setUnreadCount,
} from "../../redux/slices/notificationSlice";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.currentUser);
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const role = user?.position?.role?.toUpperCase();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const hasFetchedRef = useRef(false);

  const menuItems = {
    ADMIN: [{ label: "Trang tổng quan", path: "/admin/dashboard" }],
    EMP: [{ label: "Trang tổng quan", path: "/employee/dashboard" }],
    HRM: [
      { label: "Trang tổng quan", path: "/employee/dashboard" },
      { label: "Đánh giá ứng viên", path: "/manager/candidates" },
      { label: "Quản lý yêu cầu", path: "/manager/requests" },

      { label: "Quản lý phòng ban", path: "/manager/department" },

      { label: "Quản lý Sự kiện", path: "/hr/events" },
      { label: "Quản lý yêu cầu", path: "/manager/requests" },
      { label: "Quản lý Lương", path: "/hr/payroll" },
      { label: "Nhân viên", path: "/hr/humans" },
      { label: "Ứng viên", path: "/hr/candidates" },

      { label: "Quản lý điểm", path: "/hr/bonus-points" },
    ],
    MN: [
      { label: "Trang tổng quan", path: "/employee/dashboard" },
      { label: "Đánh giá ứng viên", path: "/manager/candidates" },
      { label: "Quản lý yêu cầu", path: "/manager/requests" },
      // { label: "Quản lý dự án", path: "/manager/projects" },
      { label: "Quản lý phòng ban", path: "/manager/department" },
    ],
  };

  // Fetch unread count và initial notifications
  useEffect(() => {
    const fetchInitialData = async () => {
      // Chỉ fetch một lần duy nhất
      if (hasFetchedRef.current) {
        return;
      }
      hasFetchedRef.current = true;

      try {
        // Fetch unread count từ API
        const count = await NotificationService.unreadCount();
        if (count !== undefined && count !== null) {
          dispatch(setUnreadCount(count));
        }

        // Fetch initial notifications
        const response = await NotificationService.getNotifications(
          0,
          5,
          "createdAt",
          "DESC"
        );

        const data = response?.data?.content || response?.content || response;

        if (Array.isArray(data) && data.length > 0) {
          // Map data sang format của Redux
          const formattedNotifications = data.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            content: n.content,
            read: n.isRead,
            timestamp: n.createdAt,
            referenceId: n.referenceId,
          }));

          // Dispatch addNotifications (không tăng unreadCount)
          dispatch(addNotifications(formattedNotifications));
        }
      } catch (error) {
        console.error("Fetch initial data failed:", error);
      }
    };

    fetchInitialData();
  }, [dispatch]); // Chỉ chạy một lần khi component mount

  // Click outside avatar dropdown
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
      dispatch(clearNotifications());
      stompService.disconnect();
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
        {menuItems[role]?.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={isActiveMenu(item.path) ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-right">
        <Notifications unreadCount={unreadCount} />

        <div className="avatar-wrapper" ref={dropdownRef}>
          <button
            className="icon-button profile-button"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <div className="avatar">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="UserName">{user?.fullName}</div>
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
