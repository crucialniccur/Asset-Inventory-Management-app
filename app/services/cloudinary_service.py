import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file):
    try:
        result = cloudinary.uploader.upload(file)
        return result["secure_url"]
    except Exception as e:
        print("❌ Cloudinary upload failed:", e)
        raise
