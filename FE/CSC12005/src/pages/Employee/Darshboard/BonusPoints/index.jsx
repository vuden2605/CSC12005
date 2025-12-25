import React from "react";
import "./style.scss";

export const BonusPoints = () => {
  return (
    <div className="bonus-points-section">
      <div className="bonus-points-container">
        <h2>Điểm Thưởng</h2>
        <div className="bonus-points-content">
          <div className="bonus-stats">
            <div className="stat-card">
              <span className="stat-label">Điểm thưởng hiện tại</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Điểm thưởng tháng này</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Tổng điểm thưởng năm nay</span>
              <span className="stat-value">0</span>
            </div>
          </div>

          <div className="bonus-history">
            <h3>Lịch sử Điểm Thưởng</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Điểm</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="empty-message">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
