import axios from 'axios';
import { baseUrl } from '../../playwright.config';

interface AuthenticationData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

interface AuthenticationResponse {
  code: number;
  message: string;
  timestamp: string;
  data: AuthenticationData;
}

async function authenticateUser(email: string, password: string): Promise<AuthenticationData> {
  const response = await axios.post<AuthenticationResponse>(`${baseUrl}/auth/authenticate`, {
    email,
    password
  });
  
  return response.data.data;
}

export { authenticateUser };
