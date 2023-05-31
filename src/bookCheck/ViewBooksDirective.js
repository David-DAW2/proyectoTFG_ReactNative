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
export default function ViewBooksDirective({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [options, setOptions] = useState([]);

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [unitySelected, setUnitySelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const etapas = ['ENTREGA', '1º EVALUACION', '2º EVALUACION', 'RECOGIDA'];
  const [etapa, setEtapa] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  const handleSelect = (selectedItem, index) => {
    setUnitySelected(selectedItem.unity_name);
    setSubjectSelected(selectedItem.subject_name);
    setEtapa(selectedItem.review_type);
  };

  const getReviews = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('http://localhost:8000/api/reviews', {
        headers,
        params: {
          subject_name: subjectSelected,
          review_type: etapa,
          unity_name: unitySelected,
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

  useEffect(() => {
    /*  console.log(subjectSelected)
      console.log(unitySelected)
      console.log(etapa)
      console.log(userId)
      console.log(token)*/
  }, [setUnitySelected, subjectSelected, etapa]);

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
    const getOptions = () => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`http://localhost:8000/api/allReviews`, { headers })
        .then((response) => {
          setOptions(response.data);
          console.log(options)
        })
        .catch((error) => {
          console.log('Error al obtener opciones:', error);
        });
    };

    if (token && userId) {
      getOptions();
    }
  }, [token, userId]);

  const dataTable = reviewData && reviewData.data
    ? reviewData.data.map((item) => {
        return [item.surnames, item.status, item.observation];
      })
    : [];
  const tableHead = ['Nombre', 'Estado', 'Observaciones'];
  const tableData = [tableHead, ...dataTable];

  return (
    <NativeBaseProvider style={styles.baseColor} theme={theme}>
      <ScrollView style={styles.baseColor}>
        <View >
        <View style={styles.container}>
          <SelectDropdown style={styles.drop}
            data={options.data}
            onSelect={handleSelect}
            buttonTextAfterSelection={(selectedItem, index) => {
              return '(' + selectedItem.review_type + ') '+selectedItem.unity_name + '/' + selectedItem.subject_name ;
            }}
            rowTextForSelection={(item, index) => {
              return '(' + item.review_type + ') '+item.unity_name + '/' + item.subject_name ;
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
        
</View>
    
            <Button type="solid" onPress={getReviews} style={styles.button}>
              Mostrar Resultados
            </Button>
       
  
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
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
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
  colorBase:{
    backgroundColor: '#b8f7d4'

  },

  drop:{
    marginLeft:100
  },
  baseColor: { backgroundColor: '#b8f7d4' },
  container: {
    marginTop:50,

    marginBottom:30

  },
  dropdown2BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderBottomColor:'#000',
    borderBottomEndRadius:5,
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
  dropdown2RowStyle: { backgroundColor: '#FFF', borderBottomColor: '#C5C5C5',
  height: 90, // Ajusta la altura de las celdas según tus necesidades
 },
  dropdown2RowTxtStyle: {
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableContainer: {
    backgroundColor:"#FFF",
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
    height:50
  },
  dataRowStyle: {
    height:50

  },
  rowTextStyle: {
    textAlign: 'center',
    fontWeight:"bold"
  },
  button: {
    marginTop: 20,
  },
});
