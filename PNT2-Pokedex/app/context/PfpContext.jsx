import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const PfpContext = createContext()

export function usePfp() {
    return useContext(PfpContext)
}

const PfpProvider = ({ children }) => {

    const [profileImage, setProfileImage] = useState(null); // Usa `null` como inicial
    const [isLoaded, setIsLoaded] = useState(false); // Nuevo estado para verificar la carga inicial

    // Cargar la imagen guardada al inicio
    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const savedImage = await AsyncStorage.getItem('profileImage');
                if (savedImage) {
                    setProfileImage(savedImage);
                }
            } catch (error) {
                console.error('Error al cargar la imagen de perfil:', error);
            } finally {
                setIsLoaded(true); // Marca como cargado
            }
        };

        loadProfileImage();
    }, []);

    // Actualizar `AsyncStorage` cuando se cambia la imagen
    const updateProfileImage = async (newProfileImage) => {
        try {
            await AsyncStorage.setItem('profileImage', newProfileImage);
            setProfileImage(newProfileImage);
        } catch (error) {
            console.error('Error al guardar la imagen de perfil:', error);
        }
    };

    // Generar una imagen aleatoria si no hay una establecida
    const randomProfileImage = async () => {
        if (!profileImage) {
            const randomId = Math.floor(Math.random() * 898) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            const newProfileImage = data.sprites.front_default;

            await updateProfileImage(newProfileImage);

            return newProfileImage;
        }
    };

    // No renderizar hasta que esté cargado
    if (!isLoaded) {
        return null; // O un spinner/cargando si prefieres
    }

    return (
        <PfpContext.Provider value={{ profileImage, setProfileImage: updateProfileImage, randomProfileImage }}>
            {children}
        </PfpContext.Provider>
    )
}

export default PfpProvider