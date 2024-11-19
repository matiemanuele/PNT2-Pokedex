import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

const PfpContext = createContext()

export function usePfp() {
    return useContext(PfpContext)
}

const PfpProvider = ({ children }) => {

    const [profileImage, setProfileImage] = useState('')

    const randomProfileImage = async () => {
        if (!profileImage) {
            const randomId = Math.floor(Math.random() * 898) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            const newProfileImage = data.sprites.front_default

            await AsyncStorage.setItem('profileImage', newProfileImage)

            setProfileImage(newProfileImage);
            return newProfileImage
        }
    }

    return (
        <PfpContext.Provider value={{ profileImage, setProfileImage, randomProfileImage }}>
            {children}
        </PfpContext.Provider>
    )
}

export default PfpProvider