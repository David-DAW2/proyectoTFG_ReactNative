import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, Alert, TextInput, TouchableHighlight } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Flex } from 'native-base';

export default function DetailUser({ route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { userData } = route.params;
  const navigation = useNavigation();
  const [nameUser, setNameUser] = useState('')
  const [idUser, setIdUser] = useState('')
  const [token, setToken] = useState('')
  const [emailUser, setEmailUser] = useState('')
  const [convertCoor, setConvertCoor] = useState(false);
  const [convertDirect, setConvertDirect] = useState(false);
  const [resetPassDni, setResetPassDni] = useState(false);

  const [editState, setEditState] = useState(false)
  const navigateToMyReports = () => {
    navigation.navigate('Home')
  }
  useLayoutEffect(() => {
    setIdUser(userData.id)
    console.log(userData.name)
    setNameUser(userData.name)
    setEmailUser(userData.email)
  }, [route, route.params])

  useLayoutEffect(() => {
    console.log(resetPassDni)

  }, [resetPassDni, convertDirect, convertCoor])

  useEffect(() => {
    const getData = async () => {
      try {
        setToken(await AsyncStorage.getItem('token'));
      } catch (error) {
        console.log('Error al obtener datos de AsyncStorage:', error);
      }
    };
    getData();
  }, []);
  const deleteUser = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas borrar este usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          onPress: () => {
            const headers = {
              authorization: `Bearer ${token}`,
            };
            axios
              .delete(`http://localhost:8000/api/user/${idUser}`, { headers })
              .then(response => {
                Alert.alert('Usuario borrado con éxito');
              })
              .catch(error => {
                console.log('Error al obtener los usuarios:', error);
                Alert.alert('No se ha encontrado el usuario');
              });
          },
        },
      ]
    );
  };
  const updateUser = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres guardar los cambios?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Guardar',
          onPress: () => {
            const params = {
            id:idUser,
            name:nameUser,
            email:emailUser,
            directive:convertDirect,
            restore:resetPassDni,
            coordinator:convertCoor
          
            };
            const headers = {
              authorization: `Bearer ${token}`,
            };
            axios
              .put(`http://localhost:8000/api/user/${idUser}`, params, { headers })
              .then(response => {
                Alert.alert('Usuario modificado con éxito');
              })
              .catch(error => {
                console.log('Error al obtener los usuarios:', error);
                Alert.alert('Error al modificar usuario');
              });
          },
        },
      ]
    );
  };

  const changeEditState = () => {
    if (editState) {
      setEditState(false)
    } else {
      setEditState(true)
    }
    console.log(nameUser)
    console.log(emailUser)
  }
  return (
    <View style={styles.container}>
      <TextInput style={styles.TextIn} editable={editState} value={nameUser} onChangeText={setNameUser} />
      <TextInput style={styles.TextIn} editable={editState} value={emailUser} onChangeText={setEmailUser} />
      <View style={styles.containerCheck}>
        <CheckBox
          title="Resetear contraseña por DNI"
          checked={resetPassDni}
          onPress={() => setResetPassDni(!resetPassDni)}
          style={styles.check}
        />
        <CheckBox
          title="Convertir coordenadas"
          checked={convertCoor}
          onPress={() => setConvertCoor(!convertCoor)}
        />
        <CheckBox
          title="Convertir dirección"
          checked={convertDirect}
          onPress={() => setConvertDirect(!convertDirect)}
        />
      </View>

      <View style={styles.container2}>
        <TouchableHighlight
          style={{
            flexDirection: 'row',
            marginRight: 10,
          }}>
          <View>
            <Button type="solid" title={"Editar"} buttonStyle={styles.buttonStyle} onPress={() => changeEditState()}>
              Editar
            </Button>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            flexDirection: 'row',
            marginRight: 10
          }}>
          <View>
            <Button type="solid" title={"Borrar"} buttonStyle={styles.buttonStyle} onPress={() => deleteUser()}>
              Editar
            </Button>
          </View>
        </TouchableHighlight>

    
      </View>
      <View>
            <Button type="solid" title={"Guardar cambios"} buttonStyle={styles.buttonStyle} onPress={() => updateUser()}>
              
            </Button>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#b8f7d4',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center'
  },
  container2: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerCheck: {
    marginTop: 20,
    marginLeft: 10,
    justifyContent: 'flex-start',
  },
  check:{    backgroundColor: '#85FEE6',
},
  TextIn: {
    marginTop: 10,
    width: '90%',
    height: 60,
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
  },
  buttonStyle:{
    marginTop:10,
    marginBottom:20,
   
    width:140,
    height:60,
    borderRadius:10,
    backgroundColor: '#007932'
 },
  buttonMargin: {
    marginLeft: 20
  }
});
