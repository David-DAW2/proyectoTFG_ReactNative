import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import ReportTable from "./ReportTable";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';

const MyReports = ({ navigation }) => {
  const isFocused = useIsFocused(); 

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [page, setPage] = useState(0);
  const [id, setId] = useState('');
  const [contenidoTabla, setContenidoTabla] = useState([]);
  const [token, setToken] = useState('');
  const itemsPerPage = 10;

  const handleNextPage = () => {
    if ((page + 1) * itemsPerPage < contenidoTabla.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const params = {
    user_id: id
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getIncidences = async () => {
    try {
      const response = await axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/user/incidences`, { params, headers });
      console.log(response.data);
      setContenidoTabla(response.data.data);
    } catch (error) {
      console.log('Error al obtener las incidencias:', error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const idStore = await AsyncStorage.getItem('id');
        const tokenStore = await AsyncStorage.getItem('token')
        setId(idStore);
        setToken(tokenStore);
      } catch (error) {
        console.log('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (id && token) {
      getIncidences();
    }
  }, [id, token]);

  const slicedData = contenidoTabla.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    if (isFocused) {
        getIncidences();
    }
}, [isFocused]);
  return (
    <View style={styles.container}>
            <View style={styles.headerNav}>
        <Text style={styles.headerText}>Mis incidencias</Text>
      </View>
      <ReportTable data={slicedData} />
      <View style={{ flexDirection: "row", justifyContent: "center" ,marginTop:20}}>
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={page === 0}
          style={{ padding: 10 }}
        >
          <Text>{`<`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={(page + 1) * itemsPerPage >= contenidoTabla.length}
          style={{ padding: 10 }}
        >
          <Text>{`>`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: 'white',
    height: 1000
  }
})

export default MyReports;
