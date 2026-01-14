import React from "react";
import "./style.scss";

const CEOActivityDetailTab = () => {
  return (
    <div className="ceo-tab-card">
      <h2 className="ceo-tab-title">Xem chi tiết hoạt động</h2>
      <p className="ceo-empty-text" style={{ paddingTop: 0 }}>
        Vui lòng chọn một hoạt động từ tab <strong>"Xem hoạt động của cty"</strong> để xem
        nội dung chi tiết.
      </p>
    </div>
  );
};

export default CEOActivityDetailTab;

