import React, { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { EmployeeService } from "../../../../services/EmployeeService";
import PointExchangeCreateModal from "../../../../components/modals/PointExchangeCreateModal";

export const BonusPoints = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState({ sortBy: "createdAt", direction: "DESC" });
  const [activeTab, setActiveTab] = useState("history");
  const [exchanges, setExchanges] = useState([]);
  const [loadingEx, setLoadingEx] = useState(false);
  const [errorEx, setErrorEx] = useState("");
  // Lọc trạng thái và ngày
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [reloadExKey, setReloadExKey] = useState(0);
  const [totals, setTotals] = useState({ current: 0, thisMonth: 0, thisYear: 0 });
  const [loadingTotals, setLoadingTotals] = useState(false);

  const REASON_LABELS = {
    MONTHLY_GRANT: "Cấp điểm hàng tháng",
    EXCHANGE: "Đổi điểm",
    ACTIVITY_BONUS: "Thưởng hoạt động",
    ACTIVITY_PENALTY: "Phạt hoạt động",
    ADMIN_ADJUSTMENT: "Điều chỉnh bởi quản trị",
  };

  const getReasonLabel = (reason) => {
    if (!reason) return "N/A";
    return REASON_LABELS[reason] || reason;
  };

  const STATUS_LABELS = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    COMPLETED: "Đã chuyển khoản",
    REJECTED: "Đã từ chối",
  };

  const getStatusLabel = (status) => STATUS_LABELS[status] || (status || "N/A");
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";
      case "APPROVED":
        return "approved";
      case "COMPLETED":
        return "completed";
      case "REJECTED":
        return "rejected";
      default:
        return "default";
    }
  };

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

  // Fetch totals (current points, received month, received year)
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoadingTotals(true);
        const [cur, mon, yr] = await Promise.all([
          EmployeeService.getMyTotalPoints(),
          EmployeeService.getMyTotalReceivedMonth(),
          EmployeeService.getMyTotalReceivedYear(),
        ]);
        const toNum = (v) => {
          if (typeof v === 'number') return v;
          // service returns response.data.data || response.data
          return Number(v) || 0;
        };
        setTotals({
          current: toNum(cur),
          thisMonth: toNum(mon),
          thisYear: toNum(yr),
        });
      } catch (e) {
        // giữ nguyên totals mặc định nếu lỗi
      } finally {
        setLoadingTotals(false);
      }
    };
    fetchTotals();
  }, []);

  // Fetch exchange requests khi filter thay đổi
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setLoadingEx(true);
        setErrorEx("");
        const params = {
          page: 0,
          size: 100,
          sortBy: "requestedAt",
          direction: "DESC",
        };
        if (filterStatus) params.status = filterStatus;
        // Đảm bảo định dạng ngày là yyyy-MM-ddTHH:mm:ss nếu chỉ có yyyy-MM-dd
        const toIsoDateTime = (d, isEnd) => {
          if (!d) return d;
          // Nếu đã có T thì giữ nguyên
          if (d.includes('T')) return d;
          // Nếu là ngày bắt đầu, set 00:00:00, nếu là ngày kết thúc, set 23:59:59
          return isEnd ? `${d}T23:59:59` : `${d}T00:00:00`;
        };
        if (filterStart) params.startDate = toIsoDateTime(filterStart, false);
        if (filterEnd) params.endDate = toIsoDateTime(filterEnd, true);
        const data = await EmployeeService.getMyPointExchangeRequests(params);
        const content = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        setExchanges(content);
      } catch (err) {
        setErrorEx(err.message || "Không thể tải yêu cầu đổi điểm");
        setExchanges([]);
      } finally {
        setLoadingEx(false);
      }
    };
    fetchExchanges();
  }, [filterStatus, filterStart, filterEnd, reloadExKey]);

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
              <span className="stat-value">{totals.current}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Điểm thưởng tháng này</span>
              <span className="stat-value">{totals.thisMonth}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Tổng điểm thưởng năm nay</span>
              <span className="stat-value">{totals.thisYear}</span>
            </div>
          </div>

          <div className="tabs" style={{ marginTop: "16px" }}>
            <button
              onClick={() => setActiveTab("history")}
              className={activeTab === "history" ? "tab active" : "tab"}
              style={{ padding: "8px 12px", marginRight: "8px" }}
            >
              Lịch sử điểm
            </button>
            <button
              onClick={() => setActiveTab("exchange")}
              className={activeTab === "exchange" ? "tab active" : "tab"}
              style={{ padding: "8px 12px" }}
            >
              Yêu cầu đổi điểm
            </button>
          </div>

          {activeTab === "history" ? (
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
                            <td>{getReasonLabel(item.reasonType)}</td>
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
          ) : (
            <div className="exchange-requests">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Yêu Cầu Đổi Điểm</h3>
                <button
                  className="create-exchange-btn"
                  onClick={() => setOpenCreateModal(true)}
                  style={{
                    background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
                >
                  + Tạo yêu cầu đổi điểm
                </button>
              </div>
              <PointExchangeCreateModal
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={() => setReloadExKey((k) => k + 1)}
              />
              <div className="filters">
                <div>
                  <label style={{ fontSize: 13, marginRight: 6 }}>Trạng thái:</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="COMPLETED">Đã chuyển khoản</option>
                    <option value="REJECTED">Đã từ chối</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, marginRight: 6 }}>Từ ngày:</label>
                  <input type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 13, marginRight: 6 }}>Đến ngày:</label>
                  <input type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} />
                </div>
              </div>
              <div className="history-table">
                {errorEx && <div className="error-message">{errorEx}</div>}
                {loadingEx ? (
                  <div className="loading">Đang tải...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Ngày yêu cầu</th>
                        <th>Điểm sử dụng</th>
                        <th>Giá trị quy đổi</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchanges.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-message">Chưa có yêu cầu</td>
                        </tr>
                      ) : (
                        exchanges.map((req) => (
                          <tr key={req.id}>
                            <td>
                              {req.requestedAt
                                ? new Date(req.requestedAt).toLocaleString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </td>
                            <td className="points-value">{req.pointUsed || 0}</td>
                            <td className="money-value">{(req.exchangeValue || 0).toLocaleString('vi-VN')} ₫</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(req.status)}`}>
                                {getStatusLabel(req.status)}
                              </span>
                            </td>
                            <td>{req.note || ''}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
