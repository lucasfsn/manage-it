import axios from 'axios';
import { baseUrl } from '../../playwright.config';

interface AuthenticationResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

async function authenticateUser(email: string, password: string): Promise<AuthenticationResponse> {

  const response = await axios.post<AuthenticationResponse>(`${baseUrl}/auth/authenticate`, {
    email,
    password
  });

  return response.data;
}

export { authenticateUser };
