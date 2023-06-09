import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput,StyleSheet,  Alert } from 'react-native'
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
  const [selectedOptions, setSelectedOptions] = useState([null]);
  const [observations, setObservations] = useState([])
  const [reviewForSend, SetReviewForSend] = useState([])
  const etapas = ['ENTREGA', 'EVALUACION 1', 'EVALUACION 2', 'RECOGIDA']
  const [etapa, setEtapa] = useState('')
  const [revisionData, setRevisionData] = useState([]);
  const [revFinalizada, setRevFinalizada] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState(false)

  const estados = ['BIEN', 'REGULAR', 'MAL', "NO REVISADO"]
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
    const newData = state.DataTable.reduce((acc, rowData, index) => {
      const estado = selectedOptions[index]==null? "NO REVISADO":selectedOptions[index];
      const observaciones = observations[index];
      const id = students && students.data && students.data[index] ? students.data[index].id : null;
  
      if (estado !== undefined || observaciones !== undefined) {
        acc.push({
          id,
          estado,
          observaciones,
        });
      }
  
      return acc;
    }, []);
  
    if (newData.length > 0) {
      setRevisionData(newData);
      setRevFinalizada(true);
    } else {
      Alert.alert('No se encontraron objetos con estado y observación definidos.');
    }
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

    const headers = {
      'Content-Type': 'application/json',

      Authorization: `Bearer ${token}`,
    };
    const params = {
      reviews: reviewForSend
    }
    axios.post('https://tfg-fmr.alwaysdata.net/back/public/api/review', params, { headers })
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
      axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/taughts/${userId}`, { headers })
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
    axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/${unitySelected}`, { headers })
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
         <Text style={styles.surnameStyle}>({item.id}{item.review_id}) -{item.name} {item.surnames}</Text> ,
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
          buttonStyle={styles.dropdown2BtnStyle2}
          buttonTextStyle={styles.dropdown2BtnTxtStyle}
          dropdownStyle={styles.dropdown2DropdownStyle}
          rowStyle={styles.dropdown2RowStyle}
          rowTextStyle={styles.dropdown2RowTxtStyle}
          defaultButtonText="estado"
          defaultValue={selectedOptions[index] || null}
        />,
        <TextArea
        fontSize={15}
          style={styles.textAreaStyle} 
          onChangeText={(textValue) => {
            setObservations((prevOptions) => {
              const updatedOptions = [...prevOptions];
              updatedOptions[index] = textValue;
              return updatedOptions;
            });
          }}
        ></TextArea>
      ];
    })
  : [];

  const state = {
    HeadTable: ['Nombre', 'Estado', 'Observaciones'],
    DataTable: dataTable,
  };
  return (
    <NativeBaseProvider style={styles.baseColor} theme={theme}>
      <ScrollView style={styles.baseColor}>
      <View style={styles.headerNav}>
        <Text style={styles.headerText}>Crear revisión </Text>
      </View>
        <View style={styles.container}>
  
                    <SelectDropdown
            data={options.data}
            onSelect={handleSelect}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.unity_name +" - "+ selectedItem.subject_name;
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
            defaultButtonText='Elija curso y asignatura'
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
            defaultButtonText='Elija una etapa'
            />
        </View>
        <Text></Text>
        {(unitySelected != '') && (subjectSelected != '') && ((!revFinalizada)) && (selectedEtapa) && (<Button type="solid"  buttonStyle={styles.buttonStyle} onPress={() => getStudents()} >
          Mostrar Resultados
        </Button>)}
  
        <Text></Text>
        {(unitySelected != '') && (subjectSelected != '') && (!revFinalizada) && (selectedEtapa) && (<NativeBaseProvider>
          <View style={styles.tableColor}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
              <Row 
              style={styles.headerRowStyle}             textStyle={styles.rowTextStyle}
              data={state.HeadTable} />
              <Rows data={state.DataTable} />
            </Table>
          </View>
        </NativeBaseProvider>)}
        <Text></Text>
        {(unitySelected != '') && (subjectSelected != '') && ((!revFinalizada)) && (selectedEtapa) && (
          <Button type="solid" buttonStyle={styles.buttonStyle} onPress={handleFinalizarRevision}>
            Finalizar Revisión
          </Button>
        )}
  
  
        {(revFinalizada) && (
          <Button type="solid" color="secondary"  buttonStyle={styles.buttonStyle} onPress={sendReview}>
            Enviar
          </Button>
        )}
  
      </ScrollView>
    </NativeBaseProvider>
  );
}



const theme = extendTheme({
  colors: 'white'
});
const styles = StyleSheet.create({
  baseColor:{backgroundColor:'white',
},
headerNav: {
  width: '100%',
  paddingVertical: 10,
  alignItems: 'center',
  marginBottom: 30,
  marginTop:0
  ,    backgroundColor: '#007932',

  
},
headerText: {
  paddingTop:10,

  fontSize: 24,
  color: '#FFF',
  fontFamily:'NotoSansHK-Medium-Alphabetic'
},
  tableColor:{backgroundColor:'#FFF'},
  surnameStyle:{
    fontFamily:'NotoSansHK-Medium-Alphabetic',
    fontSize:15
  },
  headerRowStyle: {
    alignSelf:'center',
    backgroundColor: 'green',
    height: 50
  },
  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#000',
    alignSelf: 'center', 
    borderWidth:1
  }, dropdown2BtnStyle2: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#000',
    alignSelf: 'center', 
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
  buttonStyle: {
    marginTop: 10,
    marginBottom: 20,
    width: 200,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#007932',
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'White',

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
  rowTextStyle: {
    textAlign: 'center',
    fontWeight: "bold"
  },
  textAreaStyle: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    height: 100,
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

