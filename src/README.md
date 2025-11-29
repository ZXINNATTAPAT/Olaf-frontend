# Olaf Frontend - Project Structure

## 📁 Project Structure

```
src/
├── pages/                    # All page components
│   ├── auth/                # Authentication pages
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── User.js
│   ├── admin/               # Admin pages
│   │   ├── Dashboard.js
│   │   ├── PostsManagement.js
│   │   ├── UsersManagement.js
│   │   ├── CommentsManagement.js
│   │   ├── Analytics.js
│   │   └── Settings.js
│   ├── home/                # Home page
│   │   └── Home.js
│   ├── user/                # User pages
│   │   ├── Profile.js
│   │   ├── CreatePost.js
│   │   └── EditProfile.js
│   └── index.js             # Pages exports
├── features/                 # Domain-specific features
│   └── posts/               # Posts feature
│       ├── components/      # Post-specific components
│       ├── pages/          # Post pages (Feed, View, Edit)
│       └── index.js        # Posts exports
├── shared/                   # Shared resources
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Atomic Design)
│   │   │   ├── atoms/      # Basic building blocks
│   │   │   ├── molecules/  # Simple component groups
│   │   │   └── organisms/  # Complex component groups
│   │   ├── admin/          # Admin-specific components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   └── index.js        # Components exports
│   ├── hooks/              # Shared hooks
│   │   └── index.js        # Hooks exports
│   ├── services/           # Shared services
│   │   ├── httpClient.js   # HTTP client (axios instance)
│   │   ├── AuthMiddleware.js  # Auth middleware
│   │   ├── AuthService.js  # Auth service
│   │   ├── AuthContext.js  # Auth context
│   │   └── index.js        # Services exports
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   ├── constants/          # Constants
│   └── index.js            # Shared exports
├── assets/                  # Static assets
│   ├── images/             # Image files
│   ├── icons/              # Icon files
│   └── styles/             # Style files
├── App.js                   # Main App component
├── App.css                  # App styles
├── index.js                 # Entry point
└── index.css                # Global styles
```

## 🎯 Benefits of This Structure

### 1. **Feature-Based Organization**
- Each feature is self-contained with its own components, pages, hooks, and services
- Easy to locate and maintain feature-specific code
- Clear separation of concerns

### 2. **Shared Resources**
- Common components, hooks, and services are centralized
- Prevents code duplication
- Easy to maintain and update shared functionality

### 3. **Scalability**
- Easy to add new features without affecting existing code
- Clear structure for team collaboration
- Supports micro-frontend architecture if needed

### 4. **Maintainability**
- Clear file organization makes code easier to find and modify
- Consistent structure across all features
- Easy to onboard new developers

## 📦 Import Examples

### Page Imports
```javascript
// Import pages
import { LoginPage, RegisterPage, HomePage, ProfilePage } from './pages';
import { FeedPage, ViewPage } from './features/posts';

// Import from shared
import { Navbar, Footer, Button, PostCard } from './shared/components';
import { useAuth, useAxiosPrivate } from './shared/hooks';
import { AuthMiddleware, axiosInstance } from './shared/services';
```

### Component Imports
```javascript
// Import specific components
import { Navbar } from './shared/components/layout/Navbar';
import { useAuth } from './shared/hooks/useAuth';
```

## 🔧 Development Guidelines

1. **New Pages**: Add pages to `pages/` directory organized by feature (auth, admin, home, user)
2. **Features**: Only domain-specific features go in `features/` (currently only posts)
3. **Shared Components**: Add reusable UI components to `shared/components/ui/` (Atomic Design structure)
4. **Hooks**: Add shared hooks to `shared/hooks/`
5. **Services**: Add API services to `shared/services/`
6. **Assets**: Add images, icons, and styles to `assets/`

## 📝 Naming Conventions

- **Folders**: lowercase with hyphens (e.g., `user-profile`)
- **Files**: PascalCase for components (e.g., `UserProfile.js`)
- **Hooks**: camelCase starting with 'use' (e.g., `useUserProfile`)
- **Services**: PascalCase (e.g., `UserService.js`)
- **Types**: PascalCase (e.g., `UserType.js`)

This structure provides a solid foundation for a scalable and maintainable React application.
