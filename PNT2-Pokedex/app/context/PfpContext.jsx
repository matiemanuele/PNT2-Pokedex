import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const PfpContext = createContext()

export function UsePfp() {
    return useContext(PfpContext)
}

export const PfpProvider = ({ children }) => {

    const [pokemonImage, setPokemonImage] = useState('')

    const savePokemonImage = async (imageUri) => {
        try {
            await AsyncStorage.setItem("pokemonImage", imageUri)
            setPokemonImage(imageUri)
        } catch (error) {
            console.error("Failed to save Pokemon image", error)
        }
    }


    return (
        <PfpContext.Provider value={{ pokemonImage, savePokemonImage }}>
            {children}
        </PfpContext.Provider>
    )
}


export default PfpProvider