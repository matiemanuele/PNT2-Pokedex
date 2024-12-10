import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const HomeCard = ({ nombre, imagen, descripcion }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image source={imagen} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{nombre}</Text>
                <Text style={styles.description}>{descripcion}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 300, 
        borderRadius: 15,
        backgroundColor: "#F2F2F2",
        elevation: 5,
        margin: 10,
        overflow: 'hidden',
        shadowColor: "#FF1C1C",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 2,
        borderColor: "#FFCB05", // Pikachu Yellow
    },
    imageContainer: {
        backgroundColor: "#4F7CAC", // Pokéball Blue
        padding: 10,
        alignItems: "center",
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },
    textContainer: {
        padding: 15,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#3B4CCA", // Pokemon Blue
        textTransform: 'capitalize',
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        color: "#616161",
        textAlign: "center",
        fontStyle: "italic",
    },
});

export default HomeCard;