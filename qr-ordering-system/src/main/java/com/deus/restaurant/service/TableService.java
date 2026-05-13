package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.TableRequest;
import com.deus.restaurant.dto.response.TableResponse;
import com.deus.restaurant.enums.TableStatus;
import java.util.List;

public interface TableService {
    List<TableResponse> getAllTables();

    TableResponse getTableById(Long id);

    TableResponse getTableByNumber(String number);

    TableResponse createTable(TableRequest request);

    TableResponse updateTable(Long id, TableRequest request);

    void updateTableStatus(Long id, TableStatus status);

    void deleteTable(Long id);

    String generateQRCode(Long tableId);
}

