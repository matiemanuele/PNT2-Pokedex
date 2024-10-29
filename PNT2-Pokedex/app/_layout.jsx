import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout (){
    const colorscheme = useColorScheme();
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="homeScreen" options={{headerShown: false}} />
           
        </Stack>
    )
}