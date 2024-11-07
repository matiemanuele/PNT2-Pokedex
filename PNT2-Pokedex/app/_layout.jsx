import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { UserProvider } from "./context/UserContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <UserProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </UserProvider>
    );
}
