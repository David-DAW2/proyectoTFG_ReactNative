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
export default function SearchBook({ navigation }) {
  const [options, setOptions] = useState([])
  const [userId, setUserId] = useState('')
  const [token, setToken] = useState('')
  const [unitySelected, setUnitySelected] = useState('')
  const [subjectSelected, setSubjectSelected] = useState('')
  const [students, setStudents] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [observations, setObservations] = useState([])
  const [reviewForSend, SetReviewForSend] = useState([])
  const etapas = ['ENTREGA', 'INTER 1', 'INTER 2', 'RECOGIDA']
  const [etapa, setEtapa] = useState('')
  const [revisionData, setRevisionData] = useState([]);
  const [revFinalizada, setRevFinalizada] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState(false)

  const estados = ['BIEN', 'REGULAR', 'MAL']
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const navegateToHome = () => {
    navigation.navigate('Home')
  }
  const handleSelect = (selectedItem, index) => {
    setUnitySelected(selectedItem.unity_name);
    setSubjectSelected(selectedItem.subject_name);



  };
  const handleFinalizarRevision = () => {
    const newData = state.DataTable.map((rowData, index) => {
      const [id, , observacionesComponent] = rowData;
      const estado = selectedOptions[index];
      const observaciones = observations[index];
      return {
        id,
        estado,
        observaciones,
      };
    });

    setRevisionData(newData);
    setRevFinalizada(true)
  };

  useEffect(() => {
    if (revisionData.length > 0) {
      createReviewForSend();
    }
  }, [revisionData]);


  const createReviewForSend = () => {
    const review = revisionData.map((ReviewData) => {
      const review_type = etapa;
      const status = ReviewData.estado;
      const observation = ReviewData.observaciones;
      const user_id = userId;
      const unity_name = unitySelected;
      const subject_name = subjectSelected;
      const student_id = ReviewData.id;
      return {
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

  const sendReview = async () => {
    const token = await AsyncStorage.getItem('token');

    // Configurar los encabezados de la solicitud
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const params = {
      reviews: reviewForSend
    }
    axios.post('http://localhost:8000/api/review', params, { headers })
      .then(response => {
        if (response.data) {
          if (response.data.success) {
            Alert.alert("se ha realizado la revisión con exito")
            navegateToHome()
          }
        }
      }
      ).catch(error => {
        Alert.alert("Error al realizar la revisión");
      })

  }
  useEffect(() => {
    console.log(reviewForSend)

  }, [reviewForSend])
  useEffect(() => {
    console.log("Este es el curso seleccionado=" + unitySelected);
    console.log("Este es la asignatura seleccionado=" + subjectSelected);
  }, [unitySelected, subjectSelected]);
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
      axios.get(`http://localhost:8000/api/taughts/${userId}`, { headers })
        .then(response => {
          setOptions(response.data)
        }
        )
    }
    console.log(token)
    if (token && userId) {
      getOptions();
    }
    console.log(options)

  }, [token, userId]);




  const getStudents = () => {

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(unitySelected)
    axios.get(`http://localhost:8000/api/${unitySelected}`, { headers })
      .then(response => {
        setStudents(response.data)
      }
      )
    console.log(students)
  }
  useEffect(() => {
    console.log(revisionData)
  }, [revisionData])


  const dataTable = students && students.data
    ? students.data.map((item, index) => {
      return [
        item.id,
        item.surnames,
        <SelectDropdown
          data={estados}
          onSelect={(selectedItem) => {
            setSelectedOptions((prevOptions) => {
              const updatedOptions = [...prevOptions];
              updatedOptions[index] = selectedItem;
              return updatedOptions;
            });
          }}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          dropdownIconPosition="right"
          buttonStyle={styles.dropdown2BtnStyle}
          buttonTextStyle={styles.dropdown2BtnTxtStyle}
          dropdownStyle={styles.dropdown2DropdownStyle}
          rowStyle={styles.dropdown2RowStyle}
          rowTextStyle={styles.dropdown2RowTxtStyle}
          defaultButtonText="estado"
        />,
        <TextArea onChangeText={(textValue) => {
          setObservations((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index] = textValue;
            return updatedOptions;
          });
        }} ></TextArea>

      ];
    })
    : [];
  
  const state = {
    HeadTable: ['id', 'nombre', 'Estado', 'observaciones'],
    DataTable: dataTable,
  };
  return (

    <NativeBaseProvider theme={theme}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <SelectDropdown
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
              setEtapa(selectedItem)
              console.log(etapa)
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
        {(unitySelected != '') && (subjectSelected != '')&&((!revFinalizada)) &&(selectedEtapa) && (<Button type="solid" style={styles.button} onPress={() => getStudents()} >
          Mostrar Resultados
        </Button>)}

        <Text></Text>
        {(unitySelected != '') && (subjectSelected != '')&&(!revFinalizada)&&(selectedEtapa) && (<NativeBaseProvider>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
              <Row data={state.HeadTable} />
              <Rows data={state.DataTable} />
            </Table>
          </View>
        </NativeBaseProvider>)}
        <Text></Text>
        {(unitySelected != '') && (subjectSelected != '')&&((!revFinalizada)) &&(selectedEtapa)  && (
          <Button type="solid" style={styles.button} onPress={handleFinalizarRevision}>
            Finalizar Revisión
          </Button>
        )}


        {(revFinalizada) && (<View>
          <Button type="solid" color="secondary" style={styles.button} onPress={sendReview}>
            Enviar
          </Button>
        </View>)}

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
  colors: newColorTheme,
});
const styles = StyleSheet.create({
  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#000'
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  Text: {
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 15,
  },
  header: {
    backgroundColor: '#FFA07A',
    padding: 10,


  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOptionText: {
    marginLeft: 5,
    fontSize: 16,
  },
  input: {
    marginTop: 3,
    width: '100%',
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    borderRadius: 10,
  },
  button: {

    backgroundColor: '#FFA07A',
    marginTop: 40,
    borderRadius: 10,
  },
});

