package com.csc12005.hr.Service.AuthenticationService.impl;

import com.csc12005.hr.Service.AuthenticationService.ITokenCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenCacheService implements ITokenCacheService {
	private final CacheManager cacheManager;
	@Override
	public void invalidateToken(String tokenId, LocalDateTime expirationTime) {
		try{
			Cache cache = cacheManager.getCache("auth.invalidatedTokens");
			if(cache != null) {
				cache.put(tokenId, expirationTime);
				log.debug("Token invalidated in cache: {}", tokenId);
			}
			else {
				log.warn("Invalidated tokens cache not found, token invalidation may not work properly");
			}
		}
		catch (Exception e){
			log.error("Error invalidating token in cache: {}", tokenId, e);
		}
	}

	@Override
	public void invalidateTokens(String accessTokenId, String refreshTokenId, LocalDateTime expirationTime) {
		invalidateToken(accessTokenId, expirationTime);
		if (refreshTokenId != null && !refreshTokenId.equals(accessTokenId)) {
			invalidateToken(refreshTokenId, expirationTime);
		}
	}

	@Override
	public boolean isTokenInvalidated(String tokenId) {
		try{
			Cache cache = cacheManager.getCache("auth.invalidatedTokens");
			if(cache != null) {
				Cache.ValueWrapper valueWrapper = cache.get(tokenId);
				boolean isInvalidated = valueWrapper != null;
				log.debug("Token invalidation check for {}: {}", tokenId, isInvalidated);
				return isInvalidated;
			}
			else {
				log.warn("Invalidated tokens cache not found, token invalidation check may not work properly");
				return false;
			}
		}
		catch (Exception e) {
			log.error("Failed to check token invalidation status for: {}", tokenId, e);
			return false;
		}
	}
	@Override
	public void removeInvalidatedToken(String tokenId) {
		try {
			Cache cache = cacheManager.getCache("auth.invalidatedTokens");
			if (cache != null) {
				cache.evict(tokenId);
				log.debug("Token removed from invalidation cache: {}", tokenId);
			}
		} catch (Exception e) {
			log.error("Failed to remove token from invalidation cache: {}", tokenId, e);
		}
	}

	@Override
	public void clearAllInvalidatedTokens() {

	}
}
