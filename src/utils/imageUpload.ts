import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param path - The storage path (e.g., 'logos', 'team-photos')
 * @param fileName - The filename to use
 * @returns Promise<UploadResult>
 */
export const uploadImage = async (
  file: File, 
  path: string, 
  fileName: string
): Promise<UploadResult> => {
  try {
    console.log('📤 Starting image upload:', { fileName, path, fileSize: file.size });
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }
    
    // Create storage reference
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('✅ File uploaded successfully:', snapshot.metadata.name);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 Download URL generated:', downloadURL);
    
    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

/**
 * Generate a unique filename for uploads
 * @param originalName - Original filename
 * @param prefix - Optional prefix
 * @returns string
 */
export const generateImageFileName = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
  
  const fileName = `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${randomString}.${extension}`;
  return fileName;
};

/**
 * Upload a logo image for a startup
 * @param file - The logo image file
 * @param startupName - The startup name for the filename
 * @returns Promise<UploadResult>
 */
export const uploadStartupLogo = async (file: File, startupName: string): Promise<UploadResult> => {
  const fileName = generateImageFileName(file.name, startupName.toLowerCase().replace(/\s+/g, '_'));
  return uploadImage(file, 'startup-logos', fileName);
};

/**
 * Upload a team member photo
 * @param file - The team member photo file
 * @param memberName - The team member name for the filename
 * @returns Promise<UploadResult>
 */
export const uploadTeamPhoto = async (file: File, memberName: string): Promise<UploadResult> => {
  const fileName = generateImageFileName(file.name, memberName.toLowerCase().replace(/\s+/g, '_'));
  return uploadImage(file, 'team-photos', fileName);
}; 