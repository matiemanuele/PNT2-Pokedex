
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button } from 'react-native';
import { useFavoritePokemons } from '../context/FavoritePokemonContext'; // Importamos el contexto
import { useUser } from '../context/AuthContext';
import { UsePfp } from '../context/PfpContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileTab = () => {

  const { userName } = useUser()
  const { pokemonImage, savePokemonImage } = UsePfp()
  const { favoritePokemons } = useFavoritePokemons() // Obtenemos los Pokémon favoritos desde el contexto

  useEffect(() => {
    const checkedStoragedImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("pokemonImage")
        if (storedImage) {
          savePokemonImage(storedImage)
        } else if (!pokemonImage) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
          const data = await response.json();
          savePokemonImage(data.sprites.front_default);
        }
      } catch (error) {
        console.error('Error fetching Pokémon image:', error);
      }
    }
    checkedStoragedImage();
  }, []);

  const pickImage = async () => {

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.canceled) {
        savePokemonImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Hola, {userName}</Text>
      {pokemonImage ? (
        <Image source={{ uri: pokemonImage }} style={styles.pokemonImage} />
      ) : (
        <Text>Cargando imagen de Pokémon...</Text>
      )}
      <Button title='Cambiar imagen' onPress={pickImage} />
      <Text style={styles.title}>Tus Pokémones Favoritos</Text>
      {favoritePokemons.length === 0 ? (
        <Text>No tienes Pokémon favoritos aún</Text>
      ) : (
        <FlatList
          data={favoritePokemons}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.pokemonCard}>
              <Text style={styles.pokemonName}>{item.name}</Text>
              <Image source={{ uri: item.image }} style={styles.pokemonImage} />
            </View>
          )}
        />
      )}
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

export default ProfileTab;
