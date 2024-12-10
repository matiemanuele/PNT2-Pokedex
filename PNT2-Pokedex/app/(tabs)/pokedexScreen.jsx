import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // Note: You'll need to install expo-linear-gradient

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
                            types: pokemonData.types.map(type => type.type.name)
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

    // Function to get background color based on Pokemon type
    const getTypeColor = (type) => {
        const typeColors = {
            fire: ['#FF6C04', '#FF9900'],
            water: ['#3395D8', '#5BCAFF'],
            grass: ['#3BA655', '#8BC34A'],
            electric: ['#FFC107', '#FFD54F'],
            psychic: ['#FF4081', '#FF80AB'],
            normal: ['#A8A878', '#C6C6A7'],
            flying: ['#A890F0', '#C6B7F0'],
            bug: ['#A8B820', '#C6D16E'],
            poison: ['#A040A0', '#C183C1'],
            ground: ['#E0C068', '#F0E68C'],
            rock: ['#B8A038', '#D1C17D'],
            fighting: ['#C03028', '#F08030'],
            ghost: ['#705898', '#A292BC'],
            ice: ['#98D8D8', '#B4E4E4'],
            dragon: ['#7038F8', '#9180F0'],
            dark: ['#705848', '#A29288'],
            steel: ['#B8B8D0', '#D1D1E0'],
            fairy: ['#EE99AC', '#F4BDC9']
        };
        return typeColors[type] || ['#A8A878', '#C6C6A7']; // default to normal type
    };

    const renderItem = ({ item }) => {
        // Use the first type for background gradient
        const typeColor = getTypeColor(item.types[0]);

        return (
            <TouchableOpacity
                style={styles.touchable}
                key={item.id}
                onPress={() => router.push(`/componentes/PokemonCard?id=${item.id}`)}
            >
                <LinearGradient
                    colors={typeColor}
                    style={styles.item}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.pokemonIdContainer}>
                        <Text style={styles.pokemonId}>#{item.id}</Text>
                    </View>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.pokemonName}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <LinearGradient
                colors={['#FF4081', '#FF80AB']}
                style={styles.loadingContainer}
            >
                <Image
                    source={require("../../assets/pokegif.gif")} // You'll need to add this gif
                    style={styles.loadingImage}
                />
                <Text style={styles.loading}>Loading Pokédex...</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#3395D8', '#5BCAFF']}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <Image
                    source={require('../../assets/pokelogo.png')} // You'll need to add this image
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                contentContainerStyle={styles.list}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    logo: {
        width: 200,
        height: 80,
    },
    list: {
        justifyContent: "space-around",
        paddingBottom: 20,
    },
    item: {
        flex: 1,
        margin: 5,
        alignItems: "center",
        borderRadius: 15,
        padding: 10,
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pokemonIdContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    pokemonId: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    pokemonName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    touchable: {
        flex: 1,
        margin: 5,
        maxWidth: "30%",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF4081',
    },
    loadingImage: {
        width: 100,
        height: 100,
    },
    loading: {
        fontSize: 20,
        color: 'white',
        marginTop: 20,
        fontWeight: 'bold',
    },
});