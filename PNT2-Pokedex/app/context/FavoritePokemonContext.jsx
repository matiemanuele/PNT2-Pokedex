import React, { createContext, useContext, useState } from "react";


const FavoritePokemonContext = createContext();


export const FavoritePokemonProvider = ({ children }) => {
    const [favoritePokemons, setFavoritePokemons] = useState([]);

    const addFavoritePokemon = (pokemon) => {
        setFavoritePokemons((prevPokemons) => [...prevPokemons, pokemon]);
    };

    const removeFavoritePokemon = (pokemonId) => {
        setFavoritePokemons((prevPokemons) =>
            prevPokemons.filter((pokemon) => pokemon.id !== pokemonId)
        );
    };

    return (
        <FavoritePokemonContext.Provider
            value={{ favoritePokemons, addFavoritePokemon, removeFavoritePokemon }}
        >
            {children}
        </FavoritePokemonContext.Provider>
    );
};

export const useFavoritePokemons = () => useContext(FavoritePokemonContext);
