import React from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet,Alert } from 'react-native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function DetailReport({ route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const { incidencia } = route.params;
  const navigation = useNavigation();
  const navegateToMyReports=()=>{
    navigation.navigate('MyReports')
}

const deleteIncidence = async () => {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  Alert.alert(
    'Confirmación',
    '¿Seguro que quiere eliminar la incidencia?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Aceptar',
        onPress: () => {
          axios
            .delete(`https://tfg-fmr.alwaysdata.net/back/public/api/incidences/${incidencia.id.toString()}`, { headers })
            .then((response) => {
              if (response.data) {
                if (response.data.success) {
                  Alert.alert('La incidencia ha sido eliminada correctamente');
                  navegateToMyReports();
                }
              }
            })
            .catch((error) => {
              Alert.alert('Error al eliminar la incidencia');
            });
        },
      },
    ]
  );
};

  return (
    
    <View style={styles.container}>
            <View style={styles.header}>
        <Text style={styles.headerText}>ID: {incidencia.id}</Text>
      </View>
      <Text style={styles.text}>{incidencia.status}</Text>
      <Text style={styles.text}>{incidencia.description}</Text>
      <Text style={styles.text}>{incidencia.created_at}</Text>
      {incidencia.observation != '' ? (
        <Text style={styles.text}>{incidencia.observation}</Text>
      ) : (
        <Text style={styles.text}>No hay comentarios</Text>
      )}

      <Button type="solid" buttonStyle={styles.buttonStyle} onPress={deleteIncidence}>
        Eliminar incidencia
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
alignItems:'center'

  }, header: {
    width: '100%',
    backgroundColor: '#007932',
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 150,
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
  buttonStyle:{
    padding:'auto',
    marginTop:20,
    width:200,
    height:60,
    borderRadius:10,
    backgroundColor: '#007932'
 }
});
