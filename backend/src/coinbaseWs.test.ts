// ticker.test.ts
import WebSocket from "ws";
import { connect, shutdown } from "./coinbaseWs";
import WS from 'jest-websocket-mock';


jest.mock("ws");

const mockProducts = ["BTC-USD", "ETH-USD"];
const mockSocket = { emit: jest.fn() } as any;
let data:any = null;
describe("WebSocket Client", () => {
  let server = new WS('wss://ws-feed-public.sandbox.exchange.coinbase.com');
  let client: WebSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    data = {}; // Reset shared data object
  });

  afterEach(() => {
    if (server) {
      server.close();
    }
    jest.useRealTimers();
  });

  describe("connect()", () => {
    test("should send subscribe message on open", () => {
      connect(mockProducts, mockSocket);
      const mockWsInstance = (WebSocket as any).mock.instances[0];
      
      mockWsInstance.onopen();
      expect(mockWsInstance.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: "subscribe",
          channels: [{ name: "ticker", product_ids: mockProducts }],
        })
      );
    });
  });

  describe("Message Handling", () => {

    test("should emit error for error messages", () => {
      connect(mockProducts, mockSocket);
      const mockWsInstance = (WebSocket as any).mock.instances[0];
      const errorMessage = { type: "error", message: "Invalid subscription" };

      mockWsInstance.onmessage({ data: JSON.stringify(errorMessage) });
      expect(mockSocket.emit).toHaveBeenCalledWith("ticker-error", errorMessage);
    });
  });

  describe("Reconnection Logic", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    test("should attempt reconnect on error", () => {
      connect(mockProducts, mockSocket);
      const mockWsInstance = (WebSocket as any).mock.instances[0];

      mockWsInstance.onerror(new Error("Test error"));
      jest.advanceTimersByTime(5000);

      expect(WebSocket).toHaveBeenCalledTimes(2);
    });
  });

  describe("shutdown()", () => {
    test("should send unsubscribe and close connection", () => {
      connect(mockProducts, mockSocket);
      const mockWsInstance = (WebSocket as any).mock.instances[0];

      shutdown(mockProducts, mockSocket);
      expect(mockWsInstance.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: "unsubscribe",
          channels: [{ name: "ticker", product_ids: mockProducts }],
        })
      );
      expect(mockWsInstance.close).toHaveBeenCalledWith(1000, "Process terminated");
    });
  });
});