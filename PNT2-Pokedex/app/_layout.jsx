import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import AuthProvider from "./context/AuthContext";
import PfpProvider from "./context/PfpContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <AuthProvider>
            <PfpProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </PfpProvider>
        </AuthProvider>
    );
}
