import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { Button } from '@rneui/themed';
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon, ScrollView } from "native-base";
import revisiones from "../revisiones";
import { DataTable } from 'react-native-paper';
import { Table, Row, Rows } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';

import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export default function ViewBooksStatusAndStage({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const estados = ['BIEN', 'REGULAR', 'MAL', "NO REVISADO"]
  const etapas = ['ENTREGA', 'EVALUACION 1', 'EVALUACION 2', 'RECOGIDA']
  const [etapa, setEtapa] = useState('')
  const [estado, setEstado] = useState('')
  const [selectedEtapa, setSelectedEtapa] = useState(false)
  const [reviewData, setReviewData] = useState([]);
 const [datosCargados,setDatosCargados]=useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setUserId(await AsyncStorage.getItem('id'));
        setToken(await AsyncStorage.getItem('token'));
      } catch (error) {
        console.log('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getData();
  }, []);
  useEffect(() => {
    console.log(reviewData)
    setDatosCargados(true)
  }, [reviewData])
  const getReviewsStatus = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('http://localhost:8000/api/allUsersReviews', {
        headers,
        params: {
          status: estado,
          review_type: etapa,
        },
      })
      .then((response) => {
        console.log("datos devueltos =>", response.data);
        setReviewData(response.data);
      })
      .catch((error) => {
        console.log('Error en los datos', error);
      });
  };

  const dataTable = reviewData && reviewData.data
    ? reviewData.data.map((item) => {
      return [item.surnames, item.unity_name, item.subject_name, item.observation, item.user_name];
    })
    : [];
  const tableHead = ['Nombre alumno', 'curso', 'Asignatura', 'Observaciones', 'Nombre profesor'];
  const tableData = [tableHead, ...dataTable];

  return (
    <NativeBaseProvider style={styles.baseColor} theme={theme}>
      <ScrollView style={styles.baseColor}>
        <View style={styles.container}>
          <SelectDropdown
            data={etapas}
            onSelect={(selectedItem, index) => {
              setEtapa(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {

              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}

            dropdownIconPosition={'right'}
            buttonStyle={styles.dropdown2BtnStyle}
            buttonTextStyle={styles.dropdown2BtnTxtStyle}
            dropdownStyle={styles.dropdown2DropdownStyle}
            rowStyle={styles.dropdown2RowStyle}
            rowTextStyle={styles.dropdown2RowTxtStyle}
            defaultButtonText="Elija una opción"
          />
          <Text></Text>
          <SelectDropdown
            data={estados}
            onSelect={(selectedItem, index) => {
              setEstado(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              setSelectedEtapa(true)
              return selectedItem;

            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}

            dropdownIconPosition={'right'}
            buttonStyle={styles.dropdown2BtnStyle}
            buttonTextStyle={styles.dropdown2BtnTxtStyle}
            dropdownStyle={styles.dropdown2DropdownStyle}
            rowStyle={styles.dropdown2RowStyle}
            rowTextStyle={styles.dropdown2RowTxtStyle}
            defaultButtonText="Elija una opción"
          />
        </View>
        <Text></Text>
        {(datosCargados) && (<Button type="solid" style={styles.button} onPress={() => getReviewsStatus()} >
          Mostrar Resultados
        </Button>)}
        {(selectedEtapa && reviewData && reviewData.data && reviewData.data.length > 0) ? (
  <View style={styles.tableContainer}>
    <Table borderStyle={styles.tableBorderStyle}>
      {tableData.map((rowData, index) => (
        <Row
          key={index}
          data={rowData}
          textStyle={styles.rowTextStyle}
          style={index === 0 ? styles.headerRowStyle : styles.dataRowStyle}
        />
      ))}
    </Table>
  </View>
) : (
  <Text style={styles.textNo}>No hay datos</Text>
)}




      </ScrollView>
    </NativeBaseProvider>
  )




}
const newColorTheme = {
  brand: {
    900: '#5B8DF6',
    800: '#ffffff',
    700: '#cccccc',
  },
};

const theme = extendTheme({
  colors: '#b8f7d4'
});

const styles = StyleSheet.create({

  textNo:{fontSize:20,
    fontWeight: 'bold',
    textAlign:"center",
    marginTop:50
},

  colorBase: {
    backgroundColor: '#b8f7d4'

  },

  drop: {
    marginLeft: 100
  },
  baseColor: { backgroundColor: '#b8f7d4' },
  container: {
    marginTop: 50,

    marginBottom: 30

  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderBottomColor: '#000',
    borderBottomEndRadius: 5,
    borderColor: '#000',
    marginTop: 10,
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
  dropdown2RowStyle: { backgroundColor: '#FFF', borderBottomColor: '#C5C5C5' },
  dropdown2RowTxtStyle: {
    color: '#000',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 20,
  },
  tableBorderStyle: {
    borderWidth: 1,
    borderColor: '#000',
  },
  headerRowStyle: {
    backgroundColor: 'green',
    height: 50
  },
  dataRowStyle: {
    height: 50

  },
  rowTextStyle: {
    textAlign: 'center',
    fontWeight: "bold"
  },
  button: {
    marginTop: 20,
  },

}); 
