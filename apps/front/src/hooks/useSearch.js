import { useState, useCallback } from "react";

export const useSearch = (onSearch) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const handleSearch = useCallback(() => {
    setActiveFilter(searchTerm);
    onSearch?.(searchTerm);
  }, [searchTerm, onSearch]);

  const handleClearSearch = useCallback(() => {
    const newTerm = "";
    setSearchTerm(newTerm);
    setActiveFilter(newTerm);
    onSearch?.(newTerm);
  }, [onSearch]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    searchTerm,
    activeFilter,
    setSearchTerm,
    handleSearch,
    handleClearSearch,
    handleSearchChange,
  };
};
