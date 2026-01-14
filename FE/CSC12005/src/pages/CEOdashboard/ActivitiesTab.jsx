import React from "react";
import "./style.scss";
import CompanyActivityList from "./CompanyActivityList";

const CEOActivitiesTab = () => {
  return (
    <div className="ceo-tab-card">
      <h2 className="ceo-tab-title">Xem hoạt động của công ty</h2>
      <p className="ceo-empty-text" style={{ paddingTop: 0 }}>
        Chọn một hoạt động để xem chi tiết nội dung và mô tả trong tab{" "}
        <strong>Xem chi tiết hoạt động</strong>.
      </p>
      <CompanyActivityList />
    </div>
  );
};

export default CEOActivitiesTab;

