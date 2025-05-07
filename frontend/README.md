## Run Locally

Clone the entire repository

```bash
  git clone https://github.com/lucasfsn/manage-it
```

Go to the frontend directory

```bash
  cd frontend
```

Create a .env file with the following content:

```properties
  NG_APP_API_URL=          # The base URL of the backend API (e.g., http://localhost:8080/api/v1)
  NG_APP_SOCKET_URL=       # The WebSocket URL for real-time communication (e.g., http://localhost:8080/api/v1/ws)
```

Install dependencies

```bash
  npm install
```

Start frontend:

```bash
  npm start
```
