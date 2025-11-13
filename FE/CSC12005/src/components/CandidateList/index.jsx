import React, { useState } from "react";
import "./style.scss";
import CandidateDetailModal from "./CandidateDetailModal";

const CandidateList = () => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("Tất cả vị trí");
  const [status, setStatus] = useState("Tất cả trạng thái");

  const candidates = [
    {
      id: 1,
      name: "Phạm Văn C",
      position: "Dev Backend",
      status: "Đã phỏng vấn",
    },
    {
      id: 2,
      name: "Phạm Thị D",
      position: "Dev Frontend",
      status: "Đã trúng tuyển",
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      position: "Dev Tester",
      status: "Không đạt",
    },
    {
      id: 4,
      name: "Trịnh T",
      position: "Dev Backend",
      status: "Chưa phỏng vấn",
    },
    {
      id: 5,
      name: "Lê Duẫn",
      position: "Dev Backend",
      status: "Đã trở thành nhân viên",
    },
    {
      id: 6,
      name: "Phạm Văn Đóm",
      position: "Dev Backend",
      status: "Đã phỏng vấn",
    },
    {
      id: 7,
      name: "Phạm Thị Jack",
      position: "Dev Frontend",
      status: "Đã trúng tuyển",
    },
    {
      id: 8,
      name: "Nguyễn Văn Thiên An",
      position: "Dev Tester",
      status: "Không đạt",
    },
    {
      id: 9,
      name: "Trịnh Bé Sol",
      position: "Dev Backend",
      status: "Đã trúng tuyển",
    },
    {
      id: 10,
      name: "Lê Duẫn KICM",
      position: "Dev Backend",
      status: "Đã trở thành nhân viên",
    },
  ];

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (position === "Tất cả vị trí" || c.position === position) &&
      (status === "Tất cả trạng thái" || c.status === status)
  );

  const handleAction = (type, id) => {
    console.log(`${type} ứng viên ID:`, id);
  };
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số nhân viên mỗi trang

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = filtered.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Khi đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  // modal detail
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const handleClickDetail = (id) => {
    const candidate = candidates.find((c) => c.id === id);
    setSelectedCandidate(candidate);
    setShowDetail(true);
  };
  return (
    <div className="candidate-list">
      <h2>Danh sách Ứng viên Tuyển dụng</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm ứng viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
          <option>Tất cả vị trí</option>
          <option>Dev Backend</option>
          <option>Dev Frontend</option>
          <option>Dev Tester</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Tất cả trạng thái</option>
          <option>Đã phỏng vấn</option>
          <option>Đã trúng tuyển</option>
          <option>Không đạt</option>
          <option>Chưa phỏng vấn</option>
          <option>Đã trở thành nhân viên</option>
        </select>
      </div>

      <table className="candidate-table">
        <thead>
          <tr>
            <th>Tên ứng viên</th>
            <th>Vị trí ứng tuyển</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCandidates.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.position}</td>
              <td>{c.status}</td>
              <td className="actions">
                <button
                  onClick={() => handleClickDetail(c.id)}
                  className="btn light"
                >
                  Xem chi tiết
                </button>
                {c.status !== "Đã trở thành nhân viên" && (
                  <button
                    onClick={() => handleAction("Cập nhật kết quả", c.id)}
                    className="btn primary"
                  >
                    Cập nhật kết quả
                  </button>
                )}
                {c.status === "Đã trúng tuyển" && (
                  <button
                    onClick={() => handleAction("Tạo Hồ sơ Nhân viên", c.id)}
                    className="btn outline"
                  >
                    Tạo Hồ sơ Nhân viên
                  </button>
                )}
                <button
                  onClick={() => handleAction("Tải xuống CV", c.id)}
                  className="btn light"
                >
                  Tải xuống CV
                </button>
                <button
                  onClick={() => handleAction("Chỉnh sửa", c.id)}
                  className="btn warning"
                >
                  Chỉnh sửa
                </button>
                {/* <button onClick={() => handleAction("Vô hiệu hóa", c.id)} className="btn danger">
                  Vô hiệu hóa
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
      <CandidateDetailModal
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default CandidateList;
