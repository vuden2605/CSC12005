import React from "react";
import "./style.scss";

export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  pageSize = 10,
  totalElements = 0,
  onPageChange,
  onPageSizeChange,
  loading = false,
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Tính toán các trang để hiển thị (tối đa 5 trang)
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

  // Điều chỉnh để luôn hiển thị 5 trang nếu có thể
  if (endPage - startPage < 4) {
    if (startPage === 0) {
      endPage = Math.min(4, totalPages - 1);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(0, totalPages - 5);
    }
  }

  const pagesToShow = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePreviousPage = () => {
    if (currentPage > 0 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleSizeChange = (e) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(e.target.value));
    }
  };

  return (
    <div className="pagination-wrapper">
      <div className="pagination-left">
        <label htmlFor="size-select">Số mục mỗi trang: </label>
        <select
          id="size-select"
          value={pageSize}
          onChange={handleSizeChange}
          disabled={loading}
          className="size-select"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="pagination-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0 || loading}
          className="pagination-button prev-button"
          title="Trang trước"
        >
          ‹
        </button>

        <div className="pagination-numbers">
          {pagesToShow.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              disabled={loading}
              className={`page-number ${page === currentPage ? "active" : ""}`}
            >
              {page + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1 || loading}
          className="pagination-button next-button"
          title="Trang sau"
        >
          ›
        </button>
      </div>

      <div className="pagination-right">
        Hiển thị {startItem} - {endItem} / {totalElements} kết quả
      </div>
    </div>
  );
};
