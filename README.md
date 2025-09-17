# Olaf Frontend
<img src="https://github.com/ZXINNATTAPAT/ZXINNATTAPAT/blob/main/OLAF.png" />

A modern React-based social media platform frontend built with React 18, featuring authentication, posts, comments, likes, and user management.

## 🚀 Features

### 🔐 Authentication & Security

- **HTTP-Only Cookies** for secure token storage
- **CSRF Protection** with automatic token handling
- **Auto Refresh Token** mechanism
- **Persistent Login** state management
- **Protected Routes** with authentication middleware

### 📱 Core Functionality

- **User Registration & Login** with form validation
- **Post Management** - Create, edit, delete, and view posts
- **Comment System** - Add, edit, and delete comments
- **Like System** - Like/unlike posts and comments
- **User Profiles** - View and edit user profiles
- **Image Upload** - Cloudinary integration for image management
- **Responsive Design** - Mobile-first approach

### 🎨 UI/UX Features

- **Modern UI Components** with custom styling
- **Loading States** and skeleton components
- **Error Handling** with user-friendly messages
- **Theme Support** with dark/light mode toggle
- **Lazy Loading** for images and components
- **Infinite Scroll** for feed pagination

## 🛠️ Tech Stack

### Core Technologies

- **React 18.2.0** - Frontend framework
- **React Router DOM 6.11.1** - Client-side routing
- **Axios 1.4.0** - HTTP client with interceptors
- **Formik 2.4.6** - Form management
- **Yup 1.7.0** - Form validation

### UI & Styling

- **React Icons 5.5.0** - Icon library
- **React Slick 0.31.0** - Carousel component
- **React Share 5.2.2** - Social sharing
- **Custom CSS** - Modular styling approach

### Development Tools

- **Create React App** - Development environment
- **Jest** - Testing framework
- **Testing Library** - Component testing
- **Coverage Reports** - Test coverage analysis

## 📁 Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication module
│   │   ├── components/         # Auth components
│   │   ├── pages/             # Auth pages (Login, Register)
│   │   └── services/          # Auth services
│   ├── posts/                  # Posts module
│   │   ├── components/         # Post components (Like, Comment, etc.)
│   │   └── pages/             # Post pages (Feed, View, Edit)
│   ├── user/                   # User module
│   │   ├── components/         # User components
│   │   └── pages/             # User pages (Profile, Edit)
│   └── home/                   # Home module
├── shared/                     # Shared utilities
│   ├── components/             # Reusable components
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API services
│   ├── constants/              # API constants
│   └── types/                  # Type definitions
└── assets/                     # Static assets
    ├── images/                 # Image assets
    └── styles/                 # CSS modules
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd olaf-frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_BASE_URL=http://localhost:8000
   ```
4. **Start development server**

   ```bash
   npm start
   ```
5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development
npm start                 # Start development server
npm run build            # Build for production
npm run test             # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ci          # Run tests in CI mode
npm run eject            # Eject from Create React App
```

## 🔧 Configuration

### API Configuration

The application uses a centralized API configuration system:

- **Base URL**: Configured via `REACT_APP_BASE_URL` environment variable
- **Timeout**: 30 seconds for regular requests, 20 seconds for feed requests
- **Retry Logic**: 3 retries with 2-second delay
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Authentication Setup

The app uses HTTP-only cookies for secure authentication:

```javascript
// Axios configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### CORS Configuration

Ensure your backend is configured to:

- Allow credentials (`withCredentials: true`)
- Set appropriate CORS headers
- Handle preflight requests

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Coverage

The project includes comprehensive test coverage:

- **Component Tests** - UI component testing
- **Hook Tests** - Custom hook testing
- **Service Tests** - API service testing
- **Integration Tests** - Feature integration testing

### Test Files

- `__tests__/` directories contain test files
- `__mocks__/` directory contains mock implementations
- Coverage reports are generated in the `coverage/` directory

## 📱 Features Overview

### Authentication

- **Login/Register** with form validation
- **Persistent Login** state across browser sessions
- **Auto Logout** on token expiration
- **Protected Routes** requiring authentication

### Posts

- **Create Posts** with text and image support
- **Edit/Delete Posts** with proper authorization
- **View Posts** with detailed post information
- **Like/Unlike Posts** with real-time updates
- **Comment System** with nested comments support

### User Management

- **User Profiles** with customizable information
- **Profile Pictures** with Cloudinary integration
- **User Statistics** (posts, comments, likes count)
- **Profile Editing** with validation

### UI Components

- **Responsive Design** for all screen sizes
- **Loading States** with skeleton components
- **Error Boundaries** for graceful error handling
- **Theme Support** with dark/light mode
- **Accessibility** features for better UX

## 🔒 Security Features

### HTTP-Only Cookies

- Tokens stored in HTTP-only cookies
- Protection against XSS attacks
- Automatic token refresh mechanism

### CSRF Protection

- CSRF token in request headers
- Automatic token management
- Secure cookie configuration

### Input Validation

- Client-side validation with Yup
- Server-side validation handling
- XSS protection in user inputs

## 🌐 API Integration

### Endpoints

The application integrates with a RESTful API:

- **Authentication**: `/auth/login/`, `/auth/register/`, `/auth/logout/`
- **Posts**: `/posts/` (CRUD operations)
- **Comments**: `/comments/` (CRUD operations)
- **Users**: `/users/` (Profile management)
- **Cloudinary**: `/cloudinary/upload/` (Image upload)

### Error Handling

- **Network Errors** - Connection and timeout handling
- **Server Errors** - 4xx and 5xx error handling
- **Validation Errors** - Form validation error display
- **User Feedback** - Success and error message display

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set the following environment variables for production:

```env
REACT_APP_BASE_URL=https://your-api-domain.com
```

### Deployment Considerations

- **CORS Configuration** - Ensure backend allows your domain
- **HTTPS** - Required for secure cookie transmission
- **Environment Variables** - Set production API URL
- **Build Optimization** - Minified and optimized build

## 🤝 Contributing

### Development Guidelines

1. **Feature-based Structure** - Organize code by features
2. **Component Reusability** - Create reusable components
3. **Error Handling** - Implement comprehensive error handling
4. **Testing** - Write tests for new features
5. **Documentation** - Update documentation for changes

### Code Style

- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **Consistent Naming** conventions
- **Component Documentation** with JSDoc

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:

- Check the documentation in the `src/shared/services/README.md`
- Review the API constants in `src/shared/constants/apiConstants.js`
- Examine the type definitions in `src/shared/types/apiTypes.js`

## 🔄 Version History

- **v0.1.0** - Initial release with core features
  - Authentication system
  - Post management
  - Comment system
  - User profiles
  - Image upload integration

---

**Built with ❤️ using React and modern web technologies**
