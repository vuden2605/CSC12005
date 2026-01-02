import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import "./style.scss";

export const Information = () => {
    const location = useLocation();
    
    const actionButtons = [
        {
            id: "info",
            label: "Thông tin cá nhân",
            color: "yellow",
            path: "/employee/dashboard/info/personal-info",
        },
        {
            id: "info-details",
            label: "Thông tin chi tiết",
            color: "gray",
            path: "/employee/dashboard/info/info-details",
        },
        {
            id: "salary",
            label: "Thông tin tài chính",
            color: "gray",
            path: "/employee/dashboard/info/salary-info",
        },
    ];
    
    const pathToTitleMap = {
        "/employee/dashboard/info/personal-info": "Thông tin cá nhân",
        "/employee/dashboard/info/info-details": "Thông tin cá nhân -> Thông tin chi tiết",
        "/employee/dashboard/info/salary-info": "Thông tin cá nhân -> Thông tin tài chính",
    };
    
    // Hàm check active với logic: nếu không match path nào thì mặc định tab đầu tiên active
    const isActive = (btn) => {
        const currentPath = location.pathname;
        
        // Kiểm tra xem path hiện tại có match với button nào không
        const hasExactMatch = actionButtons.some(b => currentPath === b.path);
        
        // Nếu không match path nào và đây là button đầu tiên (Thông tin cá nhân)
        if (!hasExactMatch && btn.id === "info") {
            return true;
        }
        
        // Ngược lại, check exact match
        return currentPath === btn.path;
    };
    
    return (
        <div className="information-page">
            
            {/* Tabs Section */}
            <h3 className="section-title">
                {pathToTitleMap[location.pathname] || "Thông tin cá nhân"}
            </h3>

            {/* Tabs + Content */}
            <div className="tabs-bar">
                {actionButtons.map((btn) => {
                    const active = isActive(btn);
                    const colorClass = active ? btn.color : "gray";
                    return (
                        <Link
                            key={btn.id}
                            to={btn.path}
                            className={`action-button ${colorClass} ${active ? "active" : ""}`}
                        >
                            {btn.label}
                        </Link>
                    );
                })}
            </div>

            <div className="content-section">
                <div className="main-content">
                    <div className="content-placeholder">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};