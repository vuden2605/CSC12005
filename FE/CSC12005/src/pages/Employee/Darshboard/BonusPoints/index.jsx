import React, { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { EmployeeService } from "../../../../services/EmployeeService";

export const BonusPoints = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState({ sortBy: "createdAt", direction: "DESC" });

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await EmployeeService.getMyPointHistories({
          page: 0,
          size: 200,
          sortBy: "createdAt",
          direction: "DESC",
        });

        // API trả về có thể ở data.data hoặc data.content, fallback mảng trực tiếp
        const content = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];

        setHistories(content);
      } catch (err) {
        setError(err.message || "Không thể tải lịch sử điểm");
        setHistories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const toggleSort = (column) => {
    setSort((prev) => {
      const isSame = prev.sortBy === column;
      const nextDirection = isSame && prev.direction === "ASC" ? "DESC" : "ASC";
      return { sortBy: column, direction: nextDirection };
    });
  };

  const getSortIcon = (column) => {
    if (sort.sortBy !== column) return "⇅";
    return sort.direction === "ASC" ? "↑" : "↓";
  };

  const stats = useMemo(() => {
    if (!histories.length) {
      return {
        current: 0,
        thisMonth: 0,
        thisYear: 0,
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let current = 0;
    let thisMonth = 0;
    let thisYear = 0;

    histories.forEach((item) => {
      const change = Number(item.pointChange) || 0;
      current += change;

      if (item.createdAt) {
        const d = new Date(item.createdAt);
        if (!isNaN(d)) {
          if (d.getFullYear() === currentYear) {
            thisYear += change;
            if (d.getMonth() === currentMonth) {
              thisMonth += change;
            }
          }
        }
      }
    });

    return { current, thisMonth, thisYear };
  }, [histories]);

  const sortedHistories = useMemo(() => {
    if (!histories.length) return [];
    const copy = [...histories];

    copy.sort((a, b) => {
      const dir = sort.direction === "ASC" ? 1 : -1;

      if (sort.sortBy === "pointChange") {
        return ((Number(a.pointChange) || 0) - (Number(b.pointChange) || 0)) * dir;
      }

      // default createdAt
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return (da - db) * dir;
    });

    return copy;
  }, [histories, sort]);

  return (
    <div className="bonus-points-section">
      <div className="bonus-points-container">
        <h2>Điểm Thưởng</h2>
        <div className="bonus-points-content">
          <div className="bonus-stats">
            <div className="stat-card">
              <span className="stat-label">Điểm thưởng hiện tại</span>
              <span className="stat-value">{stats.current}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Điểm thưởng tháng này</span>
              <span className="stat-value">{stats.thisMonth}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Tổng điểm thưởng năm nay</span>
              <span className="stat-value">{stats.thisYear}</span>
            </div>
          </div>

          <div className="bonus-history">
            <h3>Lịch sử Điểm Thưởng</h3>
            <div className="history-table">
              {error && <div className="error-message">{error}</div>}
              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th className="sortable" onClick={() => toggleSort("createdAt")}>
                        Ngày <span className="sort-icon">{getSortIcon("createdAt")}</span>
                      </th>
                      <th>Loại</th>
                      <th className="sortable" onClick={() => toggleSort("pointChange")}>
                        Điểm <span className="sort-icon">{getSortIcon("pointChange")}</span>
                      </th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHistories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-message">
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      sortedHistories.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </td>
                          <td>{item.reasonType || "N/A"}</td>
                          <td className={Number(item.pointChange) < 0 ? "negative" : "positive"}>
                            {Number(item.pointChange) || 0}
                          </td>
                          <td>{item.description || ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
