import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

export default function TabsLayout() {

    const colorScheme = useColorScheme();

    return (
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint
            }} >

                <Tabs.Screen
                    name="homeScreen"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons size={28} name={focused ? "home" : "home-outline"} color={Colors} />
                        )
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons size={28} name={focused ? "person-circle" : "person-circle-outline"} color={Colors} />
                        )
                    }}
                />
            </Tabs>
        //Hacer una tab por cada archivo del proyecto ej: una para el producto 
    )

}