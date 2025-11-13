import React from "react";
import "./style.scss";

const CandidateDetailModal = ({ visible, onClose, candidate }) => {
  if (!visible || !candidate) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Quản lý Ứng viên / Hồ sơ Ứng viên</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* --- Thông tin cá nhân --- */}
          <section className="info-section">
            <h3>Thông tin Cá nhân</h3>
            <div className="info-grid">
              <div>
                <p>Họ và tên:</p>
                <p>Giới tính:</p>
                <p>Ngày sinh:</p>
                <p>Email:</p>
                <p>Số điện thoại:</p>
                <p>Địa chỉ:</p>
              </div>
              <div>
                <p>{candidate.name}</p>
                <p>{candidate.gender || "Nam"}</p>
                <p>{candidate.birth || "15/03/2000"}</p>
                <p>{candidate.email || "phamvanc@example.com"}</p>
                <p>{candidate.phone || "0909 123 456"}</p>
                <p>{candidate.address || "Q. Bình Thạnh, TP.HCM"}</p>
              </div>
            </div>

            <div className="attachments">
              <h4>Hồ sơ đính kèm</h4>
              <div className="file-list">
                <span className="file">📄 CV_PhamVanC.pdf</span>
                <span className="file">📄 BangTotNghiep.pdf</span>
                <span className="file">📄 ChungChiJava.pdf</span>
              </div>
            </div>
          </section>

          {/* --- Quá trình ứng tuyển --- */}
          <section className="process-section">
            <h3>Quá trình Ứng tuyển</h3>
            <div className="info-grid">
              <div>
                <p>Vị trí ứng tuyển:</p>
                <p>Vòng hiện tại:</p>
                <p>Người phỏng vấn:</p>
                <p>Ngày phỏng vấn:</p>
              </div>
              <div>
                <p>{candidate.position}</p>
                <p>Phỏng vấn kỹ thuật</p>
                <p>Nguyễn Văn D (Tech Lead)</p>
                <p>04/11/2025</p>
              </div>
            </div>

            <div className="update-section">
              <h4>Cập nhật Kết quả</h4>
              <div className="form">
                <label>Trạng thái</label>
                <select>
                  <option>Đang đánh giá</option>
                  <option>Đã trúng tuyển</option>
                  <option>Không đạt</option>
                </select>

                <label>Điểm số</label>
                <input type="text" placeholder="Nhập điểm..." />

                <label>Đánh giá / Nhận xét</label>
                <textarea placeholder="Nhận xét của HR hoặc người phỏng vấn..." />
              </div>

              <div className="actions">
                <button className="btn danger">Loại ứng viên</button>
                <button className="btn warning">Lưu tạm</button>
                <button className="btn success">Tạo Hồ sơ Nhân viên</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
