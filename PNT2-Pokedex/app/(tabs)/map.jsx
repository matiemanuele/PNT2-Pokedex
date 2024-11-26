import MapView, {Marker,Callout} from "react-native-maps";
import {View,Text,StyleSheet,Dimensions,TouchableOpacity,Button, } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions'



export default function Map(){


    const [location , setLocation] = useState(null);
    const [errorMsg , setErrorMsg] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState();
    const mapRef = useRef();
    const APIKEY = "AIzaSyCZVqSrxlAxhaeaF7bAxshgnK1yUSKHTX8"

    const ubicaciones = [
        { id: 1, name: 'Bulbasaur', latitude: -34.556591828200816, longitude: -58.45032213410907 },
        { id: 2, name: 'Ivysaur', latitude: -34.55682367595519, longitude:-58.43423317710948  },
        { id: 3, name: 'Venusaur', latitude: -34.59324947214262, longitude:-58.39487741054645  },
        { id: 4, name: 'Charmander', latitude: -34.505812650619056,  longitude:-58.47748602986516  },
        { id: 5, name: 'Charmeleon', latitude: -34.63395457063926,  longitude: -58.629520530535444 },
        { id: 6, name: 'Charizard', latitude:-34.62777881714358,  longitude:-58.60883229119439   },
        { id: 7, name: 'Squirtle', latitude: -34.41391806540347,  longitude:-58.57755937170811  },
        { id: 8, name: 'Wartortle', latitude: -34.70573155157677,  longitude:-58.46030655327833  },
        { id: 9, name: 'Blastoise', latitude:-34.4791708685282,  longitude:-58.52133217244232  },
        { id: 10, name: 'Caterpie', latitude: -34.5076628704712,  longitude: -58.52611847995442 },
    ]
    

    useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
    
        getCurrentLocation();
      }, []);

    


    const handleNavigate=(ubicacion)=>{
        setSelectedRoute(ubicacion)
    }

    const centerLocation = () => {
        if(location && mapRef.current){
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            })
        }
    }

    const resetCompass  = () => {
        if(mapRef.current){
            mapRef.current.animateCamera({heading:0})
        }
    }

    return(
        <View style={styles.container}>

       {location ? (
        <>
            <MapView 
            ref={mapRef}
            style={styles.map}  
            initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}

            showsUserLocation={true}
            followsUserLocation={true}

            >



    {ubicaciones.map((ubicacion)=> (
                    <Marker
                        key={ubicacion.id}
                        coordinate={{
                            latitude: ubicacion.latitude,
                            longitude: ubicacion.longitude}}

                        title={ubicacion.name}
                    >

                <Callout onPress={() => handleNavigate(ubicacion)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{ubicacion.name}</Text>
                    <Text style={styles.calloutDescription}>
                      noe
                    </Text>
                    <Button title="Ir"  onPress={() => handleNavigate(ubicacion)}/>
                  </View>
                </Callout>
                     

                     </Marker>
                ))} 

              

                {
                    selectedRoute && (
                        <MapViewDirections 
                        origin={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude}}
                        destination={{
                            latitude: selectedRoute.latitude,
                            longitude: selectedRoute.longitude
                        }}
                        apikey={APIKEY}
                        
                        
                        
                        />

                        
                    )
                }






            </MapView>

            <TouchableOpacity
            style={styles.button}
            onPress={() => centerLocation()}
          >
            <Ionicons name="locate" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonCompass]} onPress={() => resetCompass()}>
            <Ionicons name="compass" size={24} color="white" />
          </TouchableOpacity>

      </>
        ) : (
            <Text>Cargando mapa</Text>
        ) }

       



        </View>
    );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    },
    callout: {
      width: 150,
      alignItems: "center",
    },
    calloutTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    button: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "blue",
      borderRadius: 30,
      padding: 10,
      elevation: 3,
    },
    buttonCompass: {
      bottom: 80,
    },
  });

