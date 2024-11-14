import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useUser() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const cargarEstadoAuth = async () => {
      const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      const userData = await AsyncStorage.getItem("userData");
      const storedUserName = await AsyncStorage.getItem("userName");

      if (isAuthenticated === "true" && userData) {
        setUser(JSON.parse(userData));
        setUserName(storedUserName || '');
        setStatus("Authenticated");
      } else {
        setStatus("Unauthenticated");
      }
    };

    cargarEstadoAuth();
  }, []);

  const login = async (usuario, password) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const user = data.find(u => u.username === usuario && u.password === password);

      if (user) {
        await AsyncStorage.setItem("isAuthenticated", "true");
        await AsyncStorage.setItem("userData", JSON.stringify(user));
        await AsyncStorage.setItem("userName", user.name);
        setUser(user);
        setUserName(user.name);
        setStatus("Authenticated");
      } else {
        alert("Error en los datos");
        setStatus("Unauthenticated");
      }
    } catch (error) {
      console.error(error);
      alert("Error en la autenticación");
    }
  };

  const register = async (usuario, email, password, nombre) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const userExiste = data.some(u => u.username === usuario);
      const mailExiste = data.some(u => u.mail === email);

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
            avatar: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
            password: password,
            mail: email,
            username: usuario
          })
        });

        if (response.ok) {
          alert("Registro exitoso");
          const nuevoUsuario = await response.json();
          await AsyncStorage.setItem("userName", nuevoUsuario.name);
        } else {
          alert("Error al registrar el usuario");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error en la autenticación");
    }
  };

  return (
    <AuthContext.Provider value={{ userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider