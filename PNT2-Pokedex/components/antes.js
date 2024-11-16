import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';

const PokemonList = () => {
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

    
    const renderPokemon = ({ item }) => {
        const pokemonId = item.url.split("/")[6];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        return (
            <View style={styles.pokemonContainer}>
                <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
                <Text style={styles.pokemonName}>{item.name}</Text>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <FlatList
            data={pokemons}
            keyExtractor={(item) => item.name} 
            renderItem={renderPokemon} 
            contentContainerStyle={styles.list}
        />
    );
};


const styles = StyleSheet.create({
    list: {
        padding: 10,
    },
    pokemonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    pokemonImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    pokemonName: {
        fontSize: 18,
        textTransform: 'capitalize', 
    },
});

export default PokemonList;