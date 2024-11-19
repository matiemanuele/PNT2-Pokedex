import { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useUser() {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {

  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser')

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserName(parsedUser.name)
          setCurrentUser(parsedUser)
        }
      } catch (error) {
        console.error('Error leading user data', error)
      }
    }
    loadUserData()
  }, [])


  const login = async (usuario, password) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users")
      const data = await response.json();
      const user = data.find(u => u.user === usuario && u.password === password)

      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user))
        setUserName(user.name);
        setCurrentUser(user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return null
    }
  };

  const register = async (usuario, email, password, nombre, profileImage) => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const userExiste = data.some(u => u.user === usuario);
      const mailExiste = data.some(u => u.email === email);

      if (userExiste) {
        alert("Este usuario ya está registrado");
        return false
      }
      if (mailExiste) {
        alert("Ya existe una cuenta con este email");
        return false
      }

      const response2 = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name: nombre,
          password: password,
          email: email,
          user: usuario,
          profilePicture: profileImage
        })
      });

      if (response2.ok) {
        const nuevoUsuario = await response2.json();
        await AsyncStorage.setItem('currentUser', JSON.stringify(nuevoUsuario))
        setUserName(nuevoUsuario.name)
        setCurrentUser(nuevoUsuario)
        return true
      } else {
        return null
      }

    } catch (error) {
      console.error(error);
      return null
    }
  };

  return (
    <AuthContext.Provider value={{ userName, currentUser, setCurrentUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider