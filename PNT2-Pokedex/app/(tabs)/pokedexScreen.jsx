import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


export default function PokedexScreen() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

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
                            id: pokemonData.id,
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
        <TouchableOpacity
            style={styles.touchable}
            key={item.id}
            onPress={() => router.push(`/componentes/PokemonCard?id=${item.id}`)}
        >

            <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.pokemonName}>{item.name}</Text>
            </View>

        </TouchableOpacity>
    );


    if (loading) {
        return <Text style={styles.loading}>Cargando...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokedex - Primera Generación</Text>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.id.toString()}
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
        margin: 5,
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 5,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    pokemonName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        flexWrap: "wrap",
    },
    loading: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 20,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonActive: {
        backgroundColor: "red"
    },
    touchable: {
        flex: 1,
        margin: 5,
        maxWidth: "30%",
    },
});
