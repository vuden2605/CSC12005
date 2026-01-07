import React, { useState, useEffect } from "react";
import { HRService } from "../../services/HRService";
import "./AssignCandidatesModal.scss";
import { useAlert } from "../../context/AlertContext";
const AssignCandidatesModal = ({ schedule, onClose, onSuccess }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchCandidates();
  }, [schedule.position?.id]);

  // ========== FETCH CANDIDATES BY POSITION (KEY LOGIC) ==========
  const fetchCandidates = async () => {
    if (!schedule.position?.id) {
      setError("Lịch phỏng vấn chưa có vị trí tuyển dụng");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call API to get candidates by position (without schedule)
      const data = await HRService.getCandidatesByPosition(
        schedule.position.id
      );

      setCandidates(data);
      console.log(
        `Fetched ${data.length} candidates for position ${schedule.position.positionName}`
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCandidate = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((c) => c.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedCandidates.length === 0) {
      showAlert("success", "Vui lòng chọn ít nhất 1 ứng viên");
      return;
    }

    try {
      setSubmitting(true);

      // ========== CALL ADD CANDIDATES API ==========
      await HRService.addCandidatesToSchedule(schedule.id, selectedCandidates);

      if (onSuccess) {
        onSuccess(selectedCandidates.length);
      }

      onClose();
    } catch (err) {
      console.error("Error:", err);
      showAlert("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" style={{ zIndex: 2000 }}>
        <div className="modal-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải danh sách ứng viên...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="modal-content assign-candidates-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Gán ứng viên vào lịch phỏng vấn</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="schedule-info">
            <p style={{ color: "#fff" }}>
              <strong>Ngày: </strong> {schedule.date}
            </p>
            <p style={{ color: "#fff" }}>
              <strong>Khung giờ:</strong> {schedule.timeSlot}
            </p>
            <p style={{ color: "#fff" }}>
              <strong>Vị trí:</strong> {schedule.position?.positionName}
            </p>
          </div>

          {candidates.length === 0 ? (
            <div className="empty-state">
              <p>
                Không có ứng viên nào chưa được gán lịch cho vị trí{" "}
                <strong>{schedule.position?.positionName}</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <div className="info-text">
                  Tìm thấy <strong>{candidates.length}</strong> ứng viên chưa có
                  lịch
                </div>
                <button className="btn-select-all" onClick={handleSelectAll}>
                  {selectedCandidates.length === candidates.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </button>
              </div>

              <div className="candidates-list">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`candidate-item ${
                      selectedCandidates.includes(candidate.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleToggleCandidate(candidate.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleToggleCandidate(candidate.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="candidate-avatar">
                      {candidate.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="candidate-info">
                      <div className="candidate-name">{candidate.fullName}</div>
                      <div className="candidate-email">{candidate.email}</div>
                      {candidate.phone && (
                        <div className="candidate-phone">{candidate.phone}</div>
                      )}
                    </div>
                    <div className="candidate-status">
                      <span className="status-badge status-new">
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="selection-summary">
                Đã chọn: <strong>{selectedCandidates.length}</strong> /{" "}
                {candidates.length} ứng viên
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || selectedCandidates.length === 0}
          >
            {submitting
              ? "Đang xử lý..."
              : `✓ Gán ${selectedCandidates.length} ứng viên`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignCandidatesModal;
