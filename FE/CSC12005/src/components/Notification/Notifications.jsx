import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification, markAsRead } from "../../redux/slices/notificationSlice";
import { NotificationService } from "../../services/NotificationService";
import "./notifications.scss";

export const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside để đóng dropdown
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = async (pageNumber = 0) => {  
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(pageNumber, 5, "createdAt", "DESC");
      if (data.length < 5) setHasMore(false);

      data.forEach((n) => {
        const exists = notifications.find((notif) => notif.id === n.id);
        if (!exists) {
          dispatch(addNotification({
            id: n.id,
            type: n.type,
            content: n.content,
            read: n.read,
            timestamp: n.createdAt,
          }));
        }
      });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load page đầu khi mở dropdown
  useEffect(() => {
    if (!open) return;
    setPage(0);
    setHasMore(true);
    fetchNotifications(0);
  }, [open]);

  const handleNotificationClick = (id) => {
    NotificationService.markAsRead(id, dispatch);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchNotifications(nextPage);
    setPage(nextPage);
  };

  return (
    <div className="notifications-wrapper" ref={dropdownRef}>
      <button
        className="icon-button notification-button"
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notifications-dropdown">
          {loading && <div className="loading">Đang tải...</div>}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.read ? "read" : "unread"} ${
                n.type === "broadcast" ? "broadcast" : "personal"
              }`}
              onClick={() => handleNotificationClick(n.id)}
            >
              <div className="notification-type">{n.type === "broadcast" ? "📢" : "📩"}</div>
              <div className="notification-content">{n.content}</div>
              <div className="notification-time">
                  {new Date(n.timestamp).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))}

          {!loading && notifications.length === 0 && (
            <div className="no-notifications">Không có thông báo</div>
          )}

          {hasMore && !loading && (
            <button className="load-more-button" onClick={handleLoadMore}>
              Xem thêm
            </button>
          )}
        </div>
      )}
    </div>
  );
};
