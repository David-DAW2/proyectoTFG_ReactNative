import React, { useState,useEffect } from "react";
import incidencias from "../incidencias";
import { View, ScrollView, TouchableOpacity, Text,Alert } from "react-native";
import ReportTable from "./ReportTable";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";

const MyReports = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [page, setPage] = useState(0);
  const[id,setId]=useState('')
  const[contenidoTabla,setContenidoTabla]=useState([])

  const [token,setToken]=useState('')
  const itemsPerPage = 10;

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const params = {
    user_id: id
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const getIncidences = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/incidences`,{ params,headers });
      console.log(response.data);
      setContenidoTabla(response.data.data);
    } catch (error) {
      console.log('Error al obtener las incidencias:', error);
      // Puedes mostrar una alerta o manejar el error de otra manera aquí
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const idStore = await AsyncStorage.getItem('id');
        const tokenStore= await AsyncStorage.getItem('token')
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

  return (
    <View>
      <ReportTable data={slicedData} />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={page === 0}
          style={{ padding: 10 }}
        >
          <Text>{`<`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={(page + 1) * itemsPerPage >= incidencias.length}
          style={{ padding: 10 }}
        >
          <Text>{`>`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyReports;
