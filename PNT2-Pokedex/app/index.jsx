import { StyleSheet, Text, View, TextInput, Switch, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "./context/UserContext";

export default function Page() {

  const [esLogin, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const router = useRouter();

  const { setUserNameContext } = useUser()

  const handleLogin = async () => {

    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const user = data.find(u => u.user === usuario && u.password === password)

      if (user) {
        alert("Login conseguido")
        setUserNameContext(user.name)
        // localStorage.setItem("userName", user.name);
        router.push("/homeScreen")
      } else {
        alert("Login fallido")
      }

    } catch (error) {
      console.error(error)
      alert("Error en la autenticación")
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users");
      const data = await response.json();
      const userExiste = data.some(u => u.user === usuario)
      const mailExiste = data.some(u => u.mail === email)

      if (userExiste) {
        alert("Este usuario ya está registrado")
      } else if (mailExiste) {
        alert("Ya existe una cuenta con este email")
      } else {
        const response = await fetch("https://6711a7964eca2acdb5f554b7.mockapi.io/api/v1/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            user: usuario,
            email: email,
            name: nombre,
            password: password,
          })
        });

        if (response.ok) {
          alert("Registro exitoso")
          const nuevoUsuario = await response.json();
          // localStorage.setItem("userName", nuevoUsuario.name);
        } else {
          alert("Error al registrar el usuario")
        }

      }

    } catch (error) {
      console.error(error)
      alert("Error en la autenticación")
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>{esLogin ? "Inicia sesión con tu cuenta" : "Crea una cuenta"}</Text>
        <Text>Usuario: </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre usuario"
          value={usuario}
          onChangeText={setUsuario}
        />
        {
          !esLogin && (
            <>
              <Text>Email: </Text>
              <TextInput style={styles.input}
                placeholder="email@gmail.com"
                value={email}
                onChangeText={setEmail}
              />

              <Text>Nombre: </Text>
              <TextInput style={styles.input}
                placeholder="nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </>
          )
        }
        <Text>Contraseña: </Text>
        <TextInput style={styles.input}
          secureTextEntry={true}
          placeholder="contraseña"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.boton}>

        {esLogin ?
          (<Button title={"Iniciar sesión"} onPress={handleLogin} />

          )
          //<Pressable style={styles.button} onPress={onPress}>
          //  <Text style={styles.text}>Iniciar sesión:</Text>
          //</Pressable>

          :
          (<Button title={"Registrarse"} onPress={handleRegister} />)}


      </View>

      <View>
        <Text>{esLogin ? "Cambia a registrarse" : "Cambia a login"} </Text>
        <Switch value={esLogin} onValueChange={() => setLogin(!esLogin)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: '#f1f1f1',
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    paddingStart: 20,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#fff",

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
