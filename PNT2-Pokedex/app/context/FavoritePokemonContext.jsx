import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";

const FavoritePokemonContext = createContext();
const MOCKAPI_URL = "https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users";

export function useFavoritePokemons() {
    return useContext(FavoritePokemonContext);
}

const FavoritePokemonProvider = ({ children }) => {
    const [favoritePokemons, setFavoritePokemons] = useState([]);
    const { currentUser } = useUser();

    useEffect(() => {
        if (!currentUser?.id) return setFavoritePokemons([]);

        const loadFavorites = async () => {
            try {
                const response = await fetch(`${MOCKAPI_URL}/${currentUser.id}`);
                const userData = await response.json();
                setFavoritePokemons(userData.favoritePokemons || []);
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadFavorites();
    }, [currentUser?.id]);

    const updateUserFavorites = async (updatedFavorites) => {
        if (!currentUser?.id) return;

        try {
            await fetch(`${MOCKAPI_URL}/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...currentUser,
                    favoritePokemons: updatedFavorites,
                }),
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
            throw error;
        }
    };

    const modifyFavorites = async (pokemon, action) => {
        try {
            const updatedFavorites =
                action === "add"
                    ? [...favoritePokemons, {
                        id: pokemon.id,
                        name: pokemon.forms?.[0]?.name || pokemon.name,
                        image: pokemon.sprites.front_default,
                    }]
                    : favoritePokemons.filter((p) => p.id !== pokemon.id);

            await updateUserFavorites(updatedFavorites);
            setFavoritePokemons(updatedFavorites);
        } catch (error) {
            console.error(`Error ${action}ing favorite:`, error);
            throw error;
        }
    };

    return (
        <FavoritePokemonContext.Provider
            value={{
                favoritePokemons,
                addFavoritePokemon: (pokemon) => modifyFavorites(pokemon, "add"),
                removeFavoritePokemon: (pokemonId) => modifyFavorites({ id: pokemonId }, "remove"),
            }}
        >
            {children}
        </FavoritePokemonContext.Provider>
    );
};

export default FavoritePokemonProvider;
