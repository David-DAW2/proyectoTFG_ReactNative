import React from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet,Alert } from 'react-native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function DetailReport({ route }) {
  const { incidencia } = route.params;
  const navigation = useNavigation();
  const navegateToMyReports=()=>{
    navigation.navigate('Home')
}

  const deleteIncidence=async ()=>{
    const token = await AsyncStorage.getItem('token');
      
    // Configurar los encabezados de la solicitud
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios.delete(`http://localhost:8000/api/incidences/${incidencia.id.toString()}`, {headers})
    .then(response=>{
      if (response.data) {
        if(response.data.success){
          Alert.alert("La incidencia ha sido eliminada correctamente")
          navegateToMyReports()
        }
      }
    }
    ).catch(error=>{       
         Alert.alert("Error al eliminar la incidencia");
  })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{incidencia.status}</Text>
      <Text style={styles.text}>{incidencia.description}</Text>
      <Text style={styles.text}>{incidencia.date}</Text>
      {incidencia.observation != '' ? (
        <Text style={styles.text}>{incidencia.observation}</Text>
      ) : (
        <Text style={styles.text}>No hay comentarios</Text>
      )}

      <Button type="solid" style={styles.button} onPress={deleteIncidence}>
        Eliminar incidencia
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#85FEE6',
    width: '100%',
    height: '100%',
    paddingTop: 50

  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
  },
});
