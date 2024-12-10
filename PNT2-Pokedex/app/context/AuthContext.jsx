import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useUser() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.name);
          setCurrentUser(parsedUser);
        }
      } catch (error) {
        console.error("Error loading user data", error);
      }
    })();
  }, []);

  const login = async (usuario, password) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();

      const user = data.find((u) => u.user === usuario && u.password === password);

      if (user) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        setUserName(user.name);
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during login", error);
      return null;
    }
  };

  const register = async (usuario, email, password, nombre) => {
    const defaultImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/poke-ball.png"

    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();

      if (usuario === 'admin') {
        alert("No podes poner admin como usuario");
        return false;
      }
      if (data.some((u) => u.user === usuario)) {
        alert("Este usuario ya está registrado");
        return false;
      }
      if (data.some((u) => u.email === email)) {
        alert("Ya existe una cuenta con este email");
        return false;
      }

      const newUserResponse = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          password,
          email,
          user: usuario,
          profilePicture: defaultImage,
        }),
      });

      if (newUserResponse.ok) {
        const newUser = await newUserResponse.json();
        await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));
        setUserName(newUser.name);
        setCurrentUser(newUser);
        return true;
      }
      return null;
    } catch (error) {
      console.error("Error during registration", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ userName, currentUser, setCurrentUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
