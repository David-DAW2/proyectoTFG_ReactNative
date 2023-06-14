import { View, Text, StyleSheet,Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { TextInput } from 'react-native-paper';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { NativeBaseProvider } from 'native-base';
export default function DetailReviewReport({ route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
}, [navigation]);
 
 
  const { incidencia } = route.params;
  const [observaciones, setObservaciones] = useState(incidencia.observation);

  const handleObservacionesChange = (text) => {
    setObservaciones(text);
  };
  const navigation = useNavigation();
  const navigateToDetailReport = () => {
      
      
      navigation.navigate('ReviewReports');
  };


  useEffect(()=>{
    if (incidencia.observation="") {
      setObservaciones('sin comentarios')
    }
  })
  const updateIncidenceResolve=async ()=>{

    const params={
      status:'RESUELTA',
      observation:observaciones
    }
        const token = await AsyncStorage.getItem('token');
      
        console.log(params.status)
        console.log(params.observation)
        console.log(token)


        const headers = {
          Authorization: `Bearer ${token}`,
        };
    axios.put(`https://tfg-fmr.alwaysdata.net/back/public/api/incidences/${incidencia.id}`, params, { headers })
      .then(response => {
        console.log(response.data);
        if(response.data.success){
          Alert.alert("La incidencia ha sido cerrada correctamente")
          incidencia.status='RESUELTA'

          navigateToDetailReport()
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const updateIncidenceInProcess=async ()=>{

    const params={
      status:'EN PROCESO',
      observation:observaciones
    }
        const token = await AsyncStorage.getItem('token');
      
        console.log(params.status)
        console.log(params.observation)
        console.log(token)


        const headers = {
          Authorization: `Bearer ${token}`,
        };
    axios.put(`https://tfg-fmr.alwaysdata.net/back/public/api/incidences/${incidencia.id}`, params, { headers })
      .then(response => {
        console.log(response.data);
        if(response.data.success){
          Alert.alert("La incidencia ha sido cerrada correctamente")
          incidencia.status='EN PROCESO'
          navigateToDetailReport()

        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const updateIncidenceWWithChangeStatus=async ()=>{

    const params={
      observation:observaciones
    }
        const token = await AsyncStorage.getItem('token');
      
        console.log(params.status)
        console.log(params.observation)
        console.log(token)


        const headers = {
          Authorization: `Bearer ${token}`,
        };
    axios.put(`https://tfg-fmr.alwaysdata.net/back/public/api/incidences/${incidencia.id}`, params, { headers })
      .then(response => {
        console.log(response.data);
        if(response.data.success){
          Alert.alert("Comentario añadido correctamente")
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <NativeBaseProvider>
                        <View style={styles.header}>
        <Text style={styles.headerText}>ID: {incidencia.id}</Text>
        </View>
    <View style={styles.container}>

    

            <Text style={styles.text}>{incidencia.name}</Text>
      <Text style={styles.text}>{incidencia.status}</Text>
      <Text style={styles.text}>{incidencia.description}</Text>
      <Text style={styles.text}>{incidencia.created_at}</Text>

   
        <TextInput
          placeholder='añada un comentario....'
          style={styles.textInput}
          value={observaciones}
          onChangeText={handleObservacionesChange}
        />
     

      <Button type="solid" buttonStyle={styles.buttonStyle} onPress={updateIncidenceWWithChangeStatus}>
        Añadir observación
      </Button>

      <Button type="solid" buttonStyle={styles.buttonStyle} onPress={updateIncidenceInProcess}>
        Marcar como en proceso
      </Button>

      <Button type="solid" buttonStyle={styles.buttonStyle} onPress={updateIncidenceResolve}>
        Marcar como resuelta
      </Button>
    </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 50,
    backgroundColor: 'white',alignItems:'center'
  }, header: {
    width: '100%',
    backgroundColor: '#007932',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop:0
    
  },
  headerText: {
    paddingTop:10,

    fontSize: 24,
    color: '#FFF',
    fontFamily:'NotoSansHK-Medium-Alphabetic'
},
  text: {
    fontFamily:'NotoSansHK-Medium-Alphabetic',
    width:'90%',
    backgroundColor:'white',
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
    borderRadius:10
  },
  textInput: {
    fontFamily:'NotoSansHK-Medium-Alphabetic',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    width:'90%',
    marginVertical: 5,
    backgroundColor:'white'
  },
  buttonStyle:{
    padding:'auto',
    marginTop:20,
    width:200,
    height:60,
    borderRadius:10,
    backgroundColor: '#007932'
 }
});
