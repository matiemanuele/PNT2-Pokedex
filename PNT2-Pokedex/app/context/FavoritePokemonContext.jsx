import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";

const FavoritePokemonContext = createContext();
const MOCKAPI_URL = "https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users"

export function useFavoritePokemons() {
    return useContext(FavoritePokemonContext)
}

const FavoritePokemonProvider = ({ children }) => {
    
    const [favoritePokemons, setFavoritePokemons] = useState([])
    const { currentUser } = useUser()

    // Cargar favoritos cuando hay un usuario autenticado
    useEffect(() => {
        const loadFavorites = async () => {
            if (!currentUser?.id) {
                setFavoritePokemons([]); // Limpiar favoritos si no hay usuario
                return;
            }

            try {
                const response = await fetch(`${MOCKAPI_URL}/${currentUser.id}`);
                const userData = await response.json();
                if (userData.favoritePokemons) {
                    setFavoritePokemons(userData.favoritePokemons);
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadFavorites();
    }, [currentUser]); // Se ejecuta cuando cambia el usuario

    const updateUserFavorites = async (updatedFavorites) => {
        if (!currentUser?.id) return

        try {
            await fetch(`${MOCKAPI_URL}/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentUser,
                    favoritePokemons: updatedFavorites
                })
            })
        } catch (error) {
            console.error("Error updating favorites:", error)
            throw error
        }
    };

    const addFavoritePokemon = async (pokemon) => {
        try {
            // Solo guardamos la información necesaria del pokemon
            const simplifiedPokemon = {
                id: pokemon.id,
                name: pokemon.forms[0]?.name || pokemon.name,
                image: pokemon.sprites.front_default
            };

            const updatedFavorites = [...favoritePokemons, simplifiedPokemon];
            await updateUserFavorites(updatedFavorites);
            setFavoritePokemons(updatedFavorites);
            return true;
        } catch (error) {
            console.error("Error adding favorite:", error);
            throw error;
        }
    };

    const removeFavoritePokemon = async (pokemonId) => {
        try {
            const updatedFavorites = favoritePokemons.filter(
                (pokemon) => pokemon.id !== pokemonId
            );
            await updateUserFavorites(updatedFavorites);
            setFavoritePokemons(updatedFavorites);
            return true;
        } catch (error) {
            console.error("Error removing favorite:", error);
            throw error;
        }
    };

    return (
        <FavoritePokemonContext.Provider
            value={{ favoritePokemons, addFavoritePokemon, removeFavoritePokemon }}
        >
            {children}
        </FavoritePokemonContext.Provider>
    );
};

export default FavoritePokemonProvider