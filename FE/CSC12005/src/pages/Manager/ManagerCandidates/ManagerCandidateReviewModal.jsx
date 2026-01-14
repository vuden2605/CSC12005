import React, { useState, useEffect } from "react";
import { ManagerService } from "../../../services/ManagerService";
import "./style.scss";
import ConfirmModal from "../../../components/modals/ConfirmModal/ConfirmModal"; 

const ManagerCandidateReviewModal = ({ candidate, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    technical: 3,
    communication: 3,
    experience: 3,
    cultureFit: 3,
    problemSolving: 3,
    feedback: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });
  if (!candidate) return null;

  // Prefill điểm nếu backend đã có kết quả đánh giá trước đó
  useEffect(() => {
    if (!candidate) return;

    setForm((prev) => ({
      ...prev,
      technical:
        typeof candidate.ratingTechnical === "number"
          ? Math.max(1, Math.min(5, Math.round(candidate.ratingTechnical)))
          : prev.technical,
      communication:
        typeof candidate.ratingCommunication === "number"
          ? Math.max(1, Math.min(5, Math.round(candidate.ratingCommunication)))
          : prev.communication,
      experience:
        typeof candidate.ratingExperience === "number"
          ? Math.max(1, Math.min(5, Math.round(candidate.ratingExperience)))
          : prev.experience,
      cultureFit:
        typeof candidate.ratingCultureFit === "number"
          ? Math.max(1, Math.min(5, Math.round(candidate.ratingCultureFit)))
          : prev.cultureFit,
      problemSolving:
        typeof candidate.ratingProblemSolving === "number"
          ? Math.max(1, Math.min(5, Math.round(candidate.ratingProblemSolving)))
          : prev.problemSolving,
      feedback: candidate.feedback || prev.feedback,
    }));
  }, [candidate]);

  const getCandidateStatusLabel = (status) => {
    switch (status) {
      case "NOT_INTERVIEWED":
        return "Chưa phỏng vấn";
      case "INTERVIEWING":
        return "Đang phỏng vấn";
      case "INTERVIEWED":
        return "Đã phỏng vấn";
      case "PASSED":
        return "Đạt";
      case "FAILED":
        return "Không đạt";
      case "HIRED":
        return "Đã thành nhân viên";
      default:
        return status;
    }
  };

  const getCandidateStatusClass = (status) => {
    switch (status) {
      case "NOT_INTERVIEWED":
        return "status-new";
      case "INTERVIEWING":
        return "status-interviewing";
      case "INTERVIEWED":
        return "status-interviewed";
      case "PASSED":
        return "status-passed";
      case "FAILED":
        return "status-rejected";
      case "HIRED":
        return "status-hired";
      default:
        return "status-default";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  // ========== HANDLE SUBMIT WITH CONFIRM MODAL (UPDATED) ==========
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Mở ConfirmModal thay vì window.confirm
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Xác nhận lưu đánh giá",
      message: `Bạn có chắc chắn muốn lưu đánh giá cho ứng viên "${candidate.fullName}"?\n\nThao tác này không thể hoàn tác.`,
      onConfirm: handleConfirmSave,
    });
  };

  // ========== ACTUAL SAVE LOGIC (NEW) ==========
  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      setConfirmModal({ ...confirmModal, isOpen: false });

      const payload = {
        ratingTechnical: Number(form.technical),
        ratingCommunication:  Number(form.communication),
        ratingProblemSolving: Number(form.problemSolving),
        ratingExperience: Number(form.experience),
        ratingCultureFit: Number(form.cultureFit),
        feedback: form.feedback,
      };

      const alreadyEvaluated = [
        candidate.ratingTechnical,
        candidate.ratingCommunication,
        candidate. ratingProblemSolving,
        candidate.ratingExperience,
        candidate.ratingCultureFit,
      ].some((v) => typeof v === "number");

      const shouldCreate = candidate.status === "INTERVIEWING" && !alreadyEvaluated;

      if (shouldCreate) {
        await ManagerService.createCandidateEvaluation(candidate. id, payload);
      } else {
        await ManagerService. updateCandidateEvaluation(candidate.id, payload);
      }

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("Save review error:", err);
      setError(err.message || "Không thể lưu đánh giá ứng viên");
    } finally {
      setLoading(false);
    }
  };

  // ========== HANDLE CANCEL CONFIRM (NEW) ==========
  const handleCancelConfirm = () => {
    setConfirmModal({ ... confirmModal, isOpen: false });
  };


  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="icon-user" /> Đánh giá ứng viên
          </h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <section className="info-section">
            <h4 className="section-title">Thông tin cơ bản</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Họ và tên:</label>
                <strong>{candidate.fullName}</strong>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{candidate.email}</span>
              </div>
              <div className="info-item">
                <label>Giới tính:</label>
                <span>
                  {candidate.gender === "MALE"
                    ? "Nam"
                    : candidate.gender === "FEMALE"
                    ? "Nữ"
                    : "Khác"}
                </span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{candidate.phone || "N/A"}</span>
              </div>
              <div className="info-item">
                <label>Vị trí ứng tuyển:</label>
                <strong>{candidate.position?.positionName || "N/A"}</strong>
              </div>
              <div className="info-item full-width">
                <label>Trạng thái hiện tại:</label>
                <span
                  className={`status-badge ${getCandidateStatusClass(candidate.status)}`}
                >
                  {getCandidateStatusLabel(candidate.status)}
                </span>
              </div>
            </div>
          </section>

          {candidate.schedule && (
            <section className="info-section">
              <h4 className="section-title">Lịch phỏng vấn</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Ngày phỏng vấn:</label>
                  <span>{candidate.schedule.date}</span>
                </div>
                <div className="info-item">
                  <label>Địa điểm:</label>
                  <span>{candidate.schedule.location}</span>
                </div>
              </div>
            </section>
          )}

          <form className="info-section" onSubmit={handleSubmit}>
            <h4 className="section-title">Đánh giá phỏng vấn</h4>

            <div className="info-grid">
              <div className="info-item full-width">
                <label>Kỹ năng chuyên môn</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className={`star ${v <= form.technical ? "active" : ""}`}
                      style={{ color: v <= form.technical ? "#f59e0b" : "#c4c7ce" }}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, technical: v }))
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="star-score">{form.technical}/5</span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Kỹ năng giao tiếp</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className={`star ${v <= form.communication ? "active" : ""}`}
                      style={{ color: v <= form.communication ? "#f59e0b" : "#c4c7ce" }}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, communication: v }))
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="star-score">{form.communication}/5</span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Kinh nghiệm thực tế</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className={`star ${v <= form.experience ? "active" : ""}`}
                      style={{ color: v <= form.experience ? "#f59e0b" : "#c4c7ce" }}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, experience: v }))
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="star-score">{form.experience}/5</span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Phù hợp văn hóa</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className={`star ${v <= form.cultureFit ? "active" : ""}`}
                      style={{ color: v <= form.cultureFit ? "#f59e0b" : "#c4c7ce" }}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, cultureFit: v }))
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="star-score">{form.cultureFit}/5</span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Khả năng giải quyết vấn đề</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <span
                      key={v}
                      className={`star ${v <= form.problemSolving ? "active" : ""}`}
                      style={{ color: v <= form.problemSolving ? "#f59e0b" : "#c4c7ce" }}
                      onClick={() => setForm((prev) => ({ ...prev, problemSolving: v }))}
                    >
                      ★
                    </span>
                  ))}
                  <span className="star-score">{form.problemSolving}/5</span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Nhận xét</label>
                <textarea
                  name="feedback"
                  value={form.feedback}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Nhận xét về ứng viên (tuỳ chọn)"
                />
              </div>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <i className="icon-alert" /> {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu đánh giá"}
          </button>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Đóng
          </button>
        </div>
      </div>
    </div>
       <ConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal. type}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={handleCancelConfirm}
        loading={loading}
      />
    </>
  );
};

export default ManagerCandidateReviewModal;
