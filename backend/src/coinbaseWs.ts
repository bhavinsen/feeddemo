import WebSocket from "ws";

let ws: WebSocket | null = null; 
let reconnectTimeout: NodeJS.Timeout | null = null;
let data = {};

export function connect(products: string[], socket: any) {
    ws = new WebSocket('wss://ws-feed-public.sandbox.exchange.coinbase.com');

    ws.onopen = () => {
        console.log("Connected to Coinbase WebSocket API");
        // Send the subscription message upon connection.
        const subscribeMessage = {
          type: "subscribe",
          channels: [
            {
              name: "ticker",
              product_ids: products,
            },
          ],
        };
        ws?.send(JSON.stringify(subscribeMessage));
      };

    ws.onmessage = (event: any) => {
        try {
            const message = JSON.parse(event.data.toString());
            if (message.type === "ticker") {
              // @ts-ignore
              data[message.product_id] = message;
              socket.emit('ticker', data)
            } else {
              if(message.type === 'error'){
                socket.emit('ticker-error', message);
              }
              console.log("Received message:", message);
            }
          } catch (err) {
            console.error("Error parsing incoming message:", err);
          }
    }

    ws.onerror = (event: any) => {
        console.error("WebSocket error occurred:", event);
        cleanupAndReconnect();
    };
    ws.onclose = (event: any) => {
        console.warn(
          `WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`
        );
        if (event.code !== 1000) {
          console.log("Attempting to reconnect in 5 seconds...");
          // @ts-ignore
          reconnectTimeout = setTimeout(connect, 5000);
        }
      };
}

function cleanupAndReconnect() {
    if (ws) {
      // Remove event handlers.
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1001, "Reconnecting"); // Code 1001: Going Away.
      }
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    // @ts-ignore
    reconnectTimeout = setTimeout(connect, 5000);
  }

export function shutdown(products: string[], socket: any) {
    console.log("Shutting down gracefully...");
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send an unsubscribe message if needed before closing.
      const unsubscribeMessage = {
        type: "unsubscribe",
        channels: [
          {
            name: "ticker",
            product_ids: products,
          },
        ],
      };
      ws.send(JSON.stringify(unsubscribeMessage));
      ws.close(1000, "Process terminated");
    }
    //process.exit(0);
  }