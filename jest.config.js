module.exports = {
  // Use React Scripts Jest configuration
  preset: 'react-scripts',
  
  // Mock axios and handle ES modules
  moduleNameMapper: {
    // Mock CSS and style imports - must be first to catch all CSS imports
    // Use a more specific pattern that matches CSS files from any location
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock axios - must match before Jest tries to resolve from node_modules
    '^axios$': '<rootDir>/__mocks__/axios.js',
    '^axios/(.*)$': '<rootDir>/__mocks__/axios.js',
    '^../axios/index$': '<rootDir>/__mocks__/axios.js',
    '^../axios/index.js$': '<rootDir>/__mocks__/axios.js'
  },
  
  // Transform ES modules in node_modules
  // Exclude axios from transformation since we're mocking it
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Coverage configuration - exclude unnecessary files
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/debug/**',
    '!src/**/index.js',
    '!src/**/CloudinaryUsageExample.js',
    '!src/features/**/index.js',
    '!src/pages/**/index.js',
    '!src/shared/**/index.js',
    '!src/shared/types/index.js',
    '!src/shared/utils/index.js',
    '!src/shared/hooks/index.js',
    '!src/shared/components/ui/index.js'
  ],
  
  // Coverage thresholds - 100% coverage required for included files
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Handle ES modules
  extensionsToTreatAsEsm: ['.js', '.jsx']
};
