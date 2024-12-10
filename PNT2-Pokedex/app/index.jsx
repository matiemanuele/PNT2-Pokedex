import { StyleSheet, Text, View, TextInput, Button, Image, useColorScheme, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "./context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {
  const [esLogin, setLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", usuario: "", password: "", nombre: "" });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login, register } = useUser();
  const colorScheme = useColorScheme(); // Obtiene el esquema de color del dispositivo

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAction = async () => {
    const { email, usuario, password, nombre } = formData;

    if (esLogin) {
      const result = await login(usuario, password);
      result ? router.push("/homeScreen") : alert("Login fallido");
    } else {
      const result = await register(usuario, email, password, nombre);
      alert(result ? "Registro exitoso" : "Error al registrar");
    }
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <Image
        source={{ uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png" }}
        style={styles.logo}
      />
      <Text style={[styles.title, colorScheme === 'dark' && styles.titleDark]}>¡Bienvenido a la Pokedex!</Text>
      <Text style={[styles.subtitle, colorScheme === 'dark' && styles.subtitleDark]}>
        {esLogin ? "Inicia sesión para continuar" : "Crea tu cuenta para empezar"}
      </Text>

      <View style={styles.main}>
        <TextInput
          style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
          placeholder="Nombre de usuario"
          value={formData.usuario}
          onChangeText={(text) => handleInputChange("usuario", text)}
        />
        {!esLogin && (
          <>
            <TextInput
              style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
              placeholder="email@gmail.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
              placeholder="Tu nombre"
              value={formData.nombre}
              onChangeText={(text) => handleInputChange("nombre", text)}
            />
          </>
        )}
        <View style={[styles.passwordContainer, colorScheme === 'dark' && styles.passwordContainerDark]}>
          <TextInput
            style={[styles.passwordInput, colorScheme === 'dark' && styles.passwordInputDark]}
            secureTextEntry={!showPassword}
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            onSubmitEditing={handleAction} // Llama a la acción al presionar Enter
          />
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
      </View>

      <Button
        title={esLogin ? "Iniciar sesión" : "Registrarse"}
        onPress={handleAction}
        color={esLogin ? "#007bff" : "#28a745"}
      />

      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, colorScheme === 'dark' && styles.switchTextDark]}>
          {esLogin ? (
            <TouchableOpacity onPress={() => setLogin(false)}>
              <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setLogin(true)}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#2e2e2e",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitleDark: {
    color: "#bbb",
  },
  main: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputDark: {
    backgroundColor: "#444",
    borderColor: "#666",
    color: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    width: "100%"
  },
  passwordContainerDark: {
    backgroundColor: "#444"
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  passwordInputDark: {
    backgroundColor: "#444",
    color: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  switchText: {
    fontSize: 14,
    color: "#555",
    marginRight: 10,
  },
  switchTextDark: {
    color: "#ddd",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
