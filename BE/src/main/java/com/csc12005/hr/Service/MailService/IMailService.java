package com.csc12005.hr.Service.MailService;

import com.csc12005.hr.Entity.Schedule;

public interface IMailService {
    public void sendInterviewScheduleMail(
            String toEmail,
            String candidateName,
            Schedule schedule
    );
}
