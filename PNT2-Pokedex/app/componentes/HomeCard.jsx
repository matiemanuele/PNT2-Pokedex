import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const HomeCard = ({ nombre, imagen, descripcion }) => {
    return (
        <View style={styles.cardContainer}>
            <Image source={imagen} style={styles.image} />
            <Text style={styles.title}>{nombre}</Text>
            <Text style={styles.description}>{descripcion}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 300, 
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 3,
        margin: 10,
        padding: 15,
        alignItems: "center",
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
});

export default HomeCard;