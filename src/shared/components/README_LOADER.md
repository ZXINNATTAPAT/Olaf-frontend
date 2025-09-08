# Loader Provider & Components

## 🎯 Overview
ระบบ Loader Provider ที่ให้การจัดการ loading state ทั่วทั้งแอปพลิเคชัน พร้อม UI components ที่สวยงามและใช้งานง่าย

## 📦 Components

### 1. Loader (Global Overlay)
```javascript
import { Loader } from './shared/components';

// ใช้ใน App.js
function App() {
  return (
    <>
      <Loader />
      {/* rest of your app */}
    </>
  );
}
```

### 2. SimpleLoader (Inline)
```javascript
import { SimpleLoader } from './shared/components';

function MyComponent() {
  return <SimpleLoader message="กำลังโหลด..." />;
}
```

### 3. InlineLoader (Button)
```javascript
import { InlineLoader } from './shared/components';

function MyButton() {
  return (
    <button disabled={loading}>
      {loading && <InlineLoader size="sm" />}
      {loading ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  );
}
```

## 🪝 useLoader Hook

### Basic Usage
```javascript
import useLoader from './shared/hooks/useLoader';

function MyComponent() {
  const { showLoader, hideLoader, isLoading, loadingMessage } = useLoader();
  
  const handleSubmit = async () => {
    showLoader('กำลังส่งข้อมูล...');
    
    try {
      await apiCall();
    } finally {
      hideLoader();
    }
  };
}
```

### Available Methods
- `showLoader(message)` - แสดง loader พร้อมข้อความ
- `hideLoader()` - ซ่อน loader
- `setLoading(boolean)` - ตั้งค่า loading state
- `setLoadingMessage(message)` - ตั้งค่าข้อความ loading
- `isLoading` - สถานะ loading ปัจจุบัน
- `loadingMessage` - ข้อความ loading ปัจจุบัน

## 🎨 Styling

### Global Loader Styles
```css
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 9999;
}

.loader-container {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🔧 Configuration

### Provider Setup
```javascript
// index.js
import { LoaderContextProvider } from './shared/services';

function App() {
  return (
    <LoaderContextProvider>
      <App />
    </LoaderContextProvider>
  );
}
```

### Context Values
```javascript
const LoaderContext = createContext({
  isLoading: false,
  loadingMessage: '',
  setLoading: () => {},
  setLoadingMessage: () => {},
  showLoader: () => {},
  hideLoader: () => {}
});
```

## 📝 Usage Examples

### 1. Form Submission
```javascript
function LoginForm() {
  const { showLoader, hideLoader } = useLoader();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader('กำลังเข้าสู่ระบบ...');
    
    try {
      await loginAPI(credentials);
    } catch (error) {
      // handle error
    } finally {
      hideLoader();
    }
  };
}
```

### 2. Data Fetching
```javascript
function UserProfile() {
  const { showLoader, hideLoader } = useLoader();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      showLoader('กำลังโหลดข้อมูลผู้ใช้...');
      
      try {
        const userData = await getUserAPI();
        setUser(userData);
      } finally {
        hideLoader();
      }
    };
    
    fetchUser();
  }, []);
}
```

### 3. File Upload
```javascript
function FileUpload() {
  const { showLoader, hideLoader } = useLoader();
  
  const handleUpload = async (file) => {
    showLoader(`กำลังอัปโหลด ${file.name}...`);
    
    try {
      await uploadFileAPI(file);
    } finally {
      hideLoader();
    }
  };
}
```

## 🎯 Best Practices

### 1. Always Use try/finally
```javascript
// ✅ Good
const handleOperation = async () => {
  showLoader('กำลังประมวลผล...');
  
  try {
    await apiCall();
  } finally {
    hideLoader();
  }
};

// ❌ Bad
const handleOperation = async () => {
  showLoader('กำลังประมวลผล...');
  await apiCall();
  hideLoader(); // อาจไม่ทำงานถ้าเกิด error
};
```

### 2. Meaningful Messages
```javascript
// ✅ Good
showLoader('กำลังบันทึกข้อมูล...');
showLoader('กำลังส่งอีเมล...');
showLoader('กำลังประมวลผลรูปภาพ...');

// ❌ Bad
showLoader('Loading...');
showLoader('Please wait...');
```

### 3. Disable Interactive Elements
```javascript
function MyButton() {
  const { isLoading } = useLoader();
  
  return (
    <button 
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? 'กำลังประมวลผล...' : 'ส่งข้อมูล'}
    </button>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Loader ไม่แสดง**
   - ตรวจสอบว่า `LoaderContextProvider` ครอบ App อยู่
   - ตรวจสอบว่า `Loader` component อยู่ใน App

2. **Loader ไม่หาย**
   - ตรวจสอบว่าเรียก `hideLoader()` ใน finally block
   - ตรวจสอบ error handling

3. **Multiple Loaders**
   - ใช้ global loader แทน local loading states
   - ใช้ `isLoading` state เพื่อป้องกัน multiple operations

## 🚀 Advanced Usage

### Custom Loader Component
```javascript
function CustomLoader() {
  const { isLoading, loadingMessage } = useLoader();
  
  if (!isLoading) return null;
  
  return (
    <div className="custom-loader">
      <div className="custom-spinner" />
      <p>{loadingMessage}</p>
    </div>
  );
}
```

### Conditional Loading
```javascript
function ConditionalComponent() {
  const { isLoading } = useLoader();
  
  if (isLoading) {
    return <SimpleLoader message="กำลังโหลด..." />;
  }
  
  return <div>Content loaded!</div>;
}
```
