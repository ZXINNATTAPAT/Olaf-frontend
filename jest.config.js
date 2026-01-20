module.exports = {
  // Use React Scripts Jest configuration
  preset: 'react-scripts',
  
  // Mock axios and handle ES modules
  moduleNameMapper: {
    // Mock CSS and style imports - must be first to catch all CSS imports
    // Use a more specific pattern that matches CSS files from any location
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    '^axios$': '<rootDir>/__mocks__/axios.js',
    '^../axios/index$': '<rootDir>/__mocks__/axios.js',
    '^../axios/index.js$': '<rootDir>/__mocks__/axios.js'
  },
  
  // Transform ES modules in node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Handle ES modules
  extensionsToTreatAsEsm: ['.js', '.jsx']
};
