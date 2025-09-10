import { useState, createContext } from "react";

export const LoaderContext = createContext({
  isLoading: false,
  loadingMessage: "",
  setLoading: () => {},
  setLoadingMessage: () => {},
  showLoader: () => {},
  hideLoader: () => {},
});

export function LoaderContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  const updateLoadingMessage = (message) => {
    setLoadingMessage(message);
  };

  const showLoader = (message = "Loading...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setLoadingMessage("");
  };

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        loadingMessage,
        setLoading,
        setLoadingMessage: updateLoadingMessage,
        showLoader,
        hideLoader,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
}

export default LoaderContext;
