import React, { useEffect, useState } from 'react';
import './style.scss';
import img from "../../assets/image.png"
const EventPageHR = () => {
  // ---- FILTER STATE ----
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL | REQUIRED | OPTIONAL
  const [startDate, setStartDate] = useState('2025-09-20');
  const [endDate, setEndDate] = useState('2025-09-20');

  // ---- PAGINATION STATE ----
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);      // số item mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  // ---- DATA STATE ----
  const [events, setEvents] = useState([]);

  // ================== DỮ LIỆU MẪU (giả lập API) ==================
  const ALL_EVENTS = [
    { id: 1, name: 'Chạy bộ',      type: 'Bắt buộc',        typeCode: 'REQUIRED', startDate: '22/11/2025', endDate: '28/11/2025', points: 5,  amount: '100/100' },
    { id: 2, name: 'Bơi lội',      type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '30/04/2022', points: 5,  amount: '10/50'   },
    { id: 3, name: 'Tình nguyện',  type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '28/06/2022', points: 5,  amount: '30/50'  },
    { id: 4, name: 'Hiến máu',     type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '28/04/2022', points: 10, amount: '100/200'},
     { id: 5, name: '5',      type: 'Bắt buộc',        typeCode: 'REQUIRED', startDate: '22/04/2022', endDate: '28/04/2022', points: 5,  amount: '100/100' },
    { id: 6, name: '6',      type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '30/04/2022', points: 5,  amount: '10/50'   },
    { id: 7, name: '7',  type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '28/06/2022', points: 5,  amount: '30/50'  },
    { id: 8, name: '8',     type: 'Không bắt buộc',  typeCode: 'OPTIONAL', startDate: '22/04/2022', endDate: '28/04/2022', points: 10, amount: '100/200'},
    // nếu muốn test phân trang, thêm nhiều item ở đây
  ];

  // ================== HÀM GỌI API DUY NHẤT ==================
  const fetchEvents = async ({ typeFilter, startDate, endDate, page, pageSize }) => {

    try {
      // --- Đây là chỗ bạn thay bằng API thật ---
      // const res = await fetch(
      //   `/api/events?type=${typeFilter}&startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`
      // );
      // const data = await res.json();
      // setEvents(data.items);
      // setTotalPages(data.totalPages);

      // ----- GIẢ LẬP API TỪ DỮ LIỆU ALL_EVENTS -----
      let filtered = ALL_EVENTS;

      if (typeFilter !== 'ALL') {
        filtered = filtered.filter(e => e.typeCode === typeFilter);
      }

      // ở đây chỉ filter theo loại; nếu muốn filter ngày thực, bạn parse dd/MM/yyyy rồi so sánh với startDate/endDate dạng yyyy-MM-dd
      const startIndex = (page - 1) * pageSize;
      const pageItems = filtered.slice(startIndex, startIndex + pageSize);
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

      // giả delay network
      setTimeout(() => {
        setEvents(pageItems);
        setTotalPages(pages);
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  // ================== GỌI API KHI FILTER / PAGE ĐỔI ==================
  useEffect(() => {
    fetchEvents({ typeFilter, startDate, endDate, page, pageSize });
  }, [typeFilter, startDate, endDate, page, pageSize]);

  // ================== HANDLER ==================
  const handleChangeType = (value) => {
    setTypeFilter(value);
    setPage(1); // reset về trang 1 khi đổi filter
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(1);
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(1);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) setPage(p);
  };

  return (
    <div className="event-page">
      {/* HEADER */}
      <div className="event-header">
        <div className="icon-wrapper">
          {/* Thay bằng <img src="..." /> nếu có icon thật */}
          <img className="icon-megaphone" src={img}></img>
        </div>
        <h1>Quản lý sự kiện</h1>
      </div>

    

      <div className="date-row">
        <div className="date-field">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleChangeStartDate(e.target.value)}
          />
        </div>
        <span className="date-text">đến</span>
        <div className="date-field">
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleChangeEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-type">
          <span className="label">Loại</span>
          <div className="select-wrapper">
            <select
              value={typeFilter}
              onChange={(e) => handleChangeType(e.target.value)}
            >
              <option value="ALL">Tất cả</option>
              <option value="REQUIRED">Bắt buộc</option>
              <option value="OPTIONAL">Không bắt buộc</option>
            </select>
          </div>
        </div>
      </div>

      {/* BẢNG */}
      <div className="table-wrapper">
        
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Loại</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Số điểm</th>
                <th>Số lượng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    Không có sự kiện
                  </td>
                </tr>
              ) : (
                events.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={idx % 2 === 0 ? 'row-light' : 'row-dark'}
                  >
                    <td className="left">{e.name}</td>
                    <td>{e.type}</td>
                    <td>{e.startDate}</td>
                    <td>{e.endDate}</td>
                    <td>{e.points}</td>
                    <td>{e.amount}</td>
                    <td>
                      <button className="btn-view">Xem</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        
      </div>

      <div className="pagination">
        <button
          className="page-arrow"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          ‹
        </button>

        <button
          className={`page-number ${page === 1 ? 'active' : ''}`}
          onClick={() => goToPage(1)}
        >
          1
        </button>

        {totalPages >= 2 && (
          <button
            className={`page-number ${page === 2 ? 'active' : ''}`}
            onClick={() => goToPage(2)}
          >
            2
          </button>
        )}

        {totalPages > 2 && <span className="dots">...</span>}

        <button
          className="page-arrow"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          ›
        </button>
      </div>

      {/* NÚT TẠO MỚI */}
      <div className="create-wrapper">
        <button className="btn-create">Tạo mới sự kiện</button>
      </div>
    </div>
  );
};

export default EventPageHR;