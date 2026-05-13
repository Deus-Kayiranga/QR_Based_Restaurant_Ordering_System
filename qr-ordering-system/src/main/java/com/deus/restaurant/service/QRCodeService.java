package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.QRValidationRequest;
import com.deus.restaurant.dto.response.SessionResponse;

public interface QRCodeService {
    SessionResponse validateQRCode(QRValidationRequest request);

    String generateQRToken();

    String generateQRImageUrl(String tableNumber, String token);
}

