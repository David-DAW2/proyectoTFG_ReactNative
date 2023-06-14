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
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(10);
  const [userForDetail, setUserForDetail] = useState([]);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (shouldNavigate) {
      navigateToDetailUser({ userData: userForDetail });
      setShouldNavigate(false);
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
    if (userSearch == '') {
      Alert.alert('No se ha introducido ID de usuario')
    } else {
      if (token) {
        const headers = {
          authorization: `Bearer ${token}`
        };
        axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/user/${userSearch}`, { headers })
          .then(response => {
            setUserForDetail(response.data.data);
            setShouldNavigate(true); 


          })
          .catch(error => {
            console.log('Error al obtener los usuarios:', error);
            Alert.alert('No se ha encontrado el usuario')

          });
      }
    }


  }

  const getUsers = () => {
    if (token) {
      const headers = {
        authorization: `Bearer ${token}`
      };
      axios.get('https://tfg-fmr.alwaysdata.net/back/public/api/users', { headers })
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (

    <NativeBaseProvider style={styles.baseColor} theme={theme}>

      <ScrollView contentContainerStyle={styles.baseColor}>
      <View style={styles.headerNav}>
        <Text style={styles.headerText}>Gestión usuarios</Text>
      </View>
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
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 20, color: 'white' }} style={styles.cell}>Name</DataTable.Title>
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Email</DataTable.Title>
                <DataTable.Title textStyle={{ fontWeight: 'bold', fontSize: 20, color: 'white', marginLeft: 10 }}>id</DataTable.Title>
              </DataTable.Header>

              {getCurrentPageItems().map(item => (

                <TouchableHighlight
                  key={item.id}
                  onPress={() => {
                    navigateToDetailUser({ userData: item });
                  }}
                >

<DataTable.Row key={item.id} style={styles.tableRow}>
  <DataTable.Cell textStyle={{ fontFamily: 'NotoSansHK-Medium', }} style={[styles.cell, styles.firstCell]}>{item.name}</DataTable.Cell>
  <DataTable.Cell textStyle={{ fontFamily: 'NotoSansHK-Medium', marginLeft: 10 }}>{item.email}</DataTable.Cell>
  <DataTable.Cell textStyle={{ fontFamily: 'NotoSansHK-Medium' }}>{item.id}</DataTable.Cell>
</DataTable.Row>
                </TouchableHighlight>

              ))}

              <DataTable.Pagination
                page={currentPage} 
                numberOfPages={Math.ceil(userData.data.length / itemsPerPage)} 
                onPageChange={handlePageChange} 
                label={`${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, userData.data.length)} of ${userData.data.length}`} 
              />
            </DataTable>
          )}


        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}


const theme = extendTheme({
  colors: 'white'
});
const styles = StyleSheet.create({
  
  baseColor: {


    backgroundColor: 'white', height: 1000
  },
  headerNav: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop:0
    ,    backgroundColor: '#007932',
  
    
  },
  headerText: {
    paddingTop:10,
  
    fontSize: 24,
    color: '#FFF',
    fontFamily:'NotoSansHK-Medium-Alphabetic'
  },

  TextIn: {
    fontFamily: 'NotoSansHK-Medium',

    marginLeft: 42,
    marginTop: 70,
    width: '80%',
    height: 40,
    margin: 3,
    borderWidth: 1,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  cell: {
    flex: 2,

  },
  container: {
    backgroundColor: 'white',
    width: '100%',

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  Text: {
    fontFamily: 'NotoSansHK-Medium',

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
    marginLeft: '25%',

  },
  buttonStyle: {
    padding: 'auto',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: '25%',
    width: 200,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#007932'
  },
  tableHeader: {
    backgroundColor: '#007932',
    alignItems: 'center'
  },
});

