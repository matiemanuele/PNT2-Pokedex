import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import HomeCard from "../componentes/HomeCard";

export default function HomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);

    const images = [
        require("../../assets/poke_1_1.webp"),
        require("../../assets/poke_2_2.webp"),
        require("../../assets/poke_3_3.webp"),
        require("../../assets/poke_4_4.png"),
    ];

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../assets/fondo_inicio.png")}
                style={styles.backgroundHome}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <Text style={styles.text}>ORT PokeDex</Text>
                </View>

                <View style={styles.carouselContainer}>
                    <TouchableOpacity onPress={handlePrev} style={styles.arrowContainer}>
                        <Image
                            source={require("../../assets/flecha_izq.png")}
                            style={styles.arrow}
                        />
                    </TouchableOpacity>

                    <Image
                        source={images[currentIndex]}
                        style={styles.carouselImage}
                    />

                    <TouchableOpacity onPress={handleNext} style={styles.arrowContainer}>
                        <Image
                            source={require("../../assets/flecha_derecha.png")}
                            style={styles.arrow}
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.highlightContainer}>
                <Text style={styles.highlightTitle}>Los destacados de la semana</Text>

                <View style={styles.cardContainer}>
                    {pokemons.map((pokemon, index) => {
                        const pokemonId = pokemon.url.split("/")[6];
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

                        return (
                            <HomeCard //la homecard
                                key={index}
                                nombre={pokemon.name}
                                imagen={{ uri: imageUrl }}
                                descripcion={`Este es ${pokemon.name}, ¡uno de los Pokémon destacados esta semana!`}
                            />
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backgroundHome: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
        height: "auto",
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        paddingTop: 50,
        fontSize: 30,
        color: "#000",
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",

    },
    carouselContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    carouselImage: {
        width: 300,
        height: 300,
        resizeMode: "cover",
    },
    arrowContainer: {
        padding: 10,
    },
    arrow: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    highlightContainer: {
        alignItems: "center",
        padding: 20,
    },
    highlightTitle: {
        fontSize: 24,
        marginBottom: 20,
        color: "#333",
        fontWeight: 800,

    },
    cardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        width: "100%",
        marginBottom: 20,
    },
});
