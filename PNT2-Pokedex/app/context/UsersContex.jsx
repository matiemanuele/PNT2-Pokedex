import { createContext, useEffect, useState, useContext } from "react";
import { useUser } from "./AuthContext";

const UsersContext = createContext();

export function useUserContext() {
  return useContext(UsersContext);
}

const UsersContextProvider = ({ children }) => {

  const { currentUser } = useUser()

  const eliminarUsuario = async (id) => {
    if (currentUser.name === "admin") {
      const response = await fetch(`https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json"
        }
      });

      if (response.ok) {
        alert("Usuario eliminado correctamente")
      } else {
        console.log("Error al eliminar usuario")
      }
    } else {
      alert("No tenés permiso para eliminar un usuario")
    }
  }


  return (
    <UsersContext.Provider value={{ eliminarUsuario }}>
      {children}
    </UsersContext.Provider>
  )

}

export default UsersContextProvider