import React, { useState, useMemo } from 'react';
import './style.scss';
import InfoCard from '../../components/InfoCard';
export const Manager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const itemsPerPage = 7;
  const employee = {
    name: "Nguyễn Quang Vũ",
    role: "Nhân viên kỹ thuật",
    avatar: "👨‍💼",
  };

  // Dữ liệu mẫu với nhiều nhân viên hơn để test phân trang
  const allEmployees = [
    { id: 'NV001', name: 'Nguyễn Văn A', department: 'Kế toán', position: 'Kế toán trưởng' },
    { id: 'NV002', name: 'Trần Thị B', department: 'Kế toán', position: 'Kế toán viên' },
    { id: 'NV003', name: 'Lê Văn C', department: 'Nhân sự', position: 'Trưởng phòng' },
    { id: 'NV004', name: 'Phạm Thị D', department: 'Marketing', position: 'Marketing Manager' },
    { id: 'NV005', name: 'Hoàng Văn E', department: 'IT', position: 'Developer' },
    { id: 'NV006', name: 'Ngô Thị F', department: 'Kế toán', position: 'Kế toán viên' },
    { id: 'NV007', name: 'Đặng Văn G', department: 'Nhân sự', position: 'HR Specialist' },
    { id: 'NV008', name: 'Vũ Thị H', department: 'Marketing', position: 'Content Writer' },
    { id: 'NV009', name: 'Bùi Văn I', department: 'IT', position: 'Tech Lead' },
    { id: 'NV010', name: 'Đinh Thị K', department: 'Kế toán', position: 'Kế toán trưởng' },
    { id: 'NV011', name: 'Dương Văn L', department: 'Nhân sự', position: 'Recruiter' },
    { id: 'NV012', name: 'Mai Thị M', department: 'Marketing', position: 'SEO Specialist' },
    { id: 'NV013', name: 'Lý Văn N', department: 'IT', position: 'Backend Developer' },
    { id: 'NV014', name: 'Phan Thị O', department: 'Kế toán', position: 'Kế toán viên' },
    { id: 'NV015', name: 'Tô Văn P', department: 'Marketing', position: 'Brand Manager' },
  ];

  // Lọc nhân viên theo search term
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(employee => {
      const matchesSearch =
        employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());

      // Thêm logic lọc theo phòng ban
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'accounting' && employee.department === 'Kế toán') ||
        (selectedFilter === 'hr' && employee.department === 'Nhân sự') ||
        (selectedFilter === 'marketing' && employee.department === 'Marketing') ||
        (selectedFilter === 'it' && employee.department === 'IT');

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Chức năng xuất file CSV
  const exportToCSV = () => {
    // Tạo header
    const headers = ['Mã NV', 'Tên nhân viên', 'Phòng ban', 'Vị trí'];

    // Tạo rows
    const rows = filteredEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.department,
      emp.position
    ]);

    // Kết hợp header và rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Thêm BOM để hỗ trợ tiếng Việt
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Tạo link download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_nhan_vien_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chức năng xuất file Excel (HTML table format)
  const exportToExcel = () => {
    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Danh sách nhân viên</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Tên nhân viên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEmployees.map(emp => `
              <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_nhan_vien_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="employee-container">
      <InfoCard employee={employee}/>
      <h1 className="page-title">Nhân viên dưới quyền</h1>

      <div className="search-section">
        <div className="dropdown-wrapper">
          <button
            className="btn-all-employees"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedFilter === 'all' && 'Tất cả nhân viên'}
            {selectedFilter === 'accounting' && 'Kế toán'}
            {selectedFilter === 'hr' && 'Nhân sự'}
            {selectedFilter === 'marketing' && 'Marketing'}
            {selectedFilter === 'it' && 'IT'}
            <span className="dropdown-icon">▼</span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => {
                setSelectedFilter('all');
                setCurrentPage(1);
                setShowDropdown(false);
              }}>
                Tất cả nhân viên
              </div>
              <div className="dropdown-item" onClick={() => {
                setSelectedFilter('accounting');
                setCurrentPage(1);
                setShowDropdown(false);
              }}>
                Kế toán
              </div>
              <div className="dropdown-item" onClick={() => {
                setSelectedFilter('hr');
                setCurrentPage(1);
                setShowDropdown(false);
              }}>
                Nhân sự
              </div>
              <div className="dropdown-item" onClick={() => {
                setSelectedFilter('marketing');
                setCurrentPage(1);
                setShowDropdown(false);
              }}>
                Marketing
              </div>
              <div className="dropdown-item" onClick={() => {
                setSelectedFilter('it');
                setCurrentPage(1);
                setShowDropdown(false);
              }}>
                IT
              </div>
            </div>
          )}
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="employee-list-card">
        <div className="card-header">
          <div className="icon-group">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="15" cy="12" r="5" fill="#2c3e50" />
              <path d="M8 28c0-4 3-7 7-7s7 3 7 7" stroke="#2c3e50" strokeWidth="2" fill="none" />
              <circle cx="27" cy="15" r="4" fill="#2c3e50" />
              <path d="M33 28c0-3-2.5-5.5-5.5-5.5" stroke="#2c3e50" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 className="card-title">Danh sách nhân viên dưới quyền</h2>
          <div className="employee-count">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} / {filteredEmployees.length} nhân viên
          </div>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Tên nhân viên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr key={employee.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>
                    <a href="#" className="link-view" onClick={(e) => {
                      e.preventDefault();
                      alert(`Xem chi tiết nhân viên: ${employee.name}`);
                    }}>Xem</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">Không tìm thấy nhân viên nào</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`dots-${index}`} className="page-dots">...</span>
              ) : (
                <button
                  key={page}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            ))}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="export-section">
        <button className="btn-export" onClick={exportToExcel}>
          <span className="export-icon">📊</span>
          Xuất Excel
        </button>
        <button className="btn-export btn-export-csv" onClick={exportToCSV}>
          <span className="export-icon">📄</span>
          Xuất CSV
        </button>
      </div>
    </div>
  );
};