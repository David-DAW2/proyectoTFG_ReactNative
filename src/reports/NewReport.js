import React, { useState, useEffect} from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
  
    View,
    TextInput
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Button } from '@rneui/themed';
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';


export function NewReport({navigation}) {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);
    
    const [id,setID]=useState('')
    const [expanded, setExpanded] = useState(true);
    const [selectedOption, setSelectedOption] = useState('Tic');
    const [text, onChangeText] = React.useState('');
    const [objValues, setObjValues] = useState({
        selectedOption: 'Tic',
        text: '',
    });

const navegateToMyReports=()=>{
    navigation.navigate('MyReports')
}
    useEffect(() => {
        const getData = async () => {
          try {
            const idStorage = await AsyncStorage.getItem('id');
            setID(idStorage);
          } catch (error) {
            console.log('Error al obtener datos de AsyncStorage:', error);
          }
        };
    
        getData();
      }, []);



      const enviarDatos = async (id, descripcion,tipo) => {
        try {
          // Obtener el token de AsyncStorage
          const token = await AsyncStorage.getItem('token');
      
          // Configurar los encabezados de la solicitud
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          console.log(id)
          console.log(descripcion)
          console.log(tipo)

          // Configurar el cuerpo de la solicitud
          const data = {
            user_id: id,
            description: descripcion,
            type:tipo
          };
      
          // Realizar la llamada POST al endpoint
          const response = await axios.post('http://localhost:8000/api/incidences', data, { headers }).then(response =>{
            if (response.data.success) {
                Alert.alert('Incidencia creada con éxito')
                navegateToMyReports()
                
            }
          })
      
          // Manejar la respuesta del servidor
          console.log('Respuesta del servidor:', response.data);
      
          // Realizar cualquier acción adicional según sea necesario
        } catch (error) {
          console.log('Error al enviar los datos:', error);
          // Manejar el error de acuerdo a tus necesidades
        }
      };
    const handleSave = () => {
        setObjValues({selectedOption, text})
    }

    return (
        <NativeBaseProvider>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Crear incidencia</Text>
            </View>
            <View style={styles.radioGroup}>
                <RadioButton.Group onValueChange={newValue => setSelectedOption(newValue)} value={selectedOption}>
                    <View style={styles.radioOption}>
                        <RadioButton value="TIC" />
                        <Text style={styles.radioOptionText}>Indicencia TIC</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <RadioButton value="NO TIC" />
                        <Text style={styles.radioOptionText}>Indicencia no TIC</Text>
                    </View>
                </RadioButton.Group>
            </View>
            <TextArea
                onChangeText={onChangeText}
                value={text}
                placeholder='Introduzca la incidencia..'
            />
            <Text></Text>
            <Button type="solid" style={styles.button} onPress={() => { handleSave(); enviarDatos(id,text,selectedOption) }}>
                Guardar
            </Button>
        </View>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight,
        backgroundColor:'#85FEE6'

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
    input: {
        marginTop: 30,
        width: '100%',
        height: 120,
        margin: 3,
        borderWidth: 1,
        paddingTop: 0,
        borderRadius: 10,
        backgroundColor:'white'
    },
    button: {

        backgroundColor: '#FFA07A',
        marginTop: 40,
        borderRadius: 10,
    },
});
