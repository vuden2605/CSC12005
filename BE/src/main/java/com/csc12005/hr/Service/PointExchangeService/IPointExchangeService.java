package com.csc12005.hr.Service.PointExchangeService;

import com.csc12005.hr.DTO.Request.PointExchangeRequest;
import com.csc12005.hr.DTO.Request.UpdatePointExchangeStatusRequest;
import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import org.springframework.stereotype.Service;

@Service
public interface IPointExchangeService {
	PointExchangeResponse requestExchangePoints(PointExchangeRequest request);
	PointExchangeResponse updatePointExchangeStatus(
			Long exchangeId,
			UpdatePointExchangeStatusRequest request
	);
}
