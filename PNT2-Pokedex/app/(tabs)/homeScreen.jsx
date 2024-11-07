import React from "react";
// import { useFonts, ArchivoBlack_400Regular, RubikBubbles_400Regular } from "@expo-google-fonts/archivo-black"; 
import { View, Text, ImageBackground, FlatList, Image, Dimensions, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomeCard from "../componentes/HomeCard";

export default function homeScreen() {
    const navigation = useNavigation();
    const { height, width } = Dimensions.get("window");

   
    // const [fontsLoaded] = useFonts({
    //     ArchivoBlack_400Regular,
    //     RubikBubbles_400Regular,
    // });

    // if (!fontsLoaded) {
    //     return <ActivityIndicator size="large" color="#0000ff" />;
    // }

    const images = [
        require("../../assets/poke_1_1.webp"),
        require("../../assets/poke_2_2.webp"),
        require("../../assets/poke_3_3.webp"),
        require("../../assets/poke_4_4.png"),
    ];

    return (
        <ScrollView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../assets/fondo_inicio.png")}
                style={styles.backgroundHome}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <Text style={styles.text}> ORT PokeDex</Text>
                </View>
                
                <FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    renderItem={({ item }) => (
                        <Image source={item} style={styles.carouselImage} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.carouselContainer}
                    contentContainerStyle={{ justifyContent: "center" }}
                />
            </ImageBackground>

           
            <View style={styles.highlightContainer}>
                <Text style={styles.highlightTitle}>Los destacados de la semana</Text>

              
                <View style={styles.cardContainer}>
                    <HomeCard 
                        nombre="Hola" 
                        imagen={require("../../assets/poke_4_4.png")}
                        descripcion="Esta es una descripción de ejemplo" 
                    />
                    <HomeCard 
                        nombre="Hola" 
                        imagen={require("../../assets/poke_4_4.png")}
                        descripcion="Esta es una descripción de ejemplo" 
                    />
                    <HomeCard 
                        nombre="Hola" 
                        imagen={require("../../assets/poke_4_4.png")}
                        descripcion="Esta es una descripción de ejemplo" 
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backgroundHome: {
        flex: 1,
        height: 800,
        justifyContent: "center",
    },
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    text: {
        marginTop: 100,
        fontSize: 30,
        // fontFamily: 'RubikBubbles',
        paddingTop: 5,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    carouselContainer: {
        height: 500, 
        marginVertical: 10,
    },
    carouselImage: {
        width: Dimensions.get("window").width,
        height: 400,
        resizeMode: "cover",
    },
    highlightContainer: {
        alignItems: "center",
        padding: 20,
    },
    highlightTitle: {
        fontSize: 24,
        // fontFamily: "ArchivoBlack_400Regular",
        marginBottom: 20,
        color: "#333",
    },
    cardContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        width: "100%",
        alignItems:"center",
        marginBottom: 20, 
    },

})
;