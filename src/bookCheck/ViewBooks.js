import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { Button } from '@rneui/themed';
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon, ScrollView } from "native-base";

import { Table, Row, Rows } from 'react-native-table-component';

import SelectDropdown from 'react-native-select-dropdown'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export default function ViewBooks({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [options, setOptions] = useState([]);

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [unitySelected, setUnitySelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const etapas = ['ENTREGA', 'EVALUACION 1', 'EVALUACION 2', 'RECOGIDA'];
  const [etapa, setEtapa] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  const handleSelect = (selectedItem, index) => {
    setUnitySelected(selectedItem.unity_name);
    setSubjectSelected(selectedItem.subject_name);
  };

  const getReviews = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('http://localhost:8000/api/reviews/students', {
        headers,
        params: {
          user_id: userId,
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
        .get(`http://localhost:8000/api/taughts/${userId}`, { headers })
        .then((response) => {
          setOptions(response.data);
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
              return selectedItem.unity_name;
            }}
            rowTextForSelection={(item, index) => {
              return item.unity_name + '/' + item.subject_name;
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
            data={etapas}
            onSelect={(selectedItem, index) => {
              setEtapa(selectedItem);
              console.log(etapa);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              setSelectedEtapa(true);
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
          {(unitySelected !== '') && (subjectSelected !== '') && (selectedEtapa) && (
            <Button type="solid" onPress={getReviews} style={styles.button}>
              Mostrar Resultados
            </Button>
          )}
  
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
    marginLeft:80
    ,marginBottom:30,  colors: '#b8f7d4'


  },
  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
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
    marginTop: 10,
  },
  dropdown2RowStyle: { backgroundColor: '#FFF', borderBottomColor: '#C5C5C5' },
  dropdown2RowTxtStyle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
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
