import React, { useState, useEffect } from 'react';
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


export function NewReport({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [id, setID] = useState('')
    const [expanded, setExpanded] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [text, onChangeText] = React.useState('');
    const [objValues, setObjValues] = useState({
        selectedOption: 'Tic',
        text: '',
    });

    const navegateToMyReports = () => {
        navigation.navigate('HomeReports')
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



    const enviarDatos = async (id, descripcion, tipo) => {
        if (objValues.selectedOption === '') {
            Alert.alert("No se ha elegido tipo de incidencia")
        } else {
            if (objValues.text === '') {
                Alert.alert("No se ha añadido ningun comentario")

            } else {

                try {
                    const token = await AsyncStorage.getItem('token');

                    const headers = {
                        Authorization: `Bearer ${token}`,
                    };
                    console.log(id)
                    console.log(descripcion)
                    console.log(tipo)

                    const data = {
                        user_id: id,
                        description: descripcion,
                        type: tipo
                    };

                    const response = await axios.post('https://tfg-fmr.alwaysdata.net/back/public/api/incidences', data, { headers }).then(response => {
                        if (response.data.success) {
                            Alert.alert('Incidencia creada con éxito')
                            navegateToMyReports()

                        }
                    })

                    console.log('Respuesta del servidor:', response.data);

                } catch (error) {
                    console.log('Error al enviar los datos:', error);
                }
            }
        }

    };
    const handleSave = () => {
        setObjValues({ selectedOption, text })
    }
    useEffect(() => {
        handleSave()
    }, [selectedOption, text])

    return (
        <NativeBaseProvider >

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Crear incidencia</Text>
                </View>
                <View style={{ backgroundColor: 'white', height: '70%',shadowRadius:30 }}>
                    <View style={styles.radioGroup}>
                        <RadioButton.Group onValueChange={newValue => setSelectedOption(newValue)} value={selectedOption}>
                            <View style={styles.radioOption}>
                                <RadioButton style={{ fontFamily: 'NotoSansHK-Medium', marginLeft: 10 }} value="TIC" />
                                <Text style={styles.radioOptionText}>Indicencia TIC</Text>
                            </View>
                            <View style={styles.radioOption}>
                                <RadioButton style={{ fontFamily: 'NotoSansHK-Medium', }} value="NO TIC" />
                                <Text style={styles.radioOptionText}>Indicencia no TIC</Text>
                            </View>
                        </RadioButton.Group>
                    </View>
                    <TextArea
                        fontSize={17}
                        fontFamily={'NotoSansHK-Medium-Alphabetic'}
                        style={{ backgroundColor: 'white' }}
                        alignSelf={'center'}
                        marginTop={10}
                        width={'80%'}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder='Introduzca la incidencia..'
                    />
                    <Text></Text>
                    <Button type="solid" buttonStyle={styles.button} onPress={() => { handleSave(); enviarDatos(id, text, selectedOption) }}>
                        Guardar
                    </Button>
                </View>
            </View>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#b8f7d4',
    },
    header: {
        backgroundColor: '#368f3f',
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
        marginTop: 40,

    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30

    },
    radioOptionText: {
        marginLeft: 30,
        fontSize: 16,
        fontFamily: 'Feather',
        fontWeight: 'bold',

    },
    input: {
        marginTop: 30,
        width: '100%',
        height: 120,
        margin: 3,
        borderWidth: 1,
        paddingTop: 0,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    button: {
        padding: 'auto',
        marginLeft: 200,
        marginTop: 40,
        width: 150,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#007932'
    }
});
