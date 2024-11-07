import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import { useUser } from '../context/UserContext'

const ProfileTab = ({ route }) => {
  const [userName, setUserName] = useState('')
  const [favoritePokemons, setFavoritePokemons] = useState([])
  const [pokemonImage, setPokemonImage] = useState('');

  const { userNameContext } = useUser()

  useEffect(() => {
    setUserName(userNameContext)
  }, []);

  // useEffect(() => {
  //   const storedUserName = localStorage.getItem("userName")
  //   setUserName(storedUserName || 'Invitado')
  // }, []);

  useEffect(() => {
    setFavoritePokemons([
      { id: '001', name: 'Bulbasaur' },
      { id: '004', name: 'Charmander' },
      { id: '007', name: 'Squirtle' },
    ]);
  }, []);

  useEffect(() => {
    const fetchPokemonImage = async () => {
      try {
        const randomId = Math.floor(Math.random() * 898) + 1
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        const data = await response.json();
        setPokemonImage(data.sprites.front_default)
      } catch (error) {
        console.error('Error fetching Pokémon image:', error)
      }
    };

    fetchPokemonImage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Hola, {userName}</Text>
      {pokemonImage ? (
        <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
      ) : (
        <Text>Cargando imagen de Pokémon...</Text>
      )}
      <Text style={styles.title}>Tus Pokémones Favoritos</Text>
      <FlatList
        data={favoritePokemons}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f1f1f1',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  pokemonCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  pokemonName: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileTab
