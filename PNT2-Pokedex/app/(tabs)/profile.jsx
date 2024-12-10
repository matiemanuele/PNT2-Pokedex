import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { useFavoritePokemons } from '../context/FavoritePokemonContext';
import { usePfp } from '../context/PfpContext';
import usePokemonData from '../../components/usePokemonData';
import { useUser } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileTab = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayPokemons, setDisplayPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { profileImage, setProfileImage, removeProfileImageFromServer } = usePfp();
  const { currentUser, setCurrentUser } = useUser();
  const { favoritePokemons } = useFavoritePokemons();
  const { pokemons, loading: pokemonDataLoading } = usePokemonData();

  const router = useRouter();

  // Sincronización inicial del perfil
  useEffect(() => {
    if (currentUser?.profilePicture) {
      setProfileImage(currentUser.profilePicture);
    }
  }, [currentUser]);

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (currentUser?.id) {
      fetchUserData(currentUser.id);
    }
  }, []);

  // Manejo del modal y pokémones aleatorios
  useEffect(() => {
    if (modalVisible && pokemons.length > 0) {
      loadRandomPokemons();
    }
  }, [modalVisible, pokemons.length]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${userId}`);
      if (!response.ok) throw new Error('Error al cargar los datos del usuario');
      const userData = await response.json();
      setCurrentUser(userData);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los datos del usuario.');
    }
  };

  const loadRandomPokemons = async () => {
    try {
      const randomPokemons = pokemons
        .sort(() => 0.5 - Math.random())
        .slice(0, 9)
        .map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          const data = await response.json();
          return {
            id: data.id,
            name: pokemon.name,
            sprite: data.sprites.front_default,
          };
        });

      setDisplayPokemons(await Promise.all(randomPokemons));
    } catch (error) {
      console.error(error);
      alert('Error al cargar las opciones de imagen.');
    }
  };

  const updateProfilePicture = async (spriteUrl) => {
    setIsLoading(true);
    try {
      const updatedUser = { ...currentUser, profilePicture: spriteUrl };
      const response = await fetch(
        `https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users/${currentUser.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error('Error al actualizar la imagen de perfil');
      // const updatedData = await response.json();
      setProfileImage(spriteUrl);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profilePicture: spriteUrl,
      }));
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar la imagen de perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    setIsLoading(true);
    try {
      await removeProfileImageFromServer(currentUser.id);
    } catch (error) {
      alert('No se pudo eliminar la imagen de perfil. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setProfileImage(null);
    router.replace({ pathname: '/' });
  };

  if (isLoading || pokemonDataLoading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  const getTypeGradient = (index) => {
    const typeGradients = [
      ['#3395D8', '#5BCAFF'],     // Water
      ['#FF6C04', '#FF9900'],     // Fire
      ['#3BA655', '#8BC34A'],     // Grass
      ['#A040A0', '#C183C1'],     // Poison
      ['#E0C068', '#F0E68C'],     // Ground
      ['#B8B8D0', '#D1D1E0'],     // Steel
      ['#7038F8', '#9180F0'],     // Dragon
      ['#FF4081', '#FF80AB']      // Psychic
    ];
    return typeGradients[index % typeGradients.length];
  };

  return (
    <LinearGradient
      colors={['#3395D8', '#5BCAFF']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.userName}>Hola, Entrenador {currentUser?.name}</Text>

        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#FF6C04', '#FF9900']}
            style={styles.profileImageContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person-circle-outline" size={80} color="#fff" />
                <Text style={styles.placeholderText}>Elige tu Avatar</Text>
              </View>
            )}
          </LinearGradient>

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setModalVisible(true)}
              disabled={pokemonDataLoading}
            >
              <Ionicons name="camera" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Cambiar Avatar</Text>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity
                style={[styles.actionButton, styles.removeButton]}
                onPress={handleRemoveProfileImage}
              >
                <Ionicons name="trash" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tus Pokémones Favoritos</Text>
        {favoritePokemons.length === 0 ? (
          <Text style={styles.emptyMessage}>Aún no has atrapado Pokémon</Text>
        ) : (
          <FlatList
            data={favoritePokemons}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <LinearGradient
                colors={getTypeGradient(index)}
                style={styles.favoritePokemonCard}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.favoritePokemonImage}
                />
                <Text style={styles.favoritePokemonName}>{item.name}</Text>
              </LinearGradient>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="exit-outline" size={16} color="#fff" />
          <Text style={styles.logoutButtonText}>Abandonar Aventura</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Modal remains the same */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Elige tu Compañero</Text>
            {pokemonDataLoading ? (
              <ActivityIndicator size="large" color="#007bff" />
            ) : (
              <FlatList
                data={displayPokemons}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.spriteOption}
                    onPress={() => updateProfilePicture(item.sprite)}
                  >
                    <Image source={{ uri: item.sprite }} style={styles.spriteImage} />
                    <Text style={styles.spriteName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <View style={styles.modalButtons}>
              <Button title="Más Opciones" onPress={loadRandomPokemons} disabled={pokemonDataLoading} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4081',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#BEBEBE',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  favoritePokemonCard: {
    width: 110,
    height: 140,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoritePokemonImage: {
    width: 80,
    height: 80,
  },
  favoritePokemonName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Existing modal styles remain largely the same
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
  },
  spriteOption: {
    width: 100,
    height: 120,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteImage: {
    width: 80,
    height: 80,
  },
  spriteName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProfileTab;