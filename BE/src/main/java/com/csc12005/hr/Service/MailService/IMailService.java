package com.csc12005.hr.Service.MailService;

import com.csc12005.hr.Entity.Schedule;

public interface IMailService {
    public void sendInterviewScheduleMail(
            String toEmail,
            String candidateName,
            Schedule schedule
    );
    void sendCandidateRemovedMail(String toEmail, String candidateName, Schedule schedule, String reason);

    void sendScheduleCancelledMail(String toEmail, String candidateName, Schedule schedule, String reason);

    void sendInterviewPassedMail(String toEmail, String candidateName, String positionName);
    void sendScheduleUpdatedMail(String toEmail, String candidateName, Schedule oldSchedule, Schedule newSchedule);

}
