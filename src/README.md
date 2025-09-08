# Olaf Frontend - Project Structure

## 📁 Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── pages/             # Auth pages (Login, Register, User)
│   │   ├── hooks/             # Auth-specific hooks
│   │   ├── services/          # Auth services
│   │   ├── types/             # Auth type definitions
│   │   └── index.js           # Auth exports
│   ├── posts/                 # Posts feature
│   │   ├── components/        # Post components (Comment, Like, etc.)
│   │   ├── pages/            # Post pages (Feed, View, Edit)
│   │   ├── hooks/            # Post-specific hooks
│   │   ├── services/         # Post services
│   │   ├── types/            # Post type definitions
│   │   └── index.js          # Posts exports
│   ├── user/                 # User feature
│   │   ├── components/       # User-specific components
│   │   ├── pages/           # User pages (Profile, AddContent, etc.)
│   │   ├── hooks/           # User-specific hooks
│   │   ├── services/        # User services
│   │   ├── types/           # User type definitions
│   │   └── index.js         # User exports
│   ├── home/                # Home feature
│   │   ├── components/      # Home-specific components
│   │   ├── pages/          # Home page
│   │   ├── hooks/          # Home-specific hooks
│   │   ├── services/       # Home services
│   │   ├── types/          # Home type definitions
│   │   └── index.js        # Home exports
│   └── index.js            # All features exports
├── shared/                  # Shared resources
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── forms/         # Form components
│   │   └── index.js       # Components exports
│   ├── hooks/             # Shared hooks
│   │   └── index.js       # Hooks exports
│   ├── services/          # Shared services
│   │   ├── axios/         # API configuration
│   │   ├── Auth.js        # Auth middleware
│   │   ├── AuthContext.js # Auth context
│   │   └── index.js       # Services exports
│   ├── utils/             # Utility functions
│   ├── types/             # Type definitions
│   ├── constants/         # Constants
│   └── index.js           # Shared exports
├── assets/                # Static assets
│   ├── images/           # Image files
│   ├── icons/            # Icon files
│   └── styles/           # Style files
├── App.js                # Main App component
├── App.css              # App styles
├── index.js             # Entry point
└── index.css            # Global styles
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

### Feature Imports
```javascript
// Import from specific feature
import { LoginPage, RegisterPage } from './features/auth';
import { FeedPage, ViewPage } from './features/posts';
import { ProfilePage } from './features/user';

// Import from shared
import { Navbar, Footer } from './shared/components';
import { useAuth, useAxiosPrivate } from './shared/hooks';
import { AuthMiddleware } from './shared/services';
```

### Component Imports
```javascript
// Import specific components
import { Navbar } from './shared/components/layout/Navbar';
import { useAuth } from './shared/hooks/useAuth';
```

## 🔧 Development Guidelines

1. **New Features**: Create a new folder under `features/` with the standard structure
2. **Shared Components**: Add reusable components to `shared/components/`
3. **Hooks**: Add shared hooks to `shared/hooks/`
4. **Services**: Add API services to `shared/services/`
5. **Assets**: Add images, icons, and styles to `assets/`

## 📝 Naming Conventions

- **Folders**: lowercase with hyphens (e.g., `user-profile`)
- **Files**: PascalCase for components (e.g., `UserProfile.js`)
- **Hooks**: camelCase starting with 'use' (e.g., `useUserProfile`)
- **Services**: PascalCase (e.g., `UserService.js`)
- **Types**: PascalCase (e.g., `UserType.js`)

This structure provides a solid foundation for a scalable and maintainable React application.
