import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import "./style.scss";
import { EmployeeService } from "../../../../services/EmployeeService";
import { Pagination } from "../../../../components/Pagination";
import { AttendanceModal } from "../../../../components/modals/Request/ModalTimekeeping/ModalTimekeeping";
import { MyTimesheetDetailModal } from "../../../../components/modals/Request/MyTimesheetDetailModal/MyTimesheetDetailModal";

export const Attendance = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showTimekeepingModal, setShowTimekeepingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showTimesheetDetailModal, setShowTimesheetDetailModal] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  // API data states
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalWorkDays: 0,
    lateDays: 0,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState("workDate");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Format date từ ISO string sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format time từ HH:mm:ss sang HH:mm
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5);
  };

  // Calculate statistics from attendance data
  const calculateStatistics = (records) => {
    if (!records || records.length === 0) {
      return {
        totalWorkDays: 0,
        lateDays: 0,
      };
    }

    let totalWorkDays = 0;
    let lateDays = 0;

    records.forEach((record) => {
      const type = record.type || record.status;

      // Count work days (non-absent records)
      if (type !== "ABSENT") {
        totalWorkDays++;

        // Prefer backend lateMinutes field if available
        if (typeof record.lateMinutes === "number" && record.lateMinutes > 0) {
          lateDays++;
        } else if (record.checkIn) {
          const [hours, minutes] = record.checkIn.split(":").map(Number);
          const checkInMinutes = hours * 60 + minutes;
          const lateThresholdMinutes = 8 * 60; // 08:00
          if (checkInMinutes > lateThresholdMinutes) {
            lateDays++;
          }
        }
      }
    });

    return {
      totalWorkDays,
      lateDays,
    };
  };

  // Fetch attendance từ API
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: sortBy,
        direction: sortDirection,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log("Fetch params:", params);

      const data = await EmployeeService.getAttendanceHistory(params);

      // Handle response
      const records = Array.isArray(data) ? data : (data?.content || data?.records || []);
      setAttendanceData(records);

      // Calculate statistics from fetched records
      const calculatedStats = calculateStatistics(records);
      setStatistics(calculatedStats);

      // Set pagination
      if (data?.totalPages !== undefined) {
        setPagination(prev => ({
          ...prev,
          page: data.number || pagination.page,
          size: data.size || 10,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setError(err.message);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, startDate, endDate, sortBy, sortDirection]);

  // Fetch attendance khi component mount
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Reset page về 0 khi filters thay đổi
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  }, [startDate, endDate]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchAttendance();
  };

  const handlePaginationPageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePaginationSizeChange = (size) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  };

  const handleSortColumn = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortDirection("ASC");
    }
  };

  const handleExport = () => {
    if (attendanceData.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const statusMap = {
      'PRESENT': 'Cả ngày',
      'WFH': 'Làm từ xa',
      'HALF_DAY': 'Nửa ngày',
      'HOLIDAY': 'Ngày lễ',
      'LATE': 'Đi muộn',
      'ABSENT': 'Vắng'
    };

    // Prepare data for Excel
    const exportData = attendanceData.map((record) => ({
      'Thời gian': formatDate(record.workDate),
      'Check-in': formatTime(record.checkIn) || 'N/A',
      'Check-out': formatTime(record.checkOut) || 'N/A',
      'Giờ làm (giờ)': typeof record.workHours === 'number' ? record.workHours : '',
      'Đi muộn (phút)': typeof record.lateMinutes === 'number' ? record.lateMinutes : '',
      'Trạng thái': statusMap[record.type] || statusMap[record.status] || record.type || record.status || 'Bình thường',
    }));

    // Add statistics at the end
    exportData.push({
      'Thời gian': '',
      'Check-in': '',
      'Check-out': '',
      'Trạng thái': ''
    });
    exportData.push({
      'Thời gian': 'Thống kê',
      'Check-in': '',
      'Check-out': '',
      'Trạng thái': ''
    });
    exportData.push({
      'Thời gian': `Số ngày làm việc: ${statistics.totalWorkDays}`,
      'Check-in': '',
      'Check-out': '',
      'Trạng thái': ''
    });
    exportData.push({
      'Thời gian': `Số ngày đi muộn: ${statistics.lateDays}`,
      'Check-in': '',
      'Check-out': '',
      'Trạng thái': ''
    });

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch sử chấm công");

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
      { wch: 15 },
    ];

    // Generate file name with current date
    const now = new Date();
    const fileName = `LichSuChamCong_${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fileName);
  };

  const handleCreateRequest = (workDate) => {
    setSelectedDate(workDate);
    setShowTimekeepingModal(true);
  };

  const handleViewTimesheetDetail = (record) => {
    setSelectedTimesheet(record);
    setShowTimesheetDetailModal(true);
  };

  const handleModalSuccess = () => {
    setShowTimekeepingModal(false);
    
    fetchAttendance();
  };

  return (
    <div className="attendance-page">
      {/* Filter Section */}
      <div className="filter-section">
        <h3 className="section-title">Lọc theo ngày</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <label htmlFor="startDate">Từ:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">Đến:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="search-button">
            Tìm kiếm
          </button>
          <button
            type="button"
            className="export-button"
            onClick={handleExport}
          >
            Xuất
          </button>
          <button
            type="button"
            className="reset-button"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
          >
            Đặt lại
          </button>
        </form>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">
        <div className="stat-card">
          <label>Số ngày làm việc:</label>
          <span className="stat-value">{statistics.totalWorkDays || 0}</span>
        </div>
        <div className="stat-card">
          <label>Số ngày đi muộn:</label>
          <span className="stat-value warning">{statistics.lateDays || 0}</span>
        </div>
      </div>

      {/* Attendance List Section */}
      <div className="attendance-section">
        <h3 className="section-title">Lịch sử chấm công</h3>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : attendanceData.length === 0 ? (
          <div className="no-data">Không có dữ liệu chấm công</div>
        ) : (
          <>
            <div className="table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSortColumn('workDate')}
                      title="Bấm để sắp xếp"
                    >
                      Thời gian {sortBy === 'workDate' && (sortDirection === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Giờ làm (giờ)</th>
                    <th>Đi muộn (phút)</th>
                    <th>Trạng thái</th>
                    <th>Tạo yêu cầu</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => {
                    const statusMap = {
                      'PRESENT': 'Cả ngày',
                      'WFH': 'Làm từ xa',
                      'HALF_DAY': 'Nửa ngày',
                      'HOLIDAY': 'Ngày lễ',
                      'LATE': 'Đi muộn',
                      'ABSENT': 'Vắng'
                    };
                    
                    return (
                      <tr key={record.id || index} className={index % 2 === 0 ? 'even-row' : ''}>
                        <td className="date-cell">{formatDate(record.workDate) || "N/A"}</td>
                        <td className="checkin-cell">
                          <span className="time-success">{formatTime(record.checkIn) || "N/A"}</span>
                        </td>
                        <td className="checkout-cell">
                          <span className="time-danger">{formatTime(record.checkOut) || "N/A"}</span>
                        </td>
                        <td>{typeof record.workHours === 'number' ? record.workHours : '-'}</td>
                        <td>{typeof record.lateMinutes === 'number' ? record.lateMinutes : 0}</td>
                        <td className="status-cell">
                          <span className={`status ${(record.type || record.status)?.toLowerCase() || 'normal'}`}>
                            {statusMap[record.type] || statusMap[record.status] || record.type || record.status || "Bình thường"}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button
                            className="create-request-btn"
                            onClick={() => handleCreateRequest(record.workDate)}
                            title="Tạo yêu cầu chấm công"
                          >
                            Tạo yêu cầu
                          </button>
                        </td>
                        <td className="action-cell">
                          <button
                            className="create-request-btn"
                            onClick={() => handleViewTimesheetDetail(record)}
                            title="Xem chi tiết timesheet"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.size}
              totalElements={pagination.totalElements}
              onPageChange={handlePaginationPageChange}
              onPageSizeChange={handlePaginationSizeChange}
              loading={loading}
            />
          </>
        )}
      </div>

      {/* Timekeeping Modal */}
      {showTimekeepingModal && (
        <AttendanceModal
          onClose={() => setShowTimekeepingModal(false)}
          onSuccess={handleModalSuccess}
          initialDate={selectedDate}
        />
      )}
      {showTimesheetDetailModal && selectedTimesheet && (
        <MyTimesheetDetailModal
          timesheet={selectedTimesheet}
          onClose={() => {
            setShowTimesheetDetailModal(false);
            setSelectedTimesheet(null);
          }}
        />
      )}
    </div>
  );
};
