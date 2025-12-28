package com.csc12005.hr.Service.AuthenticationService;

import java.time.LocalDateTime;

public interface ITokenCacheService {


	void invalidateToken(String tokenId, LocalDateTime expirationTime);

	void invalidateTokens(String accessTokenId, String refreshTokenId, LocalDateTime expirationTime);

	boolean isTokenInvalidated(String tokenId);

	void removeInvalidatedToken(String tokenId);

	void clearAllInvalidatedTokens();
}
