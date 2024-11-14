import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useUser() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const cargarEstadoAuth = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      setUserName(storedUserName || '')
    }
    cargarEstadoAuth();
  }, []);

  const login = async (usuario, password) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users")
      const data = await response.json();
      const user = data.find(u => u.user === usuario && u.password === password)

      if (user) {
        await AsyncStorage.setItem("userData", JSON.stringify(user))
        await AsyncStorage.setItem("userName", user.name)
        setUserName(user.name);
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return null
    }
  };

  const register = async (usuario, email, password, nombre) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const userExiste = data.some(u => u.user === usuario);
      const mailExiste = data.some(u => u.email === email);

      if (userExiste) {
        alert("Este usuario ya está registrado");
      } else if (mailExiste) {
        alert("Ya existe una cuenta con este email");
      } else {
        const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            name: nombre,
            password: password,
            email: email,
            user: usuario
          })
        });

        if (response.ok) {
          const nuevoUsuario = await response.json();
          setUserName(nuevoUsuario.name)
          return true
        } else {
          return null
        }
      }
    } catch (error) {
      console.error(error);
      return null
    }
  };

  return (
    <AuthContext.Provider value={{ userName, setUserName, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider