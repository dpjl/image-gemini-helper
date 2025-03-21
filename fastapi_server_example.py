
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
@app.get("/images")
async def get_images(directory: str) -> List[dict]:
    # Your logic to fetch images from directory
    # This is a placeholder - replace with your actual image fetching logic
    return [
        {"id": "1", "src": "/sample-images/image1.jpg", "alt": "Sample Image 1", "directory": directory},
        {"id": "2", "src": "/sample-images/image2.jpg", "alt": "Sample Image 2", "directory": directory}
    ]

@app.delete("/images")
async def delete_images(request: Request) -> dict:
    data = await request.json()
    image_ids = data.get("imageIds", [])
    # Your logic to delete images
    return {"success": True, "message": f"Deleted {len(image_ids)} images"}

# First handle direct '/index.html' requests
@app.get("/index.html")
async def serve_index_explicit():
    return FileResponse("dist/index.html")

# Mount static files with correct MIME types
# This is crucial for modern JavaScript modules
app.mount("/assets", StaticFiles(directory="dist/assets", html=False), name="assets")

# For other static files in the root like favicon, etc.
# Note: We're excluding the mounting of the root directory to avoid conflicts
# with our specific routes
app.mount("/", StaticFiles(directory="dist", html=False), name="static")

# Special catch-all route for client-side routing
# This must come after all API routes and static file mounts
@app.get("/{full_path:path}")
async def serve_index(full_path: str):
    # Skip API paths to prevent this catch-all from intercepting API requests
    if full_path.startswith("images"):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    
    # Handle direct requests to index.html (although we have an explicit route above)
    if full_path == "index.html":
        return FileResponse("dist/index.html")
        
    # For all frontend routes, serve the index.html
    return FileResponse("dist/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
