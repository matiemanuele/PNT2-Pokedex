import { View, Text, Image, Button, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useFavoritePokemons } from "../context/FavoritePokemonContext"; 


const PokemonDetail = () => {
  //const router = useRouter();
  const { id } = useLocalSearchParams();  
  const [pokemon, setPokemon] = useState(null);  
  const { addFavoritePokemon, removeFavoritePokemon, favoritePokemons } = useFavoritePokemons();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await respuesta.json();
        setPokemon(data);
      } catch (error) {
        console.error(`Error al obtener los detalles del pokemon: `, error);
      }
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) {
    return <Text>Cargando...</Text>;  
  }

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
      {pokemon.abilities.map(ability =>(
      <Text style={styles.descripcion} key={ability.ability.name}>{ability.ability.name}</Text> 
      ))}


      <Text  style={styles.subTitle}>Tipos:</Text>
      {pokemon.types.map(type => (
      <Text  style={styles.descripcion}  key={type.type.name}>{type.type.name}</Text>
      ))}

      <Text style={styles.subTitle}>Movimientos:</Text>
      {pokemon.moves.slice(0,5).map(move => (
      <Text  style={styles.descripcion} key={move.move.name}>{move.move.name}</Text>
      ))}


      <Text  style={styles.subTitle}>Estadísticas:</Text>
      {pokemon.stats.map(stat => (
      <Text  style={styles.descripcion} key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
      </Text>
       ))}

  

      <Text style={styles.subTitle}>Altura: </Text>
      <Text style ={styles.descripcion}>{pokemon.height /10} metros</Text>
      <Text style={styles.subTitle}>Peso:  </Text>
      <Text style ={styles.descripcion}>{pokemon.weight /10} kilogramos</Text>
      


      <Button  
    style={styles.button}
    title="Agregar a Favoritos"       
    onPress={() => {
                    if (favoritePokemons.find((pok) => pok.id === pokemon.id)) {
                       alert("El pokemon ya está en tus favoritos")
                    } else {
                        addFavoritePokemon(pokemon); 
                    }
                }} />


     <Button 
    style={styles.button}
    title="Quitar de Favoritos"       
    onPress={() => {
                    if (favoritePokemons.find((pok) => pok.id === pokemon.id)) {
                        removeFavoritePokemon(pokemon.id); 
                    } else {
                        alert("No tienes el pokemon en tu lista de favoritos")
                    }
                }} />


    
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', 
    padding: 20,
   
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', 
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '600', 
    color: '#2e2e2e',
    marginTop: 20,
    textAlign: 'left',
    width: '100%', 
    paddingHorizontal: 10,
  },
  descripcion: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 250, 
    height: 250,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10, 
    width: '80%',       
  }

});

export default PokemonDetail;