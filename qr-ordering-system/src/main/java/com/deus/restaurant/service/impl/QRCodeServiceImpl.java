package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.QRValidationRequest;
import com.deus.restaurant.dto.response.SessionResponse;
import com.deus.restaurant.exception.BadRequestException;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.SessionMapper;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.TableSession;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.TableSessionRepository;
import com.deus.restaurant.service.QRCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QRCodeServiceImpl implements QRCodeService {

    private static final SecureRandom RNG = new SecureRandom();
    private static final char[] TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();

    private final RestaurantTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final SessionMapper sessionMapper;

    public QRCodeServiceImpl(
            RestaurantTableRepository tableRepository,
            TableSessionRepository sessionRepository,
            SessionMapper sessionMapper
    ) {
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.sessionMapper = sessionMapper;
    }

    @Override
    @Transactional
    public SessionResponse validateQRCode(QRValidationRequest request) {
        if (request == null) throw new BadRequestException("Request is required");
        RestaurantTable table = tableRepository.findByTableNumber(request.getTableNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        if (!table.getQrCodeToken().equals(request.getToken())) {
            throw new BadRequestException("Invalid QR token");
        }
        if (Boolean.FALSE.equals(table.getIsActive())) {
            throw new BadRequestException("Table is inactive");
        }

        TableSession session = sessionRepository.findByTableAndIsActiveTrue(table)
                .orElseGet(() -> sessionRepository.save(TableSession.builder()
                        .table(table)
                        .sessionToken(generateQRToken())
                        .customerCount(1)
                        .isActive(true)
                        .startedAt(LocalDateTime.now())
                        .build()));

        return sessionMapper.toResponse(session);
    }

    @Override
    public String generateQRToken() {
        int len = 32;
        char[] out = new char[len];
        for (int i = 0; i < len; i++) {
            out[i] = TOKEN_CHARS[RNG.nextInt(TOKEN_CHARS.length)];
        }
        return new String(out);
    }

    @Override
    public String generateQRImageUrl(String tableNumber, String token) {
        // Encode a simple payload the frontend can parse.
        String payload = ("tableNumber=" + tableNumber + "&token=" + token);
        byte[] png = generateQrPng(payload);
        String b64 = Base64.getEncoder().encodeToString(png);
        return "data:image/png;base64," + b64;
    }

    private byte[] generateQrPng(String payload) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(payload, BarcodeFormat.QR_CODE, 300, 300);
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
                return baos.toByteArray();
            }
        } catch (WriterException | java.io.IOException e) {
            throw new BadRequestException("Failed to generate QR code image");
        }
    }
}

