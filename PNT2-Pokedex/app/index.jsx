import { StyleSheet, Text, View, TextInput, Switch, Button, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "./context/AuthContext";
import { usePfp } from "./context/PfpContext";
import { Ionicons } from "@expo/vector-icons";

export default function Page() {

  const [esLogin, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nombre, setNombre] = useState("");

  const router = useRouter();

  const { login, register } = useUser()
  const { randomProfileImage } = usePfp()

  const handleLogin = async () => {
    const result = await login(usuario, password)
    if (result === true) {
      alert("Login conseguido")
      router.push("/homeScreen")
    } else if (result === false) {
      alert("Login fallido")
    } else {
      alert("Error en la autenticación")
    }
  }

  const handleRegister = async () => {
    const profileImage = await randomProfileImage()
    const result = await register(usuario, email, password, nombre, profileImage)
    if (result === true) {
      alert("Registro exitoso")
    } else if (result === false) {
      alert("Usuario o email ya registrado")
    } else {
      alert("Error en la autenticación")
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" }}
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a la Pokedex!</Text>
      <Text style={styles.subtitle}>
        {esLogin ? "Inicia sesión para continuar" : "Crea tu cuenta para empezar"}
      </Text>

      <View style={styles.main}>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={usuario}
          onChangeText={setUsuario}
        />
        {!esLogin && (
          <>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="email@gmail.com"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          </>
        )}
        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={esLogin ? "Iniciar sesión" : "Registrarse"}
          onPress={esLogin ? handleLogin : handleRegister}
          color={esLogin ? "#007bff" : "#28a745"}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {esLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </Text>
        <Switch
          value={esLogin}
          onValueChange={() => setLogin(!esLogin)}
          thumbColor={esLogin ? "#007bff" : "#28a745"}
          trackColor={{ false: "#d6d6d6", true: "#a3d9a5" }}
        />
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
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  main: {
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
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
  buttonContainer: {
    marginVertical: 20,
    width: "100%",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
});