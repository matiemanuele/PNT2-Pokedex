import { ScrollView, View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { useFavoritePokemons } from "../context/FavoritePokemonContext";

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
    <ScrollView style={styles.container}>
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

      <Text style={styles.subTitle}>Habilidades:</Text>
      {pokemon.abilities.map((ability) => (
        <Text style={styles.descripcion} key={ability.ability.name}>
          {ability.ability.name}
        </Text>
      ))}

      <Text style={styles.subTitle}>Tipos:</Text>
      {pokemon.types.map((type) => (
        <Text style={styles.descripcion} key={type.type.name}>
          {type.type.name}
        </Text>
      ))}

      <Text style={styles.subTitle}>Movimientos:</Text>
      {pokemon.moves.slice(0, 5).map((move) => (
        <Text style={styles.descripcion} key={move.move.name}>
          {move.move.name}
        </Text>
      ))}

      <Text style={styles.subTitle}>Estadísticas:</Text>
      {pokemon.stats.map((stat) => (
        <Text style={styles.descripcion} key={stat.stat.name}>
          {stat.stat.name}: {stat.base_stat}
        </Text>
      ))}

      <Text style={styles.subTitle}>Altura: </Text>
      <Text style={styles.descripcion}>{pokemon.height / 10} metros</Text>
      <Text style={styles.subTitle}>Peso: </Text>
      <Text style={styles.descripcion}>{pokemon.weight / 10} kilogramos</Text>

      <View style={styles.buttonContainer}>
        {!isFavorite ? (
          <Button
            disabled={loading}
            style={styles.button}
            title="Agregar a Favoritos"
            onPress={() => handleToggleFavorite("add")}
          />
        ) : (
          <Button
            disabled={loading}
            style={styles.button}
            title="Quitar de Favoritos"
            onPress={() => handleToggleFavorite("remove")}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  subTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2e2e2e",
    marginTop: 20,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
  },
  descripcion: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: "80%",
  },
});

export default PokemonDetail;
