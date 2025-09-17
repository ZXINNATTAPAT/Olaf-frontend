/**
 * CloudinaryService Usage Examples
 * ตัวอย่างการใช้งาน CloudinaryService ที่ปรับปรุงแล้ว
 */

import { 
  getImageUrl, 
  getOptimizedImageUrl, 
  getResponsiveImageUrls,
  IMAGE_TRANSFORMATIONS 
} from './CloudinaryService';

// ตัวอย่างการใช้งานพื้นฐาน
export const basicUsageExamples = () => {
  const originalImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 1. ใช้ predefined transformations
  const feedImage = getImageUrl(originalImageUrl, "FEED_SMALL"); // 400x250, optimized
  const viewImage = getImageUrl(originalImageUrl, "VIEW_MAIN");   // 800x600, good quality
  const profileImage = getImageUrl(originalImageUrl, "PROFILE_THUMB"); // 150x150, low quality
  
  console.log("Feed Image:", feedImage);
  console.log("View Image:", viewImage);
  console.log("Profile Image:", profileImage);
  
  return { feedImage, viewImage, profileImage };
};

// ตัวอย่างการใช้งาน custom optimization
export const customOptimizationExamples = () => {
  const originalImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 2. Custom optimization สำหรับการใช้งานเฉพาะ
  const smallThumbnail = getOptimizedImageUrl(originalImageUrl, {
    width: 100,
    height: 100,
    quality: 'auto:low',
    format: 'webp', // เปลี่ยนเป็น WebP format
    crop: 'fill',
    gravity: 'face' // เน้นที่ใบหน้า
  });
  
  const bannerImage = getOptimizedImageUrl(originalImageUrl, {
    width: 1200,
    height: 300,
    quality: 'auto:good',
    format: 'auto',
    crop: 'fill',
    gravity: 'center'
  });
  
  const lightweightImage = getOptimizedImageUrl(originalImageUrl, {
    width: 300,
    height: 200,
    quality: 'auto:low',
    format: 'webp' // WebP มีขนาดเล็กลงกว่า JPEG
  });
  
  console.log("Small Thumbnail:", smallThumbnail);
  console.log("Banner Image:", bannerImage);
  console.log("Lightweight Image:", lightweightImage);
  
  return { smallThumbnail, bannerImage, lightweightImage };
};

// ตัวอย่างการใช้งาน responsive images
export const responsiveImageExamples = () => {
  const originalImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 3. Responsive images สำหรับหน้าจอขนาดต่างๆ
  const responsiveUrls = getResponsiveImageUrls(originalImageUrl);
  
  console.log("Mobile (300x200):", responsiveUrls.mobile);
  console.log("Tablet (500x350):", responsiveUrls.tablet);
  console.log("Desktop (800x600):", responsiveUrls.desktop);
  console.log("Large (1200x800):", responsiveUrls.large);
  
  return responsiveUrls;
};

// ตัวอย่างการใช้งานใน React Component
export const ReactComponentExample = () => {
  const originalImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 4. ใช้ใน React component
  const imageProps = {
    src: getImageUrl(originalImageUrl, "FEED_SMALL"),
    alt: "Sample Image",
    loading: "lazy", // Lazy loading
    style: {
      width: "100%",
      height: "250px",
      objectFit: "cover"
    }
  };
  
  return imageProps;
};

// ตัวอย่างการจัดการ error และ fallback
export const errorHandlingExample = () => {
  const invalidImageUrl = "";
  const validImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 5. Error handling
  const safeImageUrl = (url) => {
    if (!url || url.trim() === "") {
      return getImageUrl(null, "DEFAULT"); // ใช้ default image
    }
    return getImageUrl(url, "FEED_SMALL");
  };
  
  const fallbackImage = safeImageUrl(invalidImageUrl);
  const normalImage = safeImageUrl(validImageUrl);
  
  console.log("Fallback Image:", fallbackImage);
  console.log("Normal Image:", normalImage);
  
  return { fallbackImage, normalImage };
};

// ตัวอย่างการใช้งานใน production
export const productionUsageExample = () => {
  const originalImageUrl = "https://olaf-backend.onrender.com/media/posts/images/sample.jpg";
  
  // 6. Production-ready configuration
  const productionConfig = {
    // สำหรับ Feed page - เน้นความเร็วในการโหลด
    feedImage: getImageUrl(originalImageUrl, "FEED_SMALL"),
    
    // สำหรับ View page - เน้นคุณภาพ
    viewImage: getImageUrl(originalImageUrl, "VIEW_MAIN"),
    
    // สำหรับ Profile page - เน้นขนาดเล็ก
    profileImage: getImageUrl(originalImageUrl, "PROFILE_THUMB"),
    
    // สำหรับ Edit page - เน้นความสมดุล
    editImage: getImageUrl(originalImageUrl, "EDIT_PREVIEW")
  };
  
  return productionConfig;
};

export default {
  basicUsageExamples,
  customOptimizationExamples,
  responsiveImageExamples,
  ReactComponentExample,
  errorHandlingExample,
  productionUsageExample
};
