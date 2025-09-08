import { useContext } from 'react';
import { LoaderContext } from '../services/LoaderContext';

export default function useLoader() {
  const context = useContext(LoaderContext);
  
  if (!context) {
    throw new Error('useLoader must be used within a LoaderContextProvider');
  }
  
  return context;
}
