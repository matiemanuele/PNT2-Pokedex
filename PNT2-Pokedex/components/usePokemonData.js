import { useEffect, useState } from 'react';

const usePokemonData = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
                const data = await response.json();
                setPokemons(data.results);
            } catch (error) {
                console.error("Error al obtener los Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    return { pokemons, loading };
};

export default usePokemonData;
