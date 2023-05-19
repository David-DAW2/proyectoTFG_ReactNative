import { View, Text, StyleSheet,Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { TextInput } from 'react-native-paper';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
export default function DetailReviewReport({ route }) {
  const { incidencia } = route.params;
  const [observaciones, setObservaciones] = useState('');
  const [addObservacion, setAddObservacion] = useState(false);

  const handleObservacionesChange = (text) => {
    setObservaciones(text);
  };
  const navigation = useNavigation();
  const navigateToDetailReport = () => {
      
      
      navigation.navigate('ReviewReports');
  };
  const addObservFunc = () => {
    setAddObservacion(true);
  };


  const updateIncidence=async ()=>{

    const params={
      status:'CERRADA',
      observation:observaciones
    }
        // Obtener el token de AsyncStorage
        const token = await AsyncStorage.getItem('token');
      
        console.log(params.status)
        console.log(params.observation)
        console.log(token)


        // Configurar los encabezados de la solicitud
        const headers = {
          Authorization: `Bearer ${token}`,
        };
    axios.put(`http://localhost:8000/api/incidences/${incidencia.id}`, params, { headers })
      .then(response => {
        console.log(response.data);
        if(response.data.success){
          Alert.alert("La incidencia ha sido cerrada correctamente")
          navigateToDetailReport()
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{incidencia.status}</Text>
      <Text style={styles.text}>{incidencia.description}</Text>
      <Text style={styles.text}>{incidencia.date}</Text>

      {addObservacion && (
        <TextInput
          style={styles.textInput}
          value={observaciones}
          onChangeText={handleObservacionesChange}
        />
      )}

      <Button type="solid" style={styles.button} onPress={addObservFunc}>
        Añadir observación
      </Button>

      <Button type="solid" style={styles.button} onPress={updateIncidence}>
        Marcar como resuelta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
  },
  textInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
  },
});
