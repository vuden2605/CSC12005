package com.csc12005.hr.Service.MailService. impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Schedule;
import com.csc12005.hr.Service.MailService.IMailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j. Slf4j;
import org. springframework.mail.javamail.JavaMailSender;
import org.springframework. mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.io.UnsupportedEncodingException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util. Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService implements IMailService {

    private final JavaMailSender mailSender;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("'Ngày' dd 'tháng' MM 'năm' yyyy", new Locale("vi", "VN"));

    // ==================== 1. THƯ MỜI PHỎNG VẤN ====================
    @Override
    public void sendInterviewScheduleMail(String toEmail, String candidateName, Schedule schedule) {
        try {
            sendEmail(
                    toEmail,
                    "Thư mời phỏng vấn - Vị trí " + schedule.getPosition().getPositionName(),
                    buildInterviewInvitationHtml(candidateName, toEmail, schedule)
            );
            log.info("✅ Đã gửi email MỜI PHỎNG VẤN đến:  {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Lỗi gửi email mời phỏng vấn đến {}: {}", toEmail, e. getMessage());
        }
    }

    // ==================== 2. XÓA KHỎI DANH SÁCH ====================
    @Override
    public void sendCandidateRemovedMail(String toEmail, String candidateName, Schedule schedule, String reason) {
        try {
            sendEmail(
                    toEmail,
                    "Thông báo thay đổi lịch phỏng vấn - Vị trí " + schedule.getPosition().getPositionName(),
                    buildCandidateRemovedHtml(candidateName, toEmail, schedule, reason)
            );
            log.info("✅ Đã gửi email XÓA KHỎI LỊCH đến: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Lỗi gửi email xóa khỏi lịch đến {}: {}", toEmail, e.getMessage());
        }
    }

    // ==================== 3. HỦY LỊCH PHỎNG VẤN ====================
    @Override
    public void sendScheduleCancelledMail(String toEmail, String candidateName, Schedule schedule, String reason) {
        try {
            sendEmail(
                    toEmail,
                    "Thông báo hủy lịch phỏng vấn - Vị trí " + schedule.getPosition().getPositionName(),
                    buildScheduleCancelledHtml(candidateName, toEmail, schedule, reason)
            );
            log.info("✅ Đã gửi email HỦY LỊCH đến: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Lỗi gửi email hủy lịch đến {}: {}", toEmail, e. getMessage());
        }
    }

    // ==================== 4. THÔNG BÁO ĐẠT ====================
    @Override
    public void sendInterviewPassedMail(String toEmail, String candidateName, String positionName) {
        try {
            sendEmail(
                    toEmail,
                    "Chúc mừng!  Kết quả phỏng vấn - Vị trí " + positionName,
                    buildInterviewPassedHtml(candidateName, toEmail, positionName)
            );
            log.info("✅ Đã gửi email THÔNG BÁO ĐẠT đến:  {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Lỗi gửi email thông báo đạt đến {}: {}", toEmail, e.getMessage());
        }
    }

    // ==================== HELPER METHOD ====================
    private void sendEmail(String toEmail, String subject, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);

        try {
            helper.setFrom("csc12005hr@gmail.com", "CSC12005 HR Department");
        } catch (UnsupportedEncodingException e) {
            helper.setFrom("csc12005hr@gmail.com");
            log.warn("⚠️ Cannot set personal name, using email only");
        }

        helper. setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }
    // ==================== 5. CẬP NHẬT LỊCH PHỎNG VẤN ====================
    @Override
    public void sendScheduleUpdatedMail(String toEmail, String candidateName, Schedule oldSchedule, Schedule newSchedule) {
        try {
            sendEmail(
                    toEmail,
                    "Thông báo cập nhật lịch phỏng vấn - Vị trí " + newSchedule.getPosition().getPositionName(),
                    buildScheduleUpdatedHtml(candidateName, toEmail, oldSchedule, newSchedule)
            );
            log.info("✅ Đã gửi email CẬP NHẬT LỊCH đến:  {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Lỗi gửi email cập nhật lịch đến {}: {}", toEmail, e.getMessage());
        }
    }

    // ==================== HTML TEMPLATES ====================

    // 1. THƯ MỜI PHỎNG VẤN
    private String buildInterviewInvitationHtml(String candidateName, String email, Schedule schedule) {
        String formattedDate = schedule.getDate().format(DATE_FORMATTER);

        return String.format("""
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    %s
                </head>
                <body>
                    <div class="email-container">
                        <div class="content">
                            <h1 class="title">Thư Mời Phỏng Vấn</h1>
                            
                            %s
                            
                            <div class="date">%s</div>
                            
                            <div class="recipient-info">
                                <p><strong>Ông/Bà:  %s</strong></p>
                                <p>Email: %s</p>
                            </div>
                            
                            <p class="greeting">Kính gửi Ông/Bà %s,</p>
                            
                            <p class="body-text">
                                Thay mặt <span class="company-name">Công ty CSC12005</span>, tôi xin gửi lời mời 
                                phỏng vấn cho vị trí <span class="position-highlight">%s</span>. Thư này là văn bản 
                                chính thức xác nhận lời mời phỏng vấn và chúng tôi tin rằng Ông/Bà sẽ cân nhắc cơ hội này. 
                            </p>
                            
                            <p class="body-text">
                                <span class="company-name">CSC12005</span> tự hào là đơn vị tìm kiếm những cá nhân 
                                xuất sắc, đam mê với lĩnh vực công việc của mình. Chúng tôi tin rằng kỹ năng, kinh 
                                nghiệm và trình độ của Ông/Bà phù hợp với yêu cầu của vị trí này. 
                            </p>
                            
                            <div class="interview-details">
                                <h3>📅 Thông Tin Lịch Phỏng Vấn</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Ngày giờ:</span>
                                    <span class="detail-value">%s, %s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Địa điểm:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Người phỏng vấn: </span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Vị trí:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                            </div>
                            
                            <div class="requirements">
                                <h4>📋 Vui lòng chuẩn bị:</h4>
                                <ul>
                                    <li>Bản sao CV/hồ sơ và các tài liệu liên quan</li>
                                    <li>CMND/CCCD hoặc Hộ chiếu còn hiệu lực</li>
                                    <li>Portfolio hoặc các mẫu công việc (nếu có)</li>
                                    <li>Đến sớm 10-15 phút trước giờ hẹn</li>
                                </ul>
                            </div>
                            
                            <div class="contact-section">
                                <p>
                                    Nếu ngày giờ này không phù hợp với Ông/Bà, vui lòng thông báo cho chúng tôi sớm 
                                    nhất có thể.  Nếu có câu hỏi, vui lòng liên hệ qua email 
                                    <a href="mailto: csc12005hr@gmail. com">csc12005hr@gmail.com</a> 
                                    hoặc số điện thoại <strong>0963072611</strong>.
                                </p>
                            </div>
                            
                            <p class="closing">
                                Chúng tôi rất mong được gặp Ông/Bà trực tiếp.  Chúc Ông/Bà may mắn! 
                            </p>
                            
                            %s
                        </div>
                        %s
                    </div>
                </body>
                </html>
                """,
                getCommonStyles(),
                getSenderInfo(),
                formattedDate,
                candidateName,
                email,
                candidateName,
                schedule.getPosition().getPositionName(),
                formattedDate,
                schedule.getTimeSlot().getStart().toString(),
                schedule.getLocation(),
                schedule.getInterviewer().getFullName(),
                schedule.getPosition().getPositionName(),
                getSignature(),
                getFooter()
        );
    }

    // 2. XÓA KHỎI DANH SÁCH
    private String buildCandidateRemovedHtml(String candidateName, String email, Schedule schedule, String reason) {
        String formattedDate = schedule.getDate().format(DATE_FORMATTER);

        return String.format("""
                <! DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    %s
                </head>
                <body>
                    <div class="email-container">
                        <div class="content">
                            <h1 class="title" style="color: #d32f2f;">Thông Báo Thay Đổi Lịch Phỏng Vấn</h1>
                            
                            %s
                            
                            <div class="date">%s</div>
                            
                            <div class="recipient-info">
                                <p><strong>Ông/Bà: %s</strong></p>
                                <p>Email: %s</p>
                            </div>
                            
                            <p class="greeting">Kính gửi Ông/Bà %s,</p>
                            
                            <p class="body-text">
                                Thay mặt <span class="company-name">Công ty CSC12005</span>, chúng tôi xin thông báo 
                                rằng lịch phỏng vấn của Ông/Bà cho vị trí <span class="position-highlight">%s</span> 
                                đã được <strong>thay đổi</strong>. 
                            </p>
                            
                            <div class="alert-box">
                                <h3>⚠️ Thông Tin Lịch Đã Bị Thay Đổi</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Ngày giờ cũ:</span>
                                    <span class="detail-value">%s, %s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Địa điểm:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Vị trí:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                            </div>
                            
                            <div class="reason-box">
                                <h4>📝 Lý do thay đổi:</h4>
                                <p>%s</p>
                            </div>
                            
                            <p class="body-text">
                                Chúng tôi xin lỗi vì sự bất tiện này. Chúng tôi sẽ liên hệ lại với Ông/Bà trong thời gian sớm nhất 
                                để sắp xếp lịch phỏng vấn mới (nếu có).
                            </p>
                            
                            <div class="contact-section">
                                <p>
                                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email 
                                    <a href="mailto:csc12005hr@gmail.com">csc12005hr@gmail.com</a> 
                                    hoặc số điện thoại <strong>0963072611</strong>. 
                                </p>
                            </div>
                            
                            <p class="closing">
                                Xin chân thành cảm ơn sự thông cảm và hợp tác của Ông/Bà. 
                            </p>
                            
                            %s
                        </div>
                        %s
                    </div>
                </body>
                </html>
                """,
                getCommonStyles(),
                getSenderInfo(),
                formattedDate,
                candidateName,
                email,
                candidateName,
                schedule.getPosition().getPositionName(),
                formattedDate,
                schedule.getTimeSlot().getStart().toString(),
                schedule.getLocation(),
                schedule.getPosition().getPositionName(),
                reason != null && ! reason.isEmpty() ? reason : "Thay đổi kế hoạch tuyển dụng",
                getSignature(),
                getFooter()
        );
    }

    // 3. HỦY LỊCH PHỎNG VẤN
    private String buildScheduleCancelledHtml(String candidateName, String email, Schedule schedule, String reason) {
        String formattedDate = schedule.getDate().format(DATE_FORMATTER);

        return String.format("""
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    %s
                </head>
                <body>
                    <div class="email-container">
                        <div class="content">
                            <h1 class="title" style="color:  #d32f2f;">Thông Báo Hủy Lịch Phỏng Vấn</h1>
                            
                            %s
                            
                            <div class="date">%s</div>
                            
                            <div class="recipient-info">
                                <p><strong>Ông/Bà: %s</strong></p>
                                <p>Email:  %s</p>
                            </div>
                            
                            <p class="greeting">Kính gửi Ông/Bà %s,</p>
                            
                            <p class="body-text">
                                Thay mặt <span class="company-name">Công ty CSC12005</span>, chúng tôi xin thông báo 
                                rằng buổi phỏng vấn của Ông/Bà cho vị trí <span class="position-highlight">%s</span> 
                                đã được <strong style="color: #d32f2f;">hủy bỏ</strong>.
                            </p>
                            
                            <div class="alert-box" style="border-color: #d32f2f;">
                                <h3>❌ Thông Tin Lịch Đã Bị Hủy</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Ngày giờ: </span>
                                    <span class="detail-value">%s, %s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Địa điểm:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Vị trí: </span>
                                    <span class="detail-value">%s</span>
                                </div>
                            </div>
                            
                            <div class="reason-box">
                                <h4>📝 Lý do hủy:</h4>
                                <p>%s</p>
                            </div>
                            
                            <p class="body-text">
                                Chúng tôi xin lỗi sâu sắc vì sự bất tiện này. Chúng tôi đánh giá cao thời gian và sự quan tâm 
                                của Ông/Bà đối với vị trí tại công ty chúng tôi.
                            </p>
                            
                            <p class="body-text">
                                Hồ sơ của Ông/Bà vẫn được lưu trong hệ thống của chúng tôi và chúng tôi sẽ xem xét 
                                cho các cơ hội phù hợp trong tương lai.
                            </p>
                            
                            <div class="contact-section">
                                <p>
                                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email 
                                    <a href="mailto:csc12005hr@gmail.com">csc12005hr@gmail. com</a> 
                                    hoặc số điện thoại <strong>0963072611</strong>.
                                </p>
                            </div>
                            
                            <p class="closing">
                                Một lần nữa, xin chân thành cảm ơn và mong có cơ hội hợp tác với Ông/Bà trong tương lai.
                            </p>
                            
                            %s
                        </div>
                        %s
                    </div>
                </body>
                </html>
                """,
                getCommonStyles(),
                getSenderInfo(),
                formattedDate,
                candidateName,
                email,
                candidateName,
                schedule. getPosition().getPositionName(),
                formattedDate,
                schedule.getTimeSlot().getStart().toString(),
                schedule.getLocation(),
                schedule. getPosition().getPositionName(),
                reason != null && !reason.isEmpty() ? reason : "Thay đổi kế hoạch tuyển dụng",
                getSignature(),
                getFooter()
        );
    }

    // 4. THÔNG BÁO ĐẠT
    private String buildInterviewPassedHtml(String candidateName, String email, String positionName) {
        String currentDate = java.time.LocalDate.now().format(DATE_FORMATTER);

        return String.format("""
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    %s
                </head>
                <body>
                    <div class="email-container">
                        <div class="content">
                            <h1 class="title" style="color: #4caf50;">🎉 Chúc Mừng! </h1>
                            
                            %s
                            
                            <div class="date">%s</div>
                            
                            <div class="recipient-info" style="border-left-color: #4caf50;">
                                <p><strong>Ông/Bà:  %s</strong></p>
                                <p>Email: %s</p>
                            </div>
                            
                            <p class="greeting">Kính gửi Ông/Bà %s,</p>
                            
                            <p class="body-text">
                                Thay mặt <span class="company-name">Công ty CSC12005</span>, chúng tôi rất vui mừng 
                                thông báo rằng Ông/Bà đã <strong style="color: #4caf50;">vượt qua vòng phỏng vấn</strong> 
                                cho vị trí <span class="position-highlight">%s</span>!
                            </p>
                            
                            <div class="success-box">
                                <h3>✅ Kết Quả Phỏng Vấn</h3>
                                <p style="font-size: 18px; font-weight: 600; color: #4caf50; margin:  20px 0;">
                                    Ông/Bà đã được CHẤP NHẬN
                                </p>
                                <p>Vị trí: <strong>%s</strong></p>
                            </div>
                            
                            <p class="body-text">
                                Chúng tôi rất ấn tượng với kỹ năng, kinh nghiệm và sự nhiệt tình của Ông/Bà trong suốt 
                                quá trình phỏng vấn.  Chúng tôi tin rằng Ông/Bà sẽ là một thành viên có giá trị cho đội ngũ của chúng tôi. 
                            </p>
                            
                            <div class="next-steps">
                                <h4>📌 Các bước tiếp theo:</h4>
                                <ul>
                                    <li>Đội ngũ HR sẽ liên hệ với Ông/Bà trong vòng <strong>2-3 ngày làm việc</strong></li>
                                    <li>Chúng tôi sẽ gửi thư mời làm việc (Offer Letter) chính thức</li>
                                    <li>Thảo luận về ngày bắt đầu làm việc và các thủ tục cần thiết</li>
                                    <li>Cung cấp thông tin về quá trình onboarding</li>
                                </ul>
                            </div>
                            
                            <div class="contact-section" style="background-color: #e8f5e9; border-left-color: #4caf50;">
                                <p>
                                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ qua email 
                                    <a href="mailto:csc12005hr@gmail.com">csc12005hr@gmail.com</a> 
                                    hoặc số điện thoại <strong>0963072611</strong>.
                                </p>
                            </div>
                            
                            <p class="closing">
                                Một lần nữa, xin chúc mừng! Chúng tôi rất mong được chào đón Ông/Bà gia nhập đội ngũ CSC12005.
                            </p>
                            
                            %s
                        </div>
                        %s
                    </div>
                </body>
                </html>
                """,
                getCommonStyles(),
                getSenderInfo(),
                currentDate,
                candidateName,
                email,
                candidateName,
                positionName,
                positionName,
                getSignature(),
                getFooter()
        );
    }
    // 5. CẬP NHẬT LỊCH PHỎNG VẤN
    private String buildScheduleUpdatedHtml(String candidateName, String email, Schedule oldSchedule, Schedule newSchedule) {
        String oldFormattedDate = oldSchedule. getDate().format(DATE_FORMATTER);
        String newFormattedDate = newSchedule.getDate().format(DATE_FORMATTER);
        String currentDate = java.time.LocalDate.now().format(DATE_FORMATTER);

        return String.format("""
            <! DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                %s
            </head>
            <body>
                <div class="email-container">
                    <div class="content">
                        <h1 class="title" style="color: #ff9800;">📝 Thông Báo Cập Nhật Lịch Phỏng Vấn</h1>
                        
                        %s
                        
                        <div class="date">%s</div>
                        
                        <div class="recipient-info" style="border-left-color: #ff9800;">
                            <p><strong>Ông/Bà:  %s</strong></p>
                            <p>Email: %s</p>
                        </div>
                        
                        <p class="greeting">Kính gửi Ông/Bà %s,</p>
                        
                        <p class="body-text">
                            Thay mặt <span class="company-name">Công ty CSC12005</span>, chúng tôi xin thông báo 
                            rằng lịch phỏng vấn của Ông/Bà cho vị trí <span class="position-highlight">%s</span> 
                            đã có <strong style="color: #ff9800;">sự thay đổi</strong>. 
                        </p>
                        
                        <!-- Thông tin cũ -->
                        <div class="old-schedule-box">
                            <h3>❌ Lịch Cũ (Đã Hủy)</h3>
                            <div class="detail-row">
                                <span class="detail-label">Ngày giờ:</span>
                                <span class="detail-value" style="text-decoration: line-through; color: #999;">
                                    %s, %s
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Địa điểm:</span>
                                <span class="detail-value" style="text-decoration: line-through; color: #999;">
                                    %s
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Người phỏng vấn: </span>
                                <span class="detail-value" style="text-decoration: line-through; color: #999;">
                                    %s
                                </span>
                            </div>
                        </div>
                        
                        <!-- Mũi tên chỉ xuống -->
                        <div style="text-align: center; margin:  20px 0; font-size: 32px; color: #ff9800;">
                            ⬇️
                        </div>
                        
                        <!-- Thông tin mới -->
                        <div class="new-schedule-box">
                            <h3>✅ Lịch Mới (Cập Nhật)</h3>
                            <div class="detail-row">
                                <span class="detail-label">Ngày giờ:</span>
                                <span class="detail-value" style="font-weight: 700; color: #4caf50;">
                                    %s, %s
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Địa điểm:</span>
                                <span class="detail-value" style="font-weight:  700; color: #4caf50;">
                                    %s
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Người phỏng vấn:</span>
                                <span class="detail-value" style="font-weight:  700; color: #4caf50;">
                                    %s
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Vị trí:</span>
                                <span class="detail-value" style="font-weight: 700;">
                                    %s
                                </span>
                            </div>
                        </div>
                        
                        <div class="update-notice">
                            <h4>⚠️ Lưu ý quan trọng:</h4>
                            <ul>
                                <li>Vui lòng cập nhật lịch của Ông/Bà theo thông tin mới</li>
                                <li>Đến sớm 10-15 phút trước giờ hẹn mới</li>
                                <li>Mang theo CMND/CCCD và các tài liệu cần thiết</li>
                                <li>Nếu có xung đột về thời gian, vui lòng liên hệ ngay với chúng tôi</li>
                            </ul>
                        </div>
                        
                        <p class="body-text">
                            Chúng tôi xin lỗi vì sự bất tiện này. Sự thay đổi là cần thiết để đảm bảo quá trình 
                            phỏng vấn diễn ra thuận lợi nhất cho cả hai bên.
                        </p>
                        
                        <div class="contact-section" style="background-color: #fff3e0; border-left-color: #ff9800;">
                            <p>
                                Nếu Ông/Bà có bất kỳ thắc mắc nào hoặc không thể tham dự theo lịch mới, 
                                vui lòng liên hệ ngay qua email 
                                <a href="mailto:csc12005hr@gmail.com">csc12005hr@gmail. com</a> 
                                hoặc số điện thoại <strong>0963072611</strong>.
                            </p>
                        </div>
                        
                        <p class="closing">
                            Chúng tôi rất mong được gặp Ông/Bà vào thời gian mới.  Xin cảm ơn sự thông cảm và hợp tác! 
                        </p>
                        
                        %s
                    </div>
                    %s
                </div>
            </body>
            </html>
            """,
                getCommonStyles() + getUpdateStyles(),
                getSenderInfo(),
                currentDate,
                candidateName,
                email,
                candidateName,
                newSchedule.getPosition().getPositionName(),
                // Thông tin cũ
                oldFormattedDate,
                oldSchedule.getTimeSlot().getStart().toString(),
                oldSchedule.getLocation(),
                oldSchedule.getInterviewer().getFullName(),
                // Thông tin mới
                newFormattedDate,
                newSchedule.getTimeSlot().getStart().toString(),
                newSchedule.getLocation(),
                newSchedule.getInterviewer().getFullName(),
                newSchedule.getPosition().getPositionName(),
                getSignature(),
                getFooter()
        );
    }

    // ==================== COMMON HTML COMPONENTS ====================

    private String getCommonStyles() {
        return """
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333333; background-color: #f5f5f5; padding: 20px; }
                    .email-container { max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
                    . content { padding: 50px 60px; }
                    .title { text-align: center; font-size: 28px; font-weight: 700; color: #1a1a5e; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 1px; }
                    .sender-info { margin-bottom: 30px; color: #666; font-size: 14px; line-height: 1.6; }
                    .sender-info strong { color: #333; display: block; margin-bottom: 5px; font-size: 16px; }
                    .date { margin-bottom: 30px; font-size: 14px; color: #666; font-style: italic; }
                    .recipient-info { margin-bottom: 30px; padding:  15px 20px; background-color: #f8f9fa; border-left: 4px solid #ff8c42; border-radius: 4px; }
                    .recipient-info p { margin:  5px 0; font-size: 14px; color: #333; }
                    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 25px; color: #1a1a5e; }
                    .body-text { font-size: 15px; color: #444; margin-bottom: 20px; text-align: justify; }
                    .company-name { font-weight: 700; color: #1a1a5e; }
                    .position-highlight { font-weight: 700; color:  #ff8c42; }
                    .interview-details, .alert-box, .success-box { background:  linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #1a1a5e; border-radius: 8px; padding:  25px; margin:  30px 0; }
                    .interview-details h3, .alert-box h3, .success-box h3 { color: #1a1a5e; font-size: 18px; margin-bottom: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
                    .detail-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
                    . detail-row: last-child { margin-bottom:  0; }
                    . detail-label { font-weight: 700; color: #1a1a5e; min-width: 140px; font-size: 14px; }
                    .detail-value { color: #333; font-size: 14px; flex: 1; }
                    .requirements, .reason-box, .next-steps { background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius:  4px; }
                    .requirements h4, .reason-box h4, .next-steps h4 { color: #1a1a5e; font-size: 16px; margin-bottom: 15px; }
                    .requirements ul, .next-steps ul { list-style:  none; padding:  0; }
                    . requirements li, .next-steps li { padding: 8px 0; padding-left: 25px; position: relative; font-size: 14px; color: #444; }
                    .requirements li: before, .next-steps li:before { content: "▸"; position: absolute; left: 0; color: #ff8c42; font-weight: bold; font-size: 16px; }
                    .contact-section { background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 25px 0; border-radius: 4px; }
                    .contact-section p { margin: 0; font-size: 14px; color: #333; }
                    .contact-section a { color: #1a1a5e; text-decoration: none; font-weight: 700; }
                    .closing { margin-top: 30px; font-size: 15px; color: #444; }
                    .signature { margin-top: 35px; padding-top: 25px; border-top: 2px solid #e0e0e0; }
                    .signature p { margin: 5px 0; font-size:  14px; color: #666; }
                    .signature strong { color: #1a1a5e; font-size: 15px; }
                    .footer { background-color: #1a1a5e; color: white; text-align: center; padding: 25px; font-size: 12px; }
                    .footer p { margin: 5px 0; }
                    @media only screen and (max-width: 600px) {
                        . content { padding: 30px 25px ! important; }
                        .title { font-size: 22px !important; }
                        .detail-row { flex-direction: column; }
                        .detail-label { margin-bottom: 5px; }
                    }
                </style>
                """;
    }
    private String getUpdateStyles() {
        return """
            <style>
                .old-schedule-box {
                    background:  linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
                    border: 2px solid #ef5350;
                    border-radius: 8px;
                    padding: 25px;
                    margin:  20px 0;
                }
                . old-schedule-box h3 {
                    color: #d32f2f;
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                . new-schedule-box {
                    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                    border: 2px solid #66bb6a;
                    border-radius: 8px;
                    padding: 25px;
                    margin: 20px 0;
                    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
                }
                .new-schedule-box h3 {
                    color: #2e7d32;
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .update-notice {
                    background-color: #fff3e0;
                    border-left: 4px solid #ff9800;
                    padding:  20px;
                    margin: 25px 0;
                    border-radius: 4px;
                }
                .update-notice h4 {
                    color: #e65100;
                    font-size: 16px;
                    margin-bottom: 15px;
                }
                .update-notice ul {
                    list-style: none;
                    padding: 0;
                }
                .update-notice li {
                    padding: 8px 0;
                    padding-left: 25px;
                    position: relative;
                    font-size: 14px;
                    color: #444;
                }
                .update-notice li:before {
                    content: "⚡";
                    position: absolute;
                    left: 0;
                    color: #ff9800;
                    font-weight: bold;
                    font-size: 16px;
                }
            </style>
            """;
    }
    private String getSenderInfo() {
        return """
                <div class="sender-info">
                    <strong>CÔNG TY CSC12005</strong>
                    Khu đô thị ĐHQG-HCM, Khu Phố 6<br>
                    Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam<br>
                    Điện thoại: 0963072611<br>
                    Email: csc12005hr@gmail.com
                </div>
                """;
    }

    private String getSignature() {
        return """
                <div class="signature">
                    <p>Xin chân thành cảm ơn. </p>
                    <p style="margin-top: 20px;">Trân trọng,</p>
                    <p><strong>Phòng Nhân Sự</strong></p>
                    <p><strong>Công ty CSC12005</strong></p>
                </div>
                """;
    }

    private String getFooter() {
        return """
                <div class="footer">
                    <p>© 2026 Công ty CSC12005. Bảo lưu mọi quyền.</p>
                    <p>Đây là email tự động.  Vui lòng không trả lời trực tiếp email này.</p>
                </div>
                """;
    }
    @Override
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCandidateCreated(CandidateCreatedEvent candidateCreatedEvent) {
	    List<Candidate> candidates = candidateCreatedEvent.getCandidates();
	    for (Candidate candidate : candidates) {
		    sendInterviewScheduleMail(
				    candidate.getEmail(),
				    candidate.getFullName(),
				    candidateCreatedEvent.getSchedule()
		    );
	    }
    }
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleScheduleUpdated(ScheduleUpdatedSendMailEvent event) {
		List<Candidate> candidates = event.getCandidates();
		for (Candidate candidate : candidates) {
			sendScheduleUpdatedMail(
					candidate.getEmail(),
					candidate.getFullName(),
					event.getOldSchedule(),
					event.getNewSchedule()
			);
		}
	}

	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleCandidateRemovedEmail(CandidateRemoveEmailEvent event) {
		Candidate candidate = event.getCandidate();
		sendCandidateRemovedMail(
				candidate.getEmail(),
				candidate.getFullName(),
				candidate.getSchedule(),
				event.getReason()
		);
	}
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleCancelSchedule(CancelScheduleEvent event) {
		List<Candidate> candidates = event.getCandidates();
		for (Candidate candidate : candidates) {
			sendScheduleCancelledMail(
					candidate.getEmail(),
					candidate.getFullName(),
					event.getSchedule(),
					event.getReason()
			);
		}
	}

}