import { Stack } from "expo-router";
import AuthProvider from "./context/AuthContext";
import PfpProvider from "./context/PfpContext";
import FavoritePokemonProvider from "./context/FavoritePokemonContext";
import UsersContextProvider from "./context/UsersContex";

export default function RootLayout() {
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