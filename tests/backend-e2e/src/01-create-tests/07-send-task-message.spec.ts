import { test, expect } from '../fixtures/project-data';
import { authenticateUser } from '../helpers/auth';
import { WebSocket } from 'ws';

let token: string;
const baseUrl = 'ws://localhost:8080/api/v1/ws';

test.beforeAll(async () => {
  const authenticationResponse = await authenticateUser('jan.kowalski@mail.com', '1qazXSW@');
  token = authenticationResponse.accessToken;;
});

test('should send message to task chat', async ({ taskId }) => {
  const messageContent = 'Test message for task chat';
  
  const ws = new WebSocket(baseUrl+`?token=${encodeURIComponent(`Bearer ${token}`)}`);
  
  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });

  const subscribeFrame = `CONNECT\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\x00`;
  ws.send(subscribeFrame);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const subscribeMessage = `SUBSCRIBE\nid:sub-0\ndestination:/join/tasks/${taskId}\n\n\x00`;
  ws.send(subscribeMessage);

  const receivedMessages: any[] = [];
  ws.on('message', (data) => {
    const message = data.toString();
    if (message.includes('MESSAGE')) {
      receivedMessages.push(message);
    }
  });

  const sendMessage = `SEND\ndestination:/send/tasks/${taskId}\ncontent-type:application/json\n\n${JSON.stringify({
    token: token,
    content: messageContent
  })}\x00`;

  ws.send(sendMessage);

  await new Promise(resolve => setTimeout(resolve, 2000));

  expect(receivedMessages.length).toBeGreaterThan(0);
  expect(receivedMessages[0]).toContain(messageContent);

  ws.close();
});
