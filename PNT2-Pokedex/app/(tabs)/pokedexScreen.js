import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

export default function PokedexScreen() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
                const data = await response.json();
                
                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const pokemonResponse = await fetch(pokemon.url);
                        const pokemonData = await pokemonResponse.json();
                        return {
                            name: pokemon.name,
                            image: pokemonData.sprites.front_default, 
                        };
                    })
                );

                setPokemons(pokemonDetails);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Pokémon data:", error);
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
    );

    if (loading) {
        return <Text style={styles.loading}>Cargando...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokedex - Primera Generación</Text>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                numColumns={3} 
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    list: {
        justifyContent: "space-around",
    },
    item: {
        flex: 1,
        margin: 10,
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 10,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    pokemonName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    loading: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 20,
    },
});
