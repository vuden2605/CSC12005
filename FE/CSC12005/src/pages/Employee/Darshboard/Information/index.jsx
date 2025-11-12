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
            subPaths: [
                "/employee/dashboard/info/personal-info",
                "/employee/dashboard/info/info-details",
                "/employee/dashboard/info/salary-info",
            ],
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

    // Hàm check active dựa trên path (bao gồm subPaths nếu muốn highlight parent tab)
    const isActive = (btn) => location.pathname === btn.path;


    return (
        <div className="information-page">
            {/* Tabs Section */}
            <h3 className="section-title">
                {pathToTitleMap[location.pathname] || "Thông tin cá nhân"}
            </h3>

            {/* Content Section */}
            <div className="content-section">
                {/* Sidebar */}
                <div className="sidebar">
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


                {/* Main Content */}
                <div className="main-content">
                    <div className="content-placeholder">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
