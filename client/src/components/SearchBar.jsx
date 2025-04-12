import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setError("");
    onSearch(city);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col items-center gap-3 mb-5">
      <div className="flex gap-3">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("");
            }}
            placeholder="Enter city name"
            className={`border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <FaSearch />
          Search
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

export default SearchBar;
