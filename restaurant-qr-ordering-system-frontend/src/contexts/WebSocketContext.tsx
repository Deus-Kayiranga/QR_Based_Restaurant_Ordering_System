import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import type { Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { emitWsNotification } from './wsEvents';
import type { UserRole } from '../types';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (destination: string, body: any) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  const connect = useCallback(() => {
    if (!isAuthenticated || clientRef.current?.active) return;

    const socket = new SockJS('/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: () => {},       // disable verbose debug logs
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log('[WS] Connected');

      if (user) {
        // Personal notification queue
        client.subscribe(`/user/${user.userId}/queue/notifications`, (message: Message) => {
          try {
            const payload = JSON.parse(message.body);
            addNotification(payload);
            emitWsNotification({ title: payload.title, message: payload.message, topic: 'personal' });
          } catch {}
        });

        // Role based topics
        const roleTopicMap: Record<UserRole, string[]> = {
          SUPER_ADMIN: ['/topic/orders', '/topic/payments', '/topic/stations/kitchen', '/topic/stations/bar'],
          MANAGER: ['/topic/orders', '/topic/payments', '/topic/stations/kitchen', '/topic/stations/bar'],
          KITCHEN_STAFF: ['/topic/stations/kitchen', '/topic/orders'],
          BAR_STAFF: ['/topic/stations/bar', '/topic/orders'],
          WAITER: ['/topic/orders'],
          CASHIER: ['/topic/payments', '/topic/orders'],
        };

        const topics = roleTopicMap[user.role] || [];
        topics.forEach((topic) => {
          client.subscribe(topic, (message: Message) => {
            try {
              const payload = JSON.parse(message.body);
              // Create a friendly notification
              const notification = {
                notificationId: Date.now(),
                type: topic.includes('payment') ? 'PAYMENT' : 'ORDER',
                title: payload.title || (topic.includes('payment') ? 'Payment Received' : 'New Order Update'),
                message: payload.message || JSON.stringify(payload),
                isRead: false,
                createdAt: new Date().toISOString(),
              };
              addNotification(notification);
              emitWsNotification({ title: notification.title, message: notification.message, topic });
            } catch {}
          });
        });
      }
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      console.error('STOMP details:', frame.body);
    };

    client.activate();
    clientRef.current = client;
  }, [user, isAuthenticated, addNotification]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isAuthenticated, connect, disconnect]);

  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
