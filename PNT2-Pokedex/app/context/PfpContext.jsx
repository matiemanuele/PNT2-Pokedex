import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const PfpContext = createContext();

export function usePfp() {
  return useContext(PfpContext);
}

const PfpProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const defaultImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/poke-ball.png" //imagen inicial


  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("profileImage");
        setProfileImage(savedImage || defaultImage);
      } catch (error) {
        console.error("Error al cargar la imagen de perfil:", error);
      }
    };

    loadProfileImage();
  }, []);

  const updateProfileImage = async (newImage) => {
    try {
      if (newImage) {
        await AsyncStorage.setItem("profileImage", newImage);
      } else {
        await AsyncStorage.removeItem("profileImage");
      }
      setProfileImage(newImage || defaultImage)
    } catch (error) {
      console.error("Error al actualizar la imagen de perfil:", error);
    }
  };

  const removeProfileImage = async () => {
    try {
      await AsyncStorage.removeItem("profileImage"); // Elimina de AsyncStorage
      setProfileImage(defaultImage); // Restablece la imagen predeterminada
    } catch (error) {
      console.error("Error al eliminar la imagen de perfil:", error);
    }
  };

  const removeProfileImageFromServer = async (userId) => {
    try {
      const updatedUser = { profilePicture: null }
      const response = await fetch(
        `https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) throw new Error("Error al eliminar la imagen en el servidor");

      await AsyncStorage.removeItem("profileImage")
      setProfileImage(defaultImage)
    } catch (error) {
      console.error("Error al eliminar la imagen en el servidor:", error);
      throw error
    }
  };

  return (
    <PfpContext.Provider
      value={{
        profileImage,
        setProfileImage: updateProfileImage,
        removeProfileImageFromServer,
        removeProfileImage,
      }}
    >
      {children}
    </PfpContext.Provider>
  );
};

export default PfpProvider;
