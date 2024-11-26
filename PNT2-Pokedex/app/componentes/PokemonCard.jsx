import { ScrollView, View, Text, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { useFavoritePokemons } from "../context/FavoritePokemonContext";
import { Ionicons } from "@expo/vector-icons";

const PokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useLocalSearchParams();
  const { favoritePokemons, addFavoritePokemon, removeFavoritePokemon } = useFavoritePokemons()
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await respuesta.json();
        setPokemon(data);
      } catch (error) {
        console.error(`Error al obtener los detalles del pokemon: `, error);
        Alert.alert("Error", "No se pudo cargar el detalle del Pokémon");
      }
    };

    fetchPokemon();
  }, [id]);

  const handleToggleFavorite = async (action) => {
    if (!currentUser) {
      Alert.alert("Error", "Debes iniciar sesión para gestionar favoritos");
      return;
    }

    setLoading(true);
    try {
      if (action === "add") {
        await addFavoritePokemon(pokemon);
        Alert.alert("Éxito", "Pokémon agregado a favoritos")
      } else {
        await removeFavoritePokemon(pokemon.id)
        Alert.alert("Éxito", "Pokémon eliminado de favoritos")
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la lista de favoritos");
    } finally {
      setLoading(false);
    }
  };

  if (!pokemon) {
    return <Text>Cargando...</Text>;
  }

  const isFavorite = favoritePokemons.some((p) => p.id === pokemon.id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.title}>{pokemon.forms && pokemon.forms[0]?.name}</Text>
      {pokemon.sprites && pokemon.sprites.front_default ? (
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{ uri: pokemon.sprites.front_default }}
        />
      ) : (
        <Text>No se encontró imagen del pokemon</Text>
      )}


      <View style={styles.card}>
        <Text style={styles.subTitle}>Habilidades:</Text>
        {pokemon.abilities.map((ability) => (
          <Text style={styles.descripcion} key={ability.ability.name}>
            {ability.ability.name}
          </Text>
        ))}
      </View>




      <View style={styles.card}>

        <Text style={styles.subTitle}>Tipos:</Text>
        {pokemon.types.map((type) => (
          <Text style={styles.descripcion} key={type.type.name}>
            {type.type.name}
          </Text>
        ))}
      </View>



      <View style={styles.card}>
        <Text style={styles.subTitle}>Movimientos:</Text>
        {pokemon.moves.slice(0, 5).map((move) => (
          <Text style={styles.descripcion} key={move.move.name}>
            {move.move.name}
          </Text>
        ))}
      </View>



      <View style={styles.card}>

        <Text style={styles.subTitle}>Estadísticas:</Text>
        {pokemon.stats.map((stat) => (
          <Text style={styles.descripcion} key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </Text>
        ))}
      </View>


      <View style={styles.card}>
        <Text style={styles.subTitle}>Altura: </Text>
        <Text style={styles.descripcion}>{pokemon.height / 10} metros</Text>
        <Text style={styles.subTitle}>Peso: </Text>
        <Text style={styles.descripcion}>{pokemon.weight / 10} kilogramos</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isFavorite ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleToggleFavorite("add")}
          >
            <Ionicons name="heart-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Agregar a Favoritos</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonRemove]}
            onPress={() => handleToggleFavorite("remove")}
            disabled={loading}
          >
            <Ionicons name="heart-dislike-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Quitar de Favoritos</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#424242",
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#bdbdbd",
  },
  card: {
    backgroundColor: "#e8eaf6",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffcc01", // Amarillo temático
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonRemove: {
    backgroundColor: "#e53935", // Rojo para quitar
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8, // Espacio entre el ícono y el texto
  },
  descripcion: {
    fontSize: 16,
    color: "#616161",
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PokemonDetail;
