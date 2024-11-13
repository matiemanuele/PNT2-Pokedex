import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { FavoritePokemonProvider } from "../context/FavoritePokemonContext"; 

export default function TabsLayout() {
    const colorScheme = useColorScheme();

    return (
        <FavoritePokemonProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                }}
            >
                <Tabs.Screen
                    name="homeScreen"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                size={28}
                                name={focused ? "home" : "home-outline"}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="pokedexScreen"
                    options={{
                        title: "Pokedex",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                size={28}
                                name={focused ? "list" : "list-outline"}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                size={28}
                                name={focused ? "person-circle" : "person-circle-outline"}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </FavoritePokemonProvider>
    );
}
