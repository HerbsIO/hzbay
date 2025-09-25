import React, { useState } from 'react';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(input);
    navigate(`/search?q=${input}`);
  };

  return (
    <form onSubmit={handleSearch} className="d-flex">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="form-control me-2"
        placeholder="Search"
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
};

export default SearchBar;
