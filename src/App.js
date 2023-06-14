import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(debounceHandler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Adjust the delay as needed

  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    if (debouncedSearch) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${debouncedSearch}`)
        .then((response) => {
          setPokemon(response.data);
        })
        .catch((error) => {
          setPokemon(null);
          console.error(error);
        });
    } else {
      setPokemon(null);
    }
  }, [debouncedSearch]);

  return (
    <div className="App">
      <input
        placeholder="Search Pokemon"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {pokemon && (
        <div className="card">
          <h1 className="card-title">{pokemon.name}</h1>
          <img
            src={pokemon.sprites?.front_default}
            alt={pokemon.name}
            className="card-image"
          />
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">Height: </span>
              <span>{pokemon.height}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Weight: </span>
              <span>{pokemon.weight}</span>
            </div>

            <span className="detail-label">Abilities: </span>
            <ul>
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>

            {/* Add more details as needed */}
          </div>
        </div>
      )}
    </div>
  );
}
