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
      } else {
        await removeFavoritePokemon(pokemon.id)
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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{pokemon.forms && pokemon.forms[0]?.name}</Text>
        {pokemon.sprites && pokemon.sprites.front_default ? (
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{ uri: pokemon.sprites.front_default }}
            />
          </View>
        ) : (
          <Text>No se encontró imagen del pokemon</Text>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.card}>
          <Text style={styles.subTitle}>🔥 Habilidades:</Text>
          {pokemon.abilities.map((ability) => (
            <Text style={styles.descripcion} key={ability.ability.name}>
              {ability.ability.name}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subTitle}>🌈 Tipos:</Text>
          {pokemon.types.map((type) => (
            <Text style={styles.descripcion} key={type.type.name}>
              {type.type.name}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subTitle}>⚡ Movimientos:</Text>
          {pokemon.moves.slice(0, 5).map((move) => (
            <Text style={styles.descripcion} key={move.move.name}>
              {move.move.name}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subTitle}>📊 Estadísticas:</Text>
          {pokemon.stats.map((stat) => (
            <Text style={styles.descripcion} key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subTitle}>📏 Detalles Físicos:</Text>
          <Text style={styles.descripcion}>Altura: {pokemon.height / 10} metros</Text>
          <Text style={styles.descripcion}>Peso: {pokemon.weight / 10} kilogramos</Text>
        </View>
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
    backgroundColor: "#F0F4F8",
  },
  headerContainer: {
    backgroundColor: "#FFCB05",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3B4CCA",
    textAlign: "center",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  imageWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 250,
    height: 250,
  },
  detailsContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#3B4CCA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3B4CCA",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#FFCB05",
    paddingBottom: 5,
  },
  descripcion: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B4CCA",
    padding: 15,
    borderRadius: 10,
  },
  buttonRemove: {
    backgroundColor: "#FF1C1C",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default PokemonDetail;