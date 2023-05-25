import React, { useState,useEffect } from 'react';
import { Button } from '@rneui/themed';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
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
  const saveData = async (user, id ,rol,token) => {
    try {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('id', id);
      await AsyncStorage.setItem('rol', rol);
      await AsyncStorage.setItem('token', token);



      console.log('Datos guardados en AsyncStorage');
    } catch (error) {
      console.log('Error al guardar datos en AsyncStorage:', error);
    }
  }

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  useEffect(() => {
    const fetchCSRFCookie = async () => {
      axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
        .then(response => {
          console.log("Success", response)
        })
        .catch(error => {
          console.log("Error", error);
        });
    };
  
    fetchCSRFCookie();
    saveData(user, '', rol, ''); // Pasa los valores correctos a saveData()
  }, [rol]);
  
  const loginVerify = () => {
    axios
      .post('http://localhost:8000/api/login', {
        email: user,
        password: pass,
        role: rol
      }, { withCredentials: true })
      .then(response => {
        const responseData = response.data;
        console.log("Success", responseData);
  
        if (responseData.success) {
          saveData(user, responseData.data.user_id.toString(), responseData.data.userRole, responseData.data.token);
          navigation.navigate('Home');
        } else {
          setPass(''); // Reiniciar el valor del campo pass
          Alert.alert('Credenciales incorrectas'); // Mostrar el prompt de notificación
        }
      })
      .catch(error => {
        setPass(''); // Reiniciar el valor del campo pass
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
      colors={['#b8f7d4', '#b8f7d4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.Text}>Usuario</Text>
      <View style={styles.inputContainer} >
        <TextInput style={styles.input} value={user} onChangeText={setUser} />
      </View>

      <Text style={styles.Text}>contraseña</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={pass} onChangeText={setPass} secureTextEntry={true} />
      </View>

      <View>
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
        <Button type="solid" onPress={() => {   loginVerify()}}>Acceder</Button>
      </View>

    </LinearGradient>
  )
}

// Resto del código...


const styles = StyleSheet.create({
  picker: {
    alignItems: 'center',
    justifyContent: 'center', 
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 250
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    marginTop: 40,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 15,
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
    marginTop: 3,
    width: '90%',
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    justifyContent: 'center', // centrado vertical
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
