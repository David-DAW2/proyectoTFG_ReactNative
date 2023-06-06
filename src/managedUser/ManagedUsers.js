import React, { useState, useEffect } from 'react';
import { Alert, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Button } from 'react-native-elements';
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { DataTable } from 'react-native-paper';

export default function ManagedUsers({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);



  const navigateToDetailUser = (props) => {
    console.log(props)

    navigation.navigate('DetailUser', props);
  };
  const [userSearch, setUserSearch] = useState('')
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar el número de página actual
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const [userForDetail, setUserForDetail] = useState([]);
  const [shouldNavigate, setShouldNavigate] = useState(false);

useEffect(() => {
  if (shouldNavigate) {
    navigateToDetailUser({ userData: userForDetail });
    setShouldNavigate(false); // Reiniciar el valor después de la navegación
  }
}, [shouldNavigate, userForDetail]);

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

  const getUserSearch = () => {
    if (userSearch=='') {
      Alert.alert('No se ha introducido ID de usuario')
    }else{   if (token) {
      const headers = {
        authorization: `Bearer ${token}`
      };
      axios.get(`http://localhost:8000/api/user/${userSearch}`, { headers })
        .then(response => {
          setUserForDetail(response.data.data);
          setShouldNavigate(true); // Establecer el valor para activar la navegación

 
        })
        .catch(error => {
          console.log('Error al obtener los usuarios:', error);
          Alert.alert('No se ha encontrado el usuario')

        });
    }}
 

  }

  const getUsers = () => {
    if (token) {
      const headers = {
        authorization: `Bearer ${token}`
      };
      axios.get('http://localhost:8000/api/users', { headers })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.log('Error al obtener los usuarios:', error);
        });
    }
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return userData.data && userData.data.length > 0 ? userData.data.slice(startIndex, endIndex) : [];
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (

    <NativeBaseProvider style={styles.baseColor} theme={theme}>
      <ScrollView contentContainerStyle={styles.baseColor}>
        <View>
          <TextInput value={userSearch} onChangeText={setUserSearch} style={styles.TextIn}></TextInput>
          <Button type="solid" title={"Buscar usuario"} buttonStyle={styles.buttonStyle} onPress={() => getUserSearch()}>
            Buscar
          </Button>
          <Button type="solid" title={"Mostrar todos los usuarios"} buttonStyle={styles.buttonStyle} onPress={getUsers}>
           
          </Button>
        </View>
        <View>

          {(userData && userData.data && userData.data.length > 0) && (
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white'}} style={styles.cell}>Name</DataTable.Title>
                <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white'}}>Email</DataTable.Title>
                <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white', marginLeft:10}}>id</DataTable.Title>
              </DataTable.Header>

              {getCurrentPageItems().map(item => (

                <TouchableHighlight
                  key={item.id}
                  onPress={() => {
                    navigateToDetailUser({ userData: item });
                  }}
                >

                  <DataTable.Row key={item.id}>
                    <DataTable.Cell textStyle={{fontFamily:'Feather',marginLeft:10}}   style={styles.cell}>{item.name}</DataTable.Cell>
                    <DataTable.Cell textStyle={{fontFamily:'Feather',marginLeft:10}}>{item.email}</DataTable.Cell>
                    <DataTable.Cell textStyle={{fontFamily:'Feather',marginLeft:10}}>{item.id}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableHighlight>

              ))}

              <DataTable.Pagination
                page={currentPage} // Establecer la página actual
                numberOfPages={Math.ceil(userData.data.length / itemsPerPage)} // Calcular el número total de páginas
                onPageChange={handlePageChange} // Manejar el cambio de página
                label={`${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, userData.data.length)} of ${userData.data.length}`} // Etiqueta personalizada para mostrar la información de paginación
              />
            </DataTable>
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
  baseColor: { 
  
   
    backgroundColor: '#b8f7d4',height:1000 },


  TextIn: {
    marginLeft:42,
    marginTop: 30,
    width: '80%',
    height: 40,
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  cell: { flex: 2,
  
   },
  container: {
    backgroundColor: '#b8f7d4',
    width:'100%',

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
        marginLeft:'25%',

  },
  buttonStyle:{
    padding:'auto',
    marginTop:10,
    marginBottom:20,
    marginLeft:'25%',
    width:200,
    height:60,
    borderRadius:10,
    backgroundColor: '#007932'
 },
 tableHeader: {
  backgroundColor: '#007932',
  alignItems:'center'
},
});

