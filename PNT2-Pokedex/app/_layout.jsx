import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import AuthProvider from "./context/AuthContext";
import PfpProvider from "./context/PfpContext";
import FavoritePokemonProvider from "./context/FavoritePokemonContext";
import UsersContextProvider from "./context/UsersContex";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <PfpProvider>
            <AuthProvider>
                <FavoritePokemonProvider>
                    <UsersContextProvider>
                         <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="componentes/PokemonCard" options={{ headerTitle: "Pokemon" }} />
                    </Stack>
                    </UsersContextProvider>
                   
                </FavoritePokemonProvider>
            </AuthProvider>
        </PfpProvider >
    );
}
