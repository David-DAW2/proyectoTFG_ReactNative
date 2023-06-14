import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";


export default function ResetPass({ navigation }) {
    const [passUser, setPassUser] = useState('')

    const [pasSession, setPassSession] = useState('')
    const [passChange, setPassChange] = useState('')
    const [confirmPassChange, setconfirmPassChange] = useState('')
    const [userid, setUserId] = useState('')
    const [token, setToken] = useState('')

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    useEffect(() => {
        const getUserData = async () => {
            setUserId(await AsyncStorage.getItem('id'))
            setToken(await AsyncStorage.getItem('token'))
            setPassUser(await AsyncStorage.getItem('pass'))
        }
        getUserData();
    }, [passChange, setPassChange]);
    const saveData = async (pass) => {
        try {
        
          await AsyncStorage.setItem('pass', pass);
    
    
    
          console.log('Datos guardados en AsyncStorage');
        } catch (error) {
          console.log('Error al guardar datos en AsyncStorage:', error);
        }
      }
    const modPassWord = () => {

        if (passChange !== confirmPassChange) {
            Alert.alert("las contraseñas no coinciden")
            return;
        }        else {
            if (passUser === pasSession) {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const data = {
                    currentPassword: pasSession,
                    user_id: userid,
                    password: passChange
                };
                axios.put("https://tfg-fmr.alwaysdata.net/back/public/api/change-password", data, { headers }).then(response => {

                    console.log()
                    if (response.data.success) {
                        Alert.alert('contraseña cambiada con éxito')
                        saveData(confirmPassChange)

                    } else {
                        Alert.alert('Error al cambiar la contraseña, intentelo de nuevo')
                    }
                })
            } else {
                Alert.alert("la contraseña del usuario no es correcta")
            }
        }
    }
    return (
        
        <View style={styles.container}>
              <View style={styles.headerNav}>
        <Text style={styles.headerText}>Cambiar contraseña </Text>
      </View>
            <TextInput style={styles.TextIn} secureTextEntry={true} value={pasSession} onChangeText={setPassSession} placeholder='introduce tu contraseña...' ></TextInput>
            <TextInput></TextInput>
            <TextInput style={styles.TextIn} secureTextEntry={true} value={passChange} onChangeText={setPassChange} placeholder='introduce la nueva contraseña...' ></TextInput>
            <TextInput style={styles.TextIn} secureTextEntry={true} value={confirmPassChange} onChangeText={setconfirmPassChange} placeholder='repite la nueva contraseña...' ></TextInput>
            <Button buttonStyle={styles.buttonStyle} title="Cambiar contraseña" onPress={() => { modPassWord(), navigation.navigate('Home') }} />
            <Button buttonStyle={styles.buttonStyle} title="Cancelar" onPress={() => { navigation.navigate('Home') }} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'

    },headerNav: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 50,
        marginTop:0
        ,    backgroundColor: '#007932',
      
        
      },
      headerText: {
        paddingTop:10,
      
        fontSize: 24,
        color: '#FFF',
        fontFamily:'NotoSansHK-Medium-Alphabetic'
      },
    textSpace: {
        marginBottom: 20
    },
    TextIn: {
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
    buttonStyle: {
        marginTop: 20,
        marginBottom: 10,
        width: 200,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#007932',
        alignSelf: 'center',
    },
});