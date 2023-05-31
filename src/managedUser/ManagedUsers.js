import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DataTable from 'react-native-datatable-component';

export default function ManagedUsers({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState([])


   
        const getData = async () => {
            try {
                setUserId(await AsyncStorage.getItem('id'));
                setToken(await AsyncStorage.getItem('token'));
            } catch (error) {
                console.log('Error al obtener datos de AsyncStorage:', error);
            }
        };

        
        
    useEffect(() => {
        getData();
        const headers={
            authorization: `Bearer ${token}`
        }
        axios.get('http://localhost:8000/api/users' ,{headers})
        .then(response=>{
            setUserData(response.data)
        })


    },[])



    useEffect(()=>{
        console.log(userData)
    },[userData])



    return (
        <View>

        </View>
    )
}
