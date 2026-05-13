package com.deus.restaurant.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/orders/update")
    @SendTo("/topic/orders")
    public String orderUpdate(@Payload String payload) {
        return payload;
    }

    @MessageMapping("/stations/kitchen")
    @SendTo("/topic/stations/kitchen")
    public String kitchenUpdate(@Payload String payload) {
        return payload;
    }

    @MessageMapping("/stations/bar")
    @SendTo("/topic/stations/bar")
    public String barUpdate(@Payload String payload) {
        return payload;
    }
}

