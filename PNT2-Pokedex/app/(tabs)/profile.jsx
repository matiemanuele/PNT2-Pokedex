import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { useFavoritePokemons } from '../context/FavoritePokemonContext';
import { usePfp } from '../context/PfpContext';
import usePokemonData from '../../components/usePokemonData';
import { useUser } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const ProfileTab = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [displayPokemons, setDisplayPokemons] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const { profileImage, setProfileImage } = usePfp();
  const { currentUser, setCurrentUser } = useUser()
  const { favoritePokemons } = useFavoritePokemons();
  const { pokemons, loading } = usePokemonData()

  const router = useRouter()

  useEffect(() => {
    const syncProfileImage = async () => {
      try {
        if (currentUser?.profilePicture && currentUser.profilePicture !== profileImage) {
          setProfileImage(currentUser.profilePicture);
        }
      } catch (error) {
        console.error('Error al sincronizar la imagen de perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncProfileImage();
  }, [currentUser, profileImage, setProfileImage]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${currentUser.id}`);
        if (!response.ok) {
          throw new Error('Error al cargar los datos del usuario');
        }
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        alert('No se pudieron cargar los datos del usuario.');
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, []);

  const loadRandomPokemons = async () => {
    if (pokemons.length === 0) return

    try {
      const randomPokemons = []
      const tempPokemons = [...pokemons]

      for (let i = 0; i < 9 && tempPokemons.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * tempPokemons.length)
        const pokemon = tempPokemons.splice(randomIndex, 1)[0]

        const response = await fetch(pokemon.url)
        const data = await response.json()

        randomPokemons.push({
          id: data.id,
          name: pokemon.name,
          sprite: data.sprites.front_default
        })
      }

      setDisplayPokemons(randomPokemons)
    } catch (error) {
      console.error('Error loading sprites:', error)
      alert('Error al cargar las opciones de imagen')
    }
  }

  const selectProfilePicture = async (spriteUrl) => {
    setIsLoading(true)
    try {
      const updatedUser = {
        ...currentUser,
        profilePicture: spriteUrl,
      }

      const response = await fetch(
        `https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${currentUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser)
        }
      )
      if (!response.ok) {
        throw new Error('Error al actualizar la imagen de perfil')
      }

      const updatedUserData = await response.json()
      setProfileImage(spriteUrl)
      setCurrentUser(updatedUserData)
      setModalVisible(false)

    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Error al actualizar la imagen de perfil');
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (modalVisible && pokemons.length > 0) {
      loadRandomPokemons()
    }
  }, [modalVisible, pokemons])

  const handleLogout = () => {
    setCurrentUser(null)
    setProfileImage(null)
    router.replace({ pathname: '/' })
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>Hola, {currentUser?.name}</Text>

      <View style={styles.profileSection}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : currentUser?.profilePicture ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person-circle-outline" size={60} color="#aaa" />
            <Text>No hay imagen de perfil</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
          disabled={loading}
        >
          <Ionicons name="camera" size={16} color="#fff" />
          <Text style={styles.buttonText}>Cambiar imagen</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de selección de Pokémon */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Elige tu Pokémon</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#007bff" />
            ) : (
              <FlatList
                data={displayPokemons}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.spriteOption}
                    onPress={() => selectProfilePicture(item.sprite)}
                  >
                    <Image
                      source={{ uri: item.sprite }}
                      style={styles.spriteImage}
                    />
                    <Text style={styles.spriteName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
              />
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Más opciones"
                onPress={loadRandomPokemons}
                disabled={loading}
                color="#007bff"
              />
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Tus Pokémones Favoritos</Text>
      {favoritePokemons.length === 0 ? (
        <Text style={styles.emptyMessage}>No tienes Pokémon favoritos aún</Text>
      ) : (
        <FlatList
          data={favoritePokemons}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.pokemonCard}>
              <Text style={styles.pokemonName}>{item.name}</Text>
              <Image
                source={{ uri: item.image }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            </View>
          )}
        />
      )}
      <TouchableOpacity style={[styles.button, { backgroundColor: "red", marginTop: 20 }]} onPress={handleLogout}>
        <Ionicons name="exit-outline" size={16} color="#fff" />
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f7f7',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  emptyMessage: {
    marginTop: 20,
    color: '#666',
  },
  pokemonCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 100,
    height: 120,
  },
  pokemonImage: {
    width: 60,
    height: 60,
  },
  pokemonName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    marginTop: 5,
    maxWidth: '90%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  flatListContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  spriteOption: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  spriteImage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  spriteName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


export default ProfileTab;