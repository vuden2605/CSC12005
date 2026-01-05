package com.csc12005.hr.Service.MailService.impl;

import com.csc12005.hr.Entity.Schedule;
import com.csc12005.hr.Service.MailService.IMailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
@Slf4j
public class MailService implements IMailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendInterviewScheduleMail(
            String toEmail,
            String candidateName,
            Schedule schedule
    ) {
        try {
            // ---- CÁCH 1: text plain (hiện tại) ----
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Interview Invitation");
            message.setText(buildContent(candidateName, schedule));
            mailSender.send(message);

            // ---- CÁCH 2: HTML mail (nếu muốn) ----
            // sendHtmlMail(toEmail, "Interview Invitation", buildHtmlContent(candidateName, schedule));

        } catch (Exception e) {
            log.error("Send mail failed to {}", toEmail, e);
        }
    }

    private String buildContent(String name, Schedule schedule) {
        return String.format("""
                Dear %s,

                Interview details:
                - Time slot: %s
                - Location: %s
                - Interviewer: %s

                HR Department
                """,
                name,
                schedule.getTimeSlot(),
                schedule.getLocation(),
                schedule.getInterviewer().getFullName()
        );
    }

    // ----- thêm phương thức gửi HTML mail -----
    public void sendHtmlMail(String to, String subject, String htmlContent) throws MessagingException, jakarta.mail.MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML

        mailSender.send(message);
    }

    private String buildHtmlContent(String name, Schedule schedule) {
        return String.format("""
                <html>
                <body>
                    <p>Dear %s,</p>
                    <p>Interview details:</p>
                    <ul>
                        <li>Time slot: %s</li>
                        <li>Location: %s</li>
                        <li>Interviewer: %s</li>
                    </ul>
                    <p>HR Department</p>
                </body>
                </html>
                """,
                name,
                schedule.getTimeSlot(),
                schedule.getLocation(),
                schedule.getInterviewer().getFullName()
        );
    }
}
