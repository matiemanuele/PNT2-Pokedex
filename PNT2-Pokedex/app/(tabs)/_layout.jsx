import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../context/AuthContext";

export default function TabsLayout() {
    const { currentUser } = useUser()

    // Pokémon-inspired color palette
    const tabColors = {
        home: ['#3395D8', '#5BCAFF'],        // Water Blue
        pokedex: ['#FF6C04', '#FF9900'],     // Fire Orange
        profile: ['#3BA655', '#8BC34A'],     // Grass Green
        users: ['#A040A0', '#C183C1']        // Poison Purple
    };

    // Custom tab bar background with gradient
    const TabBarBackground = () => (
        <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.tabBarBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        />
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarBackground: () => <TabBarBackground />,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="homeScreen"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <LinearGradient
                                colors={tabColors.home}
                                style={[
                                    styles.tabIconGradient,
                                    focused && styles.tabIconFocused
                                ]}
                            >
                                <Ionicons
                                    size={24}
                                    name={focused ? "home" : "home-outline"}
                                    color="#FFFFFF"
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="pokedexScreen"
                options={{
                    title: "Pokedex",
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <LinearGradient
                                colors={tabColors.pokedex}
                                style={[
                                    styles.tabIconGradient,
                                    focused && styles.tabIconFocused
                                ]}
                            >
                                <Ionicons
                                    size={24}
                                    name={focused ? "list" : "list-outline"}
                                    color="#FFFFFF"
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <LinearGradient
                                colors={tabColors.profile}
                                style={[
                                    styles.tabIconGradient,
                                    focused && styles.tabIconFocused
                                ]}
                            >
                                <Ionicons
                                    size={24}
                                    name={focused ? "person-circle" : "person-circle-outline"}
                                    color="#FFFFFF"
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="usuarios"
                options={{
                    href: currentUser?.user !== 'admin' ? null : undefined,
                    title: "Users",
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <LinearGradient
                                colors={tabColors.users}
                                style={[
                                    styles.tabIconGradient,
                                    focused && styles.tabIconFocused
                                ]}
                            >
                                <Ionicons
                                    size={24}
                                    name={focused ? "person" : "person-circle"}
                                    color="#FFFFFF"
                                />
                            </LinearGradient>
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    tabBar: {
        height: 50,
        paddingBottom: 20,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tabIconFocused: {
        transform: [{ scale: 1.1 }],
    },
});