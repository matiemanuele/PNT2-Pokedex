import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import AuthProvider from "./context/AuthContext";
import PfpProvider from "./context/PfpContext";
import FavoritePokemonProvider from "./context/FavoritePokemonContext";
import UsersContextProvider from "./context/UsersContex";

const shouldShowUsuarios = false; // Cambia esta variable según tu lógica

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <PfpProvider>
                <FavoritePokemonProvider>
                    <UsersContextProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="componentes/PokemonCard" options={{ headerTitle: "Pokemon" }} />
                        </Stack>
                    </UsersContextProvider>
                </FavoritePokemonProvider>
            </PfpProvider>
        </AuthProvider>
    );
}