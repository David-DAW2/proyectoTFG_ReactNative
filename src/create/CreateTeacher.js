import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, Alert, TextInput, TouchableHighlight } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Flex } from 'native-base';
import SelectDropdown from 'react-native-select-dropdown'
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon, ScrollView } from "native-base";

export default function CreateTeacher({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const [idTeacher, setIdTeacher] = useState('')

    const [emailTeacher, setEmailTeacher] = useState('')
    const [nameTeacher, setNameTeacher] = useState('')
    const [passTeacher, setPassTeacher] = useState('')
    const [confirmPassTeacher, setConfirmPassTeacher] = useState('')
    const [unities, setUnities] = useState([])
    const [subjects, setSubjects] = useState([])

    const [unitiesCargados, setUnitiesCargados] = useState(false)
    const [selectedUnity, setSelectedUnity] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')

    const [idUser, setIdUser] = useState('')
    const [token, setToken] = useState('')

    const [selectedCourses, setSelectedCourses] = useState([]);


    const [editState, setEditState] = useState(false)
    const navigateToMyReports = () => {
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


    const createUniqueObject = () => {
        const uniqueObject = {};
        selectedCourses.forEach(course => {
            const { unity, subject } = course;
            if (!uniqueObject[unity]) {
                uniqueObject[unity] = [];
            }
            uniqueObject[unity].push(subject);
        });
        return uniqueObject;
    };

    const añadirCursoAsig = () => {
        if (selectedUnity && selectedSubject) {
            const isAlreadyAdded = selectedCourses.some(course => course.unity === selectedUnity && course.subject === selectedSubject);
            if (isAlreadyAdded) {
                Alert.alert("Curso y asignatura ya están insertados");
            } else {
                setSelectedCourses(prevCourses =>
                    prevCourses.concat({ unity: selectedUnity, subject: selectedSubject })
                );
            }
        } else {
            Alert.alert("No ha elegido asignatura o curso");
        }
        setSelectedUnity('');
        setSelectedSubject('');
        setUnities([])
        setSubjects([])
        getUnities()

    };


    useEffect(() => {
        console.log(selectedCourses)

    }, [selectedCourses]);
    const getSubjects = () => {
        if (token && selectedUnity) {
            const headers = {
                authorization: `Bearer ${token}`,
            };
            console.log(selectedUnity)
            axios
                .get(`https://tfg-fmr.alwaysdata.net/back/public/api/${selectedUnity}/subjects`, { headers })
                .then(response => {
                    setSubjects(response.data)
                })
                .catch(error => {
                    console.log('Error al obtener los usuarios:', error);
                    Alert.alert('Error al modificar usuario');
                });
        }

    }

    useEffect(() => {
        getSubjects()
    }, [selectedUnity])
    useEffect(() => {
        console.log(subjects)
    }, [subjects])
    useEffect(() => {

        if (token) {
            console.log(token)

            getUnities();

        }
    }, [token]);

    useEffect(() => {
        setSelectedSubject('')
        getSubjects()
    }, [selectedUnity]);
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

    useEffect(() => {
        console.log(selectedUnity)
        setUnitiesCargados(true)
    }, [selectedUnity]);
    useEffect(() => {
        console.log(selectedSubject)
    }, [selectedSubject]);
    const createTeacher = () => {
        if (nameTeacher === '' || idTeacher === '' || emailTeacher === '' || passTeacher === '') {
            Alert.alert('Hay campos vacios');
            return;

        } else {
            if (emailTeacher.includes('@')) {
                if (selectedCourses.length === 0) {
                    Alert.alert('Debes seleccionar al menos un curso y una asignatura');
                    return;
                }
                if (passTeacher !== confirmPassTeacher) {
                    Alert.alert('Error', 'Las contraseñas no coinciden');
                    return;

                } else {
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
                                        id: idTeacher,
                                        name: nameTeacher,
                                        email: emailTeacher,
                                        password: passTeacher,
                                        c_password: confirmPassTeacher,
                                        taughts: createUniqueObject()
                                    };
                                    console.log(createUniqueObject())

                                    console.log(params)
                                    const headers = {
                                        authorization: `Bearer ${token}`,
                                    };

                                    axios
                                        .post('https://tfg-fmr.alwaysdata.net/back/public/api/user/teacher', params, { headers })
                                        .then(response => {
                                            Alert.alert('Profesor creado con éxito');
                                        })
                                        .catch(error => {
                                            console.log('Error al obtener los usuarios:', error.message);
                                            Alert.alert('Error al modificar usuario o el usuario ya existe');
                                        });
                                },
                            },
                        ]
                    );
                }
            } else {
                Alert.alert("Email no válido")
                return;
            }
        }
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
        <NativeBaseProvider style={styles.baseColor} theme={theme}>

            <ScrollView style={styles.baseColor}>
            <View style={styles.headerNav}>
        <Text style={styles.headerText}>Crear profesor</Text>
      </View>
                <Text style={styles.textGenerated}>ID profesor:</Text>
                <TextInput style={styles.TextIn} value={idTeacher} onChangeText={setIdTeacher} />
                <Text style={styles.textGenerated}>Nombre profesor:</Text>
                <TextInput style={styles.TextIn} value={nameTeacher} onChangeText={setNameTeacher} />
                <Text style={styles.textGenerated}>Email profesor:</Text>

                <TextInput style={styles.TextIn} value={emailTeacher} onChangeText={setEmailTeacher} />
                <Text style={styles.textGenerated}>contraseña profesor:</Text>

                <TextInput style={styles.TextIn} value={passTeacher} secureTextEntry={true}
                    onChangeText={setPassTeacher} />

                <Text style={styles.textGenerated}>confirmación contraseña profesor:</Text>
                <TextInput style={styles.TextIn} secureTextEntry={true}
                    value={confirmPassTeacher} onChangeText={setConfirmPassTeacher} />

                <View style={styles.containerButtons}>
                    <Button type="solid" title={"Guardar cambios"} buttonStyle={styles.buttonStyle} onPress={() => createTeacher()}>

                    </Button>

                    <Button type="solid" title={"añadir curso/Asig"} buttonStyle={styles.buttonStyle} onPress={() => añadirCursoAsig()} style={styles.button}>
                        Guardar cambios
                    </Button>
                </View>

                <View style={styles.container}>
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
                                defaultButtonText='Elija un curso'
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
                                defaultButtonText='Elija una asginatura'
                            />)}

                            <Text></Text>
                            <Text style={styles.text}>Cursos y asignaturas añadidas</Text>
                            <Text></Text>

                            {selectedCourses.map((value, index) => {
                                return (
                                    <View key={index}>
                                        <Text style={styles.textGenerated}>{value.unity} - {value.subject}</Text>

                                    </View>
                                );
                            })}

                        </>
                    )}

                </View>
            </ScrollView>
        </NativeBaseProvider>
    );
} const theme = extendTheme({
    colors: {
        primary: "#b8f7d4"
    }
});

const styles = StyleSheet.create({
    containerButtons: {
        flexDirection: 'row'
    },
    container: {
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center'
    }, baseColor: {
        backgroundColor: 'white',
    },headerNav: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 30,
        marginTop:0
        ,    backgroundColor: '#007932',
      
        
      },
      headerText: {
        paddingTop:10,
      
        fontSize: 24,
        color: '#FFF',
        fontFamily:'NotoSansHK-Medium-Alphabetic'
      },
    text: {
        fontSize: 18,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginVertical: 5,
    },
    container2: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b8f7d4',

    }, TextIn: {
        marginTop: 5,
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
    textGenerated: {
        fontFamily: 'NotoSansHK-Medium',
        marginTop: 5,
        marginLeft: 45
    },
    containerCheck: {
        marginTop: 20,
        marginLeft: 5,
        justifyContent: 'flex-start',
    },
    check: {
        backgroundColor: '#85FEE6',
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
        backgroundColor: '#FFF', borderBottomColor: '#C5C5C5',
        height: 90, // Ajusta la altura de las celdas según tus necesidades
    },
    dropdown2RowTxtStyle: {
        color: '#000',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 14,
    },
    TextIn: {
        marginTop: 10,
        width: '80%',
        height: 60,
        margin: 3,
        borderWidth: 1,
        paddingTop: 0,
        borderRadius: 10,
        backgroundColor: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        alignSelf: 'center'
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        color: 'white',
        marginVertical: 5,
        backgroundColor: 'green',
        textAlign: 'center',
        fontWeight: "bold"
    },
    buttonStyle: {
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 40,
        width: 140,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#007932'
    },
    buttonMargin: {
        marginLeft: 20
    }
});
