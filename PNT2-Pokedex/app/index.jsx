import { StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";
import { Switch } from "react-native";
import { Button } from "react-native";
import { Pressable, onPress } from "react-native";
import { router } from "expo-router";
import { useRouter } from "expo-router";

export default function Page() {

    const [esLogin, setLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");

    const router = useRouter();



  const handleLogin = async () => {

      try {
        const response = await fetch("https://67183558b910c6a6e02b585f.mockapi.io/api/v1/users");
        const data = await response.json();
        const user = data.find(u => u.username === usuario && u.password === password)

        if(user){
          alert("Login conseguido")
          router.push("/homeScreen");
        }else{
          alert("Login fallido")
        }

      } catch (error) {
        console.error(error)
        alert("Error en la autenticación")
      }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("https://67183558b910c6a6e02b585f.mockapi.io/api/v1/users");
      const data = await response.json();
      const userExiste = data.some(u => u.username === usuario)
      const mailExiste = data.some(u => u.mail === email)

      if(userExiste){
        alert("Este usuario ya está registrado")
      }else if(mailExiste){
        alert("Ya existe una cuenta con este email")
      }else{
        const response = await fetch("https://67183558b910c6a6e02b585f.mockapi.io/api/v1/users", {
            method: "POST",
            headers:{
              "Content-type":"application/json"
            },
            body: JSON.stringify({
              name: nombre,
              avatar: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
              password: password,
              mail: email,
              username: usuario
            })
        });

        if(response.ok){
          alert("Registro exitoso")
          const nuevoUsuario = response.json();
          router.push("/homeScreen");
        }else{
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
        <Text style={styles.subtitle}>{esLogin?"Inicia sesión con tu cuenta":"Crea una cuenta"}</Text>
        <Text>Usuario: </Text> 
        <TextInput style={styles.input}
        placeholder = "nombre usuario"
        /> 
        {
          !esLogin &&(
            <>
        <Text>Email: </Text> 
        <TextInput style={styles.input}
        placeholder = "email@gmail.com"
        /> 

        <Text>Nombre: </Text>
        <TextInput style={styles.input}
        placeholder = "nombre"
        /> 
            </>
          )
        }
        <Text>Contraseña: </Text> 
       <TextInput style={styles.input}
        secureTextEntry = {true} 
        placeholder = "contraseña"
        /> 
      </View>
      <View style={styles.boton}>
       
        {esLogin ?
            (<Button title={"Iniciar sesión"} onPress={handleLogin}/>
    
            )
            //<Pressable style={styles.button} onPress={onPress}>
            //  <Text style={styles.text}>Iniciar sesión:</Text>
            //</Pressable>
            
          :
          (<Button title={"Registrarse"} onPress={handleRegister}/>)}
          
        
      </View>
      
      <View>
          <Text>{esLogin ? "Cambia a registrarse" : "Cambia a login"} </Text>
          <Switch value={esLogin} onValueChange={()=> setLogin(!esLogin)}/>
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
