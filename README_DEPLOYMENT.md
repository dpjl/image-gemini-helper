
# Deployment Guide for React + FastAPI Application

## Building the React App

1. Build the React app:
   ```
   npm run build
   ```
   This will create a `dist` folder with the built application.

## Deploying with FastAPI

1. Copy the entire `dist` folder to your FastAPI server.

2. Install required Python packages:
   ```
   pip install fastapi uvicorn aiofiles
   ```

3. Configure your FastAPI server to serve the React app:
   - See the `fastapi_server_example.py` file for a reference implementation.
   - Note that proper MIME type handling is critical for modern JavaScript modules.
   - The example ensures JavaScript modules are served with the correct MIME type.

4. Run your FastAPI server:
   ```
   python fastapi_server_example.py
   ```
   
   Or with uvicorn directly:
   ```
   uvicorn fastapi_server_example:app --host 0.0.0.0 --port 5000
   ```

## Environment Configuration

Create a `.env` file in your React project during development:

```
VITE_API_BASE_URL=http://localhost:5000
```

For production, you can either:
1. Use relative paths (recommended when API and frontend are served from same server):
   ```
   VITE_API_BASE_URL=
   ```

2. Or specify the full URL when hosted separately:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

## Troubleshooting

If you encounter MIME type errors in the browser console:
1. Verify that your FastAPI server is correctly serving the assets with proper MIME types.
2. Check that all JavaScript files are being served with `Content-Type: application/javascript` or `Content-Type: text/javascript`.
3. For module scripts, modern browsers enforce strict MIME type checking.
