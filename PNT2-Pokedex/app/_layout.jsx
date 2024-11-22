import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { UserProvider } from "./context/UserContext";
import { FavoritePokemonProvider } from "./context/FavoritePokemonContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <UserProvider>
            <FavoritePokemonProvider>
                 <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="componentes/[id]" options={{ headerTitle: "Pokemon"}} />
            </Stack>
            </FavoritePokemonProvider>
           
        </UserProvider>
    );
}
