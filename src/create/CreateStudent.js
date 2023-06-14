import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, Alert, TextInput, TouchableHighlight } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Flex } from 'native-base';
import SelectDropdown from 'react-native-select-dropdown'
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon, ScrollView } from "native-base";

export default function CreateStudent({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [nifStudent, setNifStudent] = useState('')
  const [emailStudent, setEmailStudent] = useState('')
  const [nameStudent, setNameStudent] = useState('')
  const [surnameStudent, setSurnameStudent] = useState('')
  const [emailParentStudent, setEmailParentStudent] = useState('')
  const [unities, setUnities] = useState([])
  const [unitiesCargados, setUnitiesCargados] = useState(false)
  const [selectedUnity, setSelectedUnity] = useState('')
  const [idUser, setIdUser] = useState('')
  const [token, setToken] = useState('')
  const [editState, setEditState] = useState(false)
  
  const navigateHome = () => {
    navigation.navigate('Home')
  }
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

  useEffect(() => {
    const getUnities = () => {
      const headers = {
        authorization: `Bearer ${token}`,
      };
      axios
        .get(`https://tfg-fmr.alwaysdata.net/back/public/api/unities`, { headers })
        .then(response => {
          setUnities(response.data)
        })
        .catch(error => {
          console.log('Error al obtener los usuarios:', error);
          Alert.alert('Error al modificar usuario');
        });
    }
    if (token) {
      console.log(token)
      getUnities();
    }
  }, [token]);

  const createStudent = () => {
    if(nifStudent===''||nameStudent===''||emailStudent===''){
      Alert.alert("Faltan campos por completar")
    return;
    }else{
      if (selectedUnity==='') {
        Alert.alert("No ha seleccionado ningun curso")

      }else{
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
                  name: nameStudent,
                  surnames: surnameStudent,
                  NIF: nifStudent,
                  email: emailStudent,
                  parent_email: emailParentStudent,
                  unity: selectedUnity,
                };
    
                console.log(params)
                const headers = {
                  authorization: `Bearer ${token}`,
                };
    
                axios
                  .post('https://tfg-fmr.alwaysdata.net/back/public/api/create/student', params, { headers })
                  .then(response => {
                    Alert.alert('Alumno creado con éxito');
                    console.log(response.data)
                    navigateHome()
                  })
                  .catch(error => {
                    console.log('Error al crear alumno:');
                  });
              },
            },
          ]
        );
      }
    
    }
  };

  return (
    
    <NativeBaseProvider style={styles.baseColor} theme={theme}>
     
      <ScrollView style={styles.baseColor}>
      <View style={styles.headerNav}>
        <Text style={styles.headerText}>Crear alumnos </Text>
      </View>
        <Text style={styles.textGenerated}>Nombre alumno:</Text>
        <TextInput style={styles.TextIn} value={nameStudent} onChangeText={setNameStudent} />

        <Text style={styles.textGenerated} >Apellidos alumnos:</Text>
        <TextInput style={styles.TextIn} value={surnameStudent} onChangeText={setSurnameStudent} />
        <Text style={styles.textGenerated}>NIF:</Text>
        <TextInput style={styles.TextIn} value={nifStudent} onChangeText={setNifStudent} />

        <Text style={styles.textGenerated}>Email alumno:</Text>
        <TextInput style={styles.TextIn} value={emailStudent} onChangeText={setEmailStudent} />

        <Text style={styles.textGenerated}>Email padre:</Text>
        <TextInput style={styles.TextIn} value={emailParentStudent} onChangeText={setEmailParentStudent} />

        <View style={styles.container2}>
          {(
            <>
              <SelectDropdown
                data={unities.data}
                onSelect={(selectedItem, index) => {
                  setSelectedUnity(selectedItem.name)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedUnity;
                }}
                rowTextForSelection={(item, index) => {
                  return item.name;
                }}
                dropdownIconPosition={'right'}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
                defaultButtonText="Elija un curso"
              />
              {(unitiesCargados) && (<SelectDropdown
                data={subjects.data}
                onSelect={(selectedItem, index) => {
                  setSelectedSubject(selectedItem.name)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedSubject;
                }}
                rowTextForSelection={(item, index) => {
                  return item.name;
                }}
                dropdownIconPosition={'right'}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
                defaultButtonText="Elija un curso"
              />)}
            </>
          )}
        </View>

        <View style={styles.containerButtons}>
          <Button type="solid" title={"Guardar cambios"} buttonStyle={styles.buttonStyle} onPress={() => createStudent()} />
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const theme = extendTheme({
  colors: 'white'
});

const styles = StyleSheet.create({
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerNav: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop:0
    ,    backgroundColor: '#007932',
  
    
  },
  headerText: {
    paddingTop:10,
  
    fontSize: 24,
    color: '#FFF',
    fontFamily:'NotoSansHK-Medium-Alphabetic'
  },
  textGenerated: {
    fontFamily: 'NotoSansHK-Medium',
    marginBottom: 5,
    marginTop: 5,
    marginLeft:45
  },
  container2: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  baseColor: {
    backgroundColor: 'white',
  },
  TextIn: {
    width:'80%'
    ,
    marginTop: 10,
    height: 60,
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    alignSelf:'center'
  },
  buttonStyle: {
    marginTop: 10,
    marginBottom: 20,
    width: 140,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#007932'
  },
  dropdown2BtnStyle: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderBottomColor: '#000',
    borderBottomEndRadius: 5,
    borderColor: '#000',
    marginTop: 10,
    borderWidth:1
  },
  dropdown2BtnTxtStyle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {
    backgroundColor: '#FFF',
    borderBottomColor: '#C5C5C5',
    height: 90,
  },
  dropdown2RowTxtStyle: {
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
