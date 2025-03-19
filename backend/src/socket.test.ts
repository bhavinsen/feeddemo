import { setupSocket } from './socket';
import { Server } from 'socket.io';
import http from 'http';
import { connect, shutdown } from './coinbaseWs';

// Mock the dependencies
jest.mock('socket.io');
jest.mock('./coinbaseWs', () => ({
  connect: jest.fn(),
  shutdown: jest.fn(),
}));

describe('setupSocket', () => {
  let mockHttpServer: http.Server;
  let mockIoInstance: any;
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock HTTP server
    mockHttpServer = {} as http.Server;

    // Mock the Socket.IO Server instance
    mockIoInstance = {
      on: jest.fn(),
    };
    (Server as unknown as jest.Mock).mockImplementation(() => mockIoInstance);

    // Mock a socket instance
    mockSocket = {
      on: jest.fn(),
    };
  });

  it('should handle subscribe events', () => {
    setupSocket(mockHttpServer);

    // Simulate a connection event
    const connectionHandler = mockIoInstance.on.mock.calls[0][1]; // First call, second argument
    connectionHandler(mockSocket);

    // Simulate a subscribe event
    const subscribeHandler = mockSocket.on.mock.calls[0][1]; // First call, second argument
    const testMessage = { product_ids: ['BTC-USD'] };
    subscribeHandler(testMessage);

    // Verify that the connect function is called with the correct arguments
    expect(connect).toHaveBeenCalledWith(testMessage, mockSocket);
  });

  it('should handle unsubscribe events', () => {
    setupSocket(mockHttpServer);

    // Simulate a connection event
    const connectionHandler = mockIoInstance.on.mock.calls[0][1]; // First call, second argument
    connectionHandler(mockSocket);

    // Simulate an unsubscribe event
    const unsubscribeHandler = mockSocket.on.mock.calls[1][1]; // Second call, second argument
    const testProduct = 'BTC-USD';
    unsubscribeHandler(testProduct);

    // Verify that the shutdown function is called with the correct arguments
    expect(shutdown).toHaveBeenCalledWith(testProduct, mockSocket);
  });

//   it('should log when a user disconnects', () => {
//     const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

//     setupSocket(mockHttpServer);

//     const connectionHandler = mockIoInstance.on.mock.calls[0][1]; // First call, second argument
//     connectionHandler(mockSocket);

//     const disconnectHandler = mockSocket.on.mock.calls[2][1]; // Third call, second argument
//     disconnectHandler();

//     expect(consoleSpy).toHaveBeenCalledWith('a user disconnected');

//     consoleSpy.mockRestore();
//   });
});