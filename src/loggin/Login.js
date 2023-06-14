import React, { useState,useEffect } from 'react';
import { Button } from '@rneui/themed';
import { View, TextInput, StyleSheet, Alert,Image } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import LinearGradient from 'react-native-linear-gradient';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
export default function Login({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [rol, setRol] = useState('PROFESOR');
  const handleSelectChange = (itemValue) => {
    setRol(itemValue);
  };
  const saveData = async (user, id ,rol,token,pass) => {
    try {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('id', id);
      await AsyncStorage.setItem('rol', rol);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('pass', pass);



      console.log('Datos guardados en AsyncStorage');
    } catch (error) {
      console.log('Error al guardar datos en AsyncStorage:', error);
    }
  }

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  useEffect(() => {
    const fetchCSRFCookie = async () => {
      axios.get('https://tfg-fmr.alwaysdata.net/back/public/sanctum/csrf-cookie', { withCredentials: true })
        .then(response => {
          console.log("Success", response)
        })
        .catch(error => {
          console.log("Error", error);
        });
    };
  
    fetchCSRFCookie();
    saveData(user, '', rol, ''); 
  }, [rol]);
  
  const loginVerify = () => {
    axios
      .post('https://tfg-fmr.alwaysdata.net/back/public/api/login', {
        email: user,
        password: pass,
        role: rol
      }, { withCredentials: true })
      .then(response => {
        const responseData = response.data;
        console.log("Success", responseData);
  
        if (responseData.success) {
          saveData(user, responseData.data.user_id.toString(), responseData.data.userRole, responseData.data.token,pass);
          navigation.navigate('Home');
        } else {
          setPass('');
          Alert.alert('Credenciales incorrectas'); // Mostrar el prompt de notificación
        }
      })
      .catch(error => {
        setPass(''); 
        Alert.alert('Credenciales incorrectas'); // Mostrar el prompt de notificación
      });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reiniciar los valores de los campos user y pass
      setUser('');
      setPass('');
    });

    return unsubscribe;
  }, [navigation]);
  

  return (
    <LinearGradient
      colors={['white', 'white']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
        <Image
    source={require('../images/escudoMachado.jpg')
  }     style={styles.image}

  />
      <Text style={styles.Text}>Usuario</Text>
      <View style={styles.inputContainer} >
        <TextInput style={styles.input} value={user} onChangeText={setUser} />
      </View>

      <Text style={styles.Text}>contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={pass} onChangeText={setPass} secureTextEntry={true} />
      </View>

      <View style={{borderWidth:1, borderRadius:2, marginTop:10}}>
        <Picker
          selectedValue={rol}
          onValueChange={handleSelectChange}
          style={styles.picker}
          placeholder={"Elija rol"}
          
        >
          <Picker.Item label="profesor" value="PROFESOR" />
          <Picker.Item label="coordinador TIC" value="COORDINADOR TIC" />
          <Picker.Item label="directivo" value="DIRECTIVO" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button type="solid" buttonStyle={styles.buttonStyle} onPress={() => {   loginVerify()}}>Acceder</Button>
      </View>

    </LinearGradient>
  )
}



const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
    width:'100%',    backgroundColor: '#b8f7d4'

  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  picker: {
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: 250
  },
  buttonStyle:{
    padding:'auto',
    marginTop:5,
    width:200,
    height:60,
    borderRadius:10,
    backgroundColor: '#007932'
 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    marginTop: 0,

    fontSize: 15,
    marginBottom:0,
    fontFamily: 'NotoSansHK-Medium',

  },
  header: {
    backgroundColor: '#FFA07A',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOptionText: {
    marginLeft: 5,
    fontSize: 16,
  },
  inputContainer: {
    width: '90%',
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    justifyContent: 'center', 
    borderRadius:3
  },
  input: {
    height: 40,
    backgroundColor: 'white'
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#0c9cee',
    borderRadius: 10,
  },
});
