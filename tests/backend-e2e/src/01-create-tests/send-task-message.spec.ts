import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';

import { WebSocket } from 'ws';

let token: string;
let ws: WebSocket;
const baseUrl = 'ws://localhost:8080/api/v1/ws';

test.beforeAll(async () => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.token;
});

test('should connect to the task chat', async ({ taskId }) => {
  const wsUrl = baseUrl + `/tasks/${taskId}`;
  ws = new WebSocket(wsUrl);

  ws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      const message = {
        token: token,
        content: 'Hello, task chat!',
      };
      ws.send(JSON.stringify(message));
    });
  
    ws.addEventListener('message', (event) => {
      const receivedMessage = JSON.parse(event.data.toString());
      expect(receivedMessage.content).toBe('Hello, task chat!');
      ws.close();
    });
  
    ws.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });
  
    ws.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    });
});