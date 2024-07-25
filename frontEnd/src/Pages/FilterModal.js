import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterModal.css';

function FilterModal({ onClose, onFilterChange }) {
  const [genres, setGenres] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState('newest');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = () => {
    axios.get('http://localhost:8081/genres')
      .then(res => {
        setGenres(res.data);
      })
      .catch(err => {
        console.log("Error fetching genres:", err);
      });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      sortBy: selectedSortBy,
      genre: selectedGenre
    });
    onClose(); // Close the modal after applying filters
  };

  return (
    <div className="filter-modal">
      <select value={selectedSortBy} onChange={(e) => setSelectedSortBy(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>
      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
        <option value="">All Genres</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.name}>{genre.name}</option>
        ))}
      </select>
      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
}

export default FilterModal;
