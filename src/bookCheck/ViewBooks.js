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
  const estados = ['BIEN', 'REGULAR', 'MAL', "NO REVISADO"]


  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [unitySelected, setUnitySelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const etapas = ['ENTREGA', 'EVALUACION 1', 'EVALUACION 2', 'RECOGIDA'];
  const [etapa, setEtapa] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [observations, setObservations] = useState([])
  const [revisionData, setRevisionData] = useState([]);
  const [reviewForSend, SetReviewForSend] = useState([])
  const [verEditar, setVerEditar] = useState(false)
  const [validacionOk, setValidacionOk] = useState(true)

  const [selectedOptions, setSelectedOptions] = useState([null]);
  const [editar, setEditar] = useState(false)
  const [cambiosApli, setCambiosApli] = useState(false)
  const [estadosTabla, setEstadosTabla] = useState([])
  const handleSelect = (selectedItem, index) => {
    if (selectedItem.unity_name && selectedItem.subject_name) {
      setUnitySelected(selectedItem.unity_name);
      setSubjectSelected(selectedItem.subject_name);
    }
  };
  useEffect(() => {
    const getToken = async () => {
      try {
        const tokenUser = await AsyncStorage.getItem('token');
        setToken(tokenUser)
        // Haz algo con el token, como guardarlo en el estado del componente
      } catch (error) {
        console.log('Error al obtener el token desde AsyncStorage:', error);
      }
    };

    getToken();
  }, []);
  const getReviews = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(unitySelected)
    console.log(subjectSelected)

    axios
      .get('https://tfg-fmr.alwaysdata.net/back/public/api/reviews/students', {
        headers,
        params: {
          user_id: userId,
          subject_name: subjectSelected,
          review_type: etapa,
          unity_name: unitySelected,
        },
      })
      .then((response) => {
        setReviewData(response.data);
        setVerEditar(true)
      })
      .catch((error) => {
        console.log('Error en los datos', error);
      });
  };
  useEffect(() => {
    console.log(reviewData)

  }, [reviewData])
  const handleChangeEdit = () => {
    setEditar(!editar)
    setCambiosApli(false)
  };

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
        .get(`https://tfg-fmr.alwaysdata.net/back/public/api/taughts/${userId}`, { headers })
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

  const ReviewTable = () => {
    const dataTable = reviewData && reviewData.data
      ? reviewData.data.map((item) => {
        return [      <Text style={styles.surnameStyle}>({item.student_id}{item.review_id}) - {item.name} {item.surnames}  </Text>,
        , item.status, item.observation];
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
      <Text style={styles.surnameStyle}>({item.student_id}{item.review_id}) - {item.name} {item.surnames}  </Text>,
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
    />
    ,
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

    reviewForSend.map(review => {
      if (review.status === "BIEN" || review.status === "MAL" || review.status === "REGULAR" || review.status === "NO REVISADO") {
      } else {
        setValidacionOk(false)
      }
      return review;
    });
  

    
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
            <Button type="solid" onPress={getReviews} buttonStyle={styles.buttonStyle}>
              Mostrar Resultados
            </Button>
          )}

          <View style={styles.tableContainer}>
            {!editar ? <ReviewTable /> : <NativeBaseProvider>
              <View style={styles.tableColor}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
                  <Row data={state.HeadTable} />
                  <Rows data={state.DataTable} />
                </Table>
              </View>
            </NativeBaseProvider>}

          </View>
          {(verEditar) && (unitySelected !== '') && (subjectSelected !== '') && (selectedEtapa) && (
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
  colorBase: {
    backgroundColor: '#b8f7d4'

  },

  drop: {
    marginLeft: 100
  },
  baseColor: { backgroundColor: '#b8f7d4' },
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

  container: {
    marginLeft: 80
    , marginBottom: 30, colors: '#b8f7d4'


  },surnameStyle:{
    fontFamily:'NotoSansHK-Medium-Alphabetic',
    fontSize:15
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