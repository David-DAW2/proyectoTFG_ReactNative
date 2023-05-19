import { View, Text, TextInput, StyleSheet,Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";


export default function ResetPass({ navigation }) {
    const [pasSession, setPassSession] = useState('')
    const [passChange, setPassChange] = useState('')
    const [confirmPassChange, setconfirmPassChange] = useState('')
    const [userid, setUserId]=useState('')
    const [token, setToken]=useState('')

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    useEffect(() => {
        const getUserData= async () => {
            setUserId(await AsyncStorage.getItem('id'))
            setToken(await AsyncStorage.getItem('token'))
        }
        getUserData()

    }, [passChange, setPassChange])

    const modPassWord= ()=>{

        if (passChange==confirmPassChange) {
            const headers = {
                Authorization: `Bearer ${token}`,
              };    
              // Configurar el cuerpo de la solicitud
              const data = {
                currentPassword: pasSession,
                user_id: userid,
                password:passChange
              };
            axios.put("http://localhost:8000/api/change-password", data, {headers}).then(response =>{

              console.log()
                if (response.data.success) {
                    Alert.alert('contraseña cambiada con éxito')

                }else{
                    Alert.alert('Error al cambiar la contraseña, intentelo de nuevo')
                }
            })
        }else{
            Alert.alert("Las contraseñas no coinciden")
        }
    }

    return (
        <View style={styles.container}>
                <TextInput style={styles.input} value={pasSession} onChangeText={setPassSession} placeholder='introduce tu contraseña...' ></TextInput>
                <TextInput></TextInput>
            <TextInput style={styles.input} value={passChange} onChangeText={setPassChange} placeholder='introduce la nueva contraseña...' ></TextInput>
            <TextInput style={styles.input} value={confirmPassChange} onChangeText={setconfirmPassChange} placeholder='repite la nueva contraseña...' ></TextInput>
            <Button buttonStyle={styles.buttonModal} title="Cambiar contraseña" onPress={() => { modPassWord(),navigation.navigate('Home') }} />
            <Button buttonStyle={styles.buttonModalSesion} title="Cancelar" onPress={() => { navigation.navigate('Home') }} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 140,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textSpace: {
        marginBottom: 20
    },
    input: {

        marginBottom: 30,
        borderBottomWidth: 3,
        width: '90%',
        borderBottomColor: '#000'
    },
    buttonModal: {
        width: 150,
        margin: 10,
        borderRadius: 10,
    },
    buttonModalSesion: {
        backgroundColor: '#FF0000',
        width: 150,
        margin: 10,
        borderRadius: 10,
    },
});