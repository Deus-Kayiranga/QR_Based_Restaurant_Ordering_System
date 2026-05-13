package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.TableRequest;
import com.deus.restaurant.dto.response.TableResponse;
import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.TableMapper;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.service.QRCodeService;
import com.deus.restaurant.service.TableService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TableServiceImpl implements TableService {

    private final RestaurantTableRepository tableRepository;
    private final QRCodeService qrCodeService;
    private final TableMapper tableMapper;

    public TableServiceImpl(RestaurantTableRepository tableRepository, QRCodeService qrCodeService, TableMapper tableMapper) {
        this.tableRepository = tableRepository;
        this.qrCodeService = qrCodeService;
        this.tableMapper = tableMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TableResponse> getAllTables() {
        return tableRepository.findAll().stream().map(tableMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TableResponse getTableById(Long id) {
        return tableMapper.toResponse(tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public TableResponse getTableByNumber(String number) {
        return tableMapper.toResponse(tableRepository.findByTableNumber(number).orElseThrow(() -> new ResourceNotFoundException("Table not found")));
    }

    @Override
    @Transactional
    public TableResponse createTable(TableRequest request) {
        String token = qrCodeService.generateQRToken();
        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(request.getTableNumber().trim())
                .seatingCapacity(request.getSeatingCapacity())
                .section(request.getSection())
                .status(TableStatus.AVAILABLE)
                .isActive(true)
                .qrCodeToken(token)
                .build();
        table.setQrCodeImageUrl(qrCodeService.generateQRImageUrl(table.getTableNumber(), token));
        return tableMapper.toResponse(tableRepository.save(table));
    }

    @Override
    @Transactional
    public TableResponse updateTable(Long id, TableRequest request) {
        RestaurantTable t = tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        t.setTableNumber(request.getTableNumber().trim());
        t.setSeatingCapacity(request.getSeatingCapacity());
        t.setSection(request.getSection());
        return tableMapper.toResponse(tableRepository.save(t));
    }

    @Override
    @Transactional
    public void updateTableStatus(Long id, TableStatus status) {
        RestaurantTable t = tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        t.setStatus(status);
        tableRepository.save(t);
    }

    @Override
    @Transactional
    public void deleteTable(Long id) {
        RestaurantTable t = tableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        t.setIsActive(false);
        t.setStatus(TableStatus.BLOCKED);
        tableRepository.save(t);
    }

    @Override
    @Transactional
    public String generateQRCode(Long tableId) {
        RestaurantTable t = tableRepository.findById(tableId).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        String token = qrCodeService.generateQRToken();
        t.setQrCodeToken(token);
        String image = qrCodeService.generateQRImageUrl(t.getTableNumber(), token);
        t.setQrCodeImageUrl(image);
        tableRepository.save(t);
        return image;
    }
}

