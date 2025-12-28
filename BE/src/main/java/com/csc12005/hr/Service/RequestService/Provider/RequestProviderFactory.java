package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.Enums.RequestType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class RequestProviderFactory {
	private final Map<RequestType, IRequestProvider> providerMap;
	public RequestProviderFactory (List<IRequestProvider> providers) {
		this.providerMap = providers.stream()
				.collect(Collectors.toMap(
						IRequestProvider::getRequestType,
						Function.identity()
				));
	}
	public IRequestProvider getProvider(RequestType requestType) {
		return providerMap.get(requestType);
	}

}
