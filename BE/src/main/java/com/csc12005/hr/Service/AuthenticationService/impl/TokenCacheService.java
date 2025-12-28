package com.csc12005.hr.Service.AuthenticationService.impl;

import com.csc12005.hr.Service.AuthenticationService.ITokenCacheService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TokenCacheService implements ITokenCacheService {
	@Override
	public void invalidateToken(String tokenId, LocalDateTime expirationTime) {

	}

	@Override
	public void invalidateTokens(String accessTokenId, String refreshTokenId, LocalDateTime expirationTime) {

	}

	@Override
	public boolean isTokenInvalidated(String tokenId) {
		return false;
	}

	@Override
	public void removeInvalidatedToken(String tokenId) {

	}

	@Override
	public void clearAllInvalidatedTokens() {

	}
}
