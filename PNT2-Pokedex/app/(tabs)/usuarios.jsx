import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Button } from "react-native";
import { useUserContext } from "../context/UsersContex";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const { eliminarUsuario } = useUserContext();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const respuesta = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
        const data = await respuesta.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleEliminarUsuario = async (id) => {
    try {
      await eliminarUsuario(id); // Llamada al contexto
      setUsuarios((prevUsuarios) => prevUsuarios.filter((user) => user.id !== id)); // Actualización local
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Filtrar usuarios, excluyendo el de id 0
  const usuariosFiltrados = usuarios.filter((usuario) => usuario.id !== "0");

  return (
    <View style={styles.container}>
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.userContainer}>
            <Image source={{ uri: item.profilePicture }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detalle}>Nombre usuario: {item.user}</Text>
              <Text style={styles.detalle}>Email: {item.email}</Text>
              <Button title="Eliminar usuario" onPress={() => handleEliminarUsuario(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "wheat",
    padding: 30,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c1bdbd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  detalle: {
    fontSize: 16,
    color: "#666",
  },
});
