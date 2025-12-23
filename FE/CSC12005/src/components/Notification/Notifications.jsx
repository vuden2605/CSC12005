import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  FileText, 
  Clock, 
  DollarSign, 
  Star, 
  Activity 
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addNotifications, markAsRead, setUnreadCount } from "../../redux/slices/notificationSlice";
import { NotificationService } from "../../services/NotificationService";
import "./notifications.scss";

export const Notifications = ({ unreadCount: propUnreadCount }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  
  const notifications = useSelector((state) => state.notifications.list);
  const storeUnreadCount = useSelector((state) => state.notifications.unreadCount);

  const unreadCount = propUnreadCount !== undefined 
    ? propUnreadCount 
    : storeUnreadCount !== undefined 
    ? storeUnreadCount 
    : notifications.filter((n) => !n.read).length;

  // Map notification type to icon and color
  const getNotificationIcon = (type) => {
    const iconMap = {
      REQUEST: { icon: FileText, color: "#3b82f6", label: "Yêu cầu" },
      TIMESHEET: { icon: Clock, color: "#8b5cf6", label: "Chấm công" },
      SALARY: { icon: DollarSign, color: "#10b981", label: "Lương" },
      REVIEW: { icon: Star, color: "#f59e0b", label: "Đánh giá" },
      ACTIVITY: { icon: Activity, color: "#ef4444", label: "Hoạt động" },
    };

    return iconMap[type] || { icon: Bell, color: "#6b7280", label: "Thông báo" };
  };

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset pagination khi đóng dropdown
  useEffect(() => {
    if (!open) {
      setPage(0);
      setHasMore(true);
    }
  }, [open]);

  // Fetch thêm notification (pagination)
  const fetchNotifications = async (pageNumber) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await NotificationService.getNotifications(
        pageNumber,
        5,
        "createdAt",
        "DESC"
      );

      const data = response?.data?.content || response?.content || response;

      // Kiểm tra có còn dữ liệu không
      if (!Array.isArray(data) || data.length < 5) {
        setHasMore(false);
      }

      if (Array.isArray(data) && data.length > 0) {
        const existingIds = new Set(notifications.map(n => n.id));
        
        // Filter và format notifications mới
        const newNotifications = data
          .filter(n => !existingIds.has(n.id))
          .map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            content: n.content,
            read: n.isRead,
            timestamp: n.createdAt,
            referenceId: n.referenceId,
          }));

        if (newNotifications.length > 0) {
          // Dùng addNotifications thay vì addNotification
          dispatch(addNotifications(newNotifications));
        }
      }
    } catch (error) {
      console.error("Load more notifications failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const handleNotificationClick = async (id, isRead) => {
    try {
      // Nếu chưa đọc thì mới call API và update
      if (!isRead) {
        // Gọi API mark as read
        await NotificationService.markAsRead(id);
        
        // Dispatch action để update Redux
        dispatch(markAsRead(id));
      }
    } catch (error) {
      console.error("Mark as read failed:", error);
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return notifTime.toLocaleDateString("vi-VN");
  };

  return (
    <div className="notifications-wrapper" ref={dropdownRef}>
      <button
        className="icon-button notification-button"
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} chưa đọc</span>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length > 0 ? (
              <>
                {notifications.map((n) => {
                  const { icon: IconComponent, color, label } = getNotificationIcon(n.type);
                  
                  return (
                    <div
                      key={n.id}
                      className={`notification-item ${n.read ? "read" : "unread"}`}
                      onClick={() => handleNotificationClick(n.id, n.read)}
                    >
                      <div 
                        className="notification-icon"
                        style={{ backgroundColor: `${color}15`, color: color }}
                      >
                        <IconComponent size={18} />
                      </div>
                      
                      <div className="notification-body">
                        <div className="notification-header">
                          <span className="notification-type-label">{label}</span>
                          <span className="notification-time">
                            {formatTimeAgo(n.timestamp)}
                          </span>
                        </div>
                        
                        {n.title && (
                          <div className="notification-title">{n.title}</div>
                        )}
                        
                        <div className="notification-content">{n.content}</div>
                      </div>
                      
                      {!n.read && <div className="unread-dot"></div>}
                    </div>
                  );
                })}

                {hasMore && !loading && (
                  <button className="load-more-button" onClick={handleLoadMore}>
                    Xem thêm
                  </button>
                )}

                {loading && (
                  <div className="loading">
                    <div className="spinner"></div>
                    <span>Đang tải...</span>
                  </div>
                )}
              </>
            ) : (
              !loading && (
                <div className="no-notifications">
                  <Bell size={48} />
                  <p>Không có thông báo</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};