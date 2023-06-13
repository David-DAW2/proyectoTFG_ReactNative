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

  const [observations, setObservations] = useState([])

  const [revisionData, setRevisionData] = useState([]);
  const [reviewForSend, SetReviewForSend] = useState([])
  const [verEditar, setVerEditar] = useState(false)
  const [validacionOk, setValidacionOk] = useState(true)

  const estados = ['BIEN', 'REGULAR', 'MAL', "NO REVISADO"]

  const [selectedOptions, setSelectedOptions] = useState([null]);
  const [editar, setEditar] = useState(false)
  const [cambiosApli, setCambiosApli] = useState(false)
  const [estadosTabla, setEstadosTabla] = useState([])
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
      .get('https://tfg-fmr.alwaysdata.net/back/public/api/reviews', {
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
        setVerEditar(true)

      })
      .catch((error) => {
        console.log('Error en los datos', error);
      });
  };
  const handleChangeEdit = () => {
    setEditar(!editar)
    setCambiosApli(false)
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
        .get(`https://tfg-fmr.alwaysdata.net/back/public/api/allReviews`, { headers })
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

  const ReviewTable = () => {
    const dataTable = reviewData && reviewData.data
      ? reviewData.data.map((item) => {
        return [item.name + " " + item.surnames, item.status, item.observation];
      })
      : [];
    const tableHead = ['Nombre', 'Estado', 'Observaciones'];
    const tableData = [tableHead, ...dataTable];

    return (
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
    );
  };


  const dataTableEdit = reviewData && reviewData.data
    ? reviewData.data.map((item, index) => {
      return [
        `(${item.student_id}${item.review_id}) - ${item.name} ${item.surnames}  `,
        <SelectDropdown
      data={estados}
      defaultValue={reviewData.data[index].status}
      onSelect={(selectedValue) => {
        setReviewData((prevData) => {
          const updatedData = { ...prevData };
          updatedData.data[index].status = selectedValue;
          return updatedData;
        });
      }}
      buttonStyle={styles.dropdown2BtnStyle}
      buttonTextStyle={styles.dropdown2BtnTxtStyle}
    />,
    <TextArea
    fontFamily={'NotoSansHK-Medium-Alphabetic'}
    fontSize={15}
        style={styles.textAreaStyle}
        onChangeText={(textValue) => {
          setReviewData((prevData) => {
            const updatedData = { ...prevData };
            updatedData.data[index].observation = textValue;
            return updatedData;
          });
        }}
        value={reviewData.data[index].observation}

      ></TextArea>
      ];
    })
    : [];

  const state = {
    HeadTable: ['nombre', 'Estado', 'observaciones'],
    DataTable: dataTableEdit,
  };


  const isValidStatus = (estado) => {
    const validStatus = ['BIEN', 'REGULAR', 'MAL', 'NO REVISADO'];
    return validStatus.includes(estado);
  };
  const handleFinalizarRevision = () => {
    const newData = state.DataTable.reduce((acc, rowData, index) => {
      const estado = reviewData && reviewData.data && reviewData.data[index] ? reviewData.data[index].status : null;
      const observaciones = reviewData && reviewData.data && reviewData.data[index] ? reviewData.data[index].observation : '';
      const id = reviewData && reviewData.data && reviewData.data[index] ? reviewData.data[index].student_id : null;
      const review_id = reviewData && reviewData.data && reviewData.data[index] ? reviewData.data[index].review_id : null;
  
      // Verificar si el estado y la observación tienen valores definidos y si el estado es válido
      if (estado !== undefined && observaciones !== undefined && (estado==='BIEN' ||estado==='REGULAR' ||estado==='MAL' ||estado==='NO REVISADO' )) {
        acc.push({
          id,
          review_id,
          estado,
          observaciones,
        });
      } else {
        setValidacionOk(false);
      }
  
      return acc;
    }, []);
  
    if (newData.length > 0 && validacionOk) {
      setRevisionData(newData);
      setCambiosApli(true);
    } else {
      navigation.navigate('HomeBooks')
      Alert.alert("Error en el campo estado, valores aceptados: 'BIEN', 'REGULAR', 'MAL', 'NO REVISADO'");
      setValidacionOk(true)
    }
  };
  


  const createReviewForSend = () => {
    const review = revisionData.map((ReviewData) => {
      const review_id = ReviewData.review_id;
      const review_type = etapa;
      const status = ReviewData.estado;
      const observation = ReviewData.observaciones;
      const user_id = userId;
      const unity_name = unitySelected;
      const subject_name = subjectSelected;
      const student_id = ReviewData.id;
      return {
        review_id,
        review_type,
        status,
        observation,
        user_id,
        unity_name,
        subject_name,
        student_id,
      };
    });

    SetReviewForSend(review);
  };

  useEffect(() => {
    createReviewForSend();
  }, [revisionData]);
  
  const sendReview = () => {


    createReviewForSend()

  

    
      const headers = {
        'Content-Type': 'application/json',
  
        Authorization: `Bearer ${token}`,
      };
      const params = {
        reviews: reviewForSend
      }
      console.log("datos a enviar" + params)
      axios.put('https://tfg-fmr.alwaysdata.net/back/public/api/update/reviews', params, { headers })
        .then(response => {
          if (response.data) {
  
            Alert.alert("se ha actualizado la revisión con exito")
            getReviews()
            setEditar(false)
            // navigation.navigate('HomeBooks')
          }
        }
        ).catch(error => {
          Alert.alert("Error al actualizar la revisión");
          console.log(error)
        })


    

    // Configurar los encabezados de la solicitud

  }

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
    
            <Button type="solid"  buttonStyle={styles.buttonStyle}onPress={getReviews} style={styles.button}>
              Mostrar Resultados
            </Button>
       
  
            <View style={styles.tableContainer}>
            {!editar ? <ReviewTable /> : <NativeBaseProvider>
              <View style={styles.tableColor}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
                  <Row  data={state.HeadTable} />
                  <Rows data={state.DataTable} />
                </Table>
              </View>
            </NativeBaseProvider>}

          </View>
          {(verEditar) && (unitySelected !== '') && (subjectSelected !== '')  && (
            <Button type="solid" onPress={() => handleChangeEdit()}
              buttonStyle={styles.buttonStyle}
              buttonTextStyle={styles.buttonTextStyle}
            >
              Editar
            </Button>
          )}
          {(editar) && (!cambiosApli) && (
            <Button type="solid" onPress={() => handleFinalizarRevision()}
              buttonStyle={styles.buttonStyle}>
              Aplicar Cambios
            </Button>
          )}
          {(editar) && (cambiosApli) && (<Button type="solid" onPress={() => sendReview()}
            buttonStyle={styles.buttonStyle}>
            Guardar Cambios
          </Button>
          )}
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
  buttonStyle: {
 marginLeft:105,
    width: 200,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#007932'
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
    textAlign: 'center'
    ,fontFamily:'NotoSansHK-Medium-Alphabetic'
  },
  button: {
    marginTop: 20,
  },
  buttonStyle: {
    marginTop: 10,
    marginBottom: 20,
    width: 200,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#007932',
    alignSelf: 'center',
  },
  buttonTextStyle: {
    textAlign: 'center',
  },
});
