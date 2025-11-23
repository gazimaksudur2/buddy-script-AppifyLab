import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file) => {
  if (!file) return null;

  // Validate file size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};
