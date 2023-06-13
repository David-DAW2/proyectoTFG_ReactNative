import React, { useState, useEffect } from "react";
import incidencias from "../incidencias";
import { View, ScrollView, TouchableOpacity, Text, Alert,StyleSheet } from "react-native";
import ReportReviewTable from "./ReportReviewTable";
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";

const ReviewReports = ({ navigation }) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [page, setPage] = useState(0);
    const [id, setId] = useState('')
    const [contenidoTabla, setContenidoTabla] = useState([])
    const [rol, setRol] = useState('')
    const [token, setToken] = useState('')
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
        console.log(rol)
        if (rol === "COORDINADOR TIC") {
            try {
                const response = await axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/tic/incidences`, { headers });
                console.log(response.data);
                setContenidoTabla(response.data.data);
            } catch (error) {
                console.log('Error al obtener las incidencias:', error);
                // Puedes mostrar una alerta o manejar el error de otra manera aquí
            }
        } else {
            try {
                const response = await axios.get(`https://tfg-fmr.alwaysdata.net/back/public/api/incidences`, { headers });
                console.log(response.data);
                setContenidoTabla(response.data.data);
            } catch (error) {
                console.log('Error al obtener las incidencias:', error);
                // Puedes mostrar una alerta o manejar el error de otra manera aquí
            }
        }

    };
    useEffect(() => {
        const getData = async () => {
            try {
                const idStore = await AsyncStorage.getItem('id');
                const tokenStore = await AsyncStorage.getItem('token')
                const rol = await AsyncStorage.getItem('rol')

                setId(idStore);
                setToken(tokenStore);
                setRol(rol)

            } catch (error) {
                console.log('Error al obtener datos de AsyncStorage:', error);
            }

        };

        getData();

    }, [rol]);
    useEffect(() => {
        if (id && token && rol) {
            getIncidences();
        }
    }, [id, token, rol]);

    const slicedData = contenidoTabla.slice(
        page * itemsPerPage,
        page * itemsPerPage + itemsPerPage
    );

    return (
        <View style={styles.container}>
            <ReportReviewTable data={slicedData} />
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

const styles = StyleSheet.create({
    container:{    backgroundColor: '#b8f7d4',
    height:1000
}
})
export default ReviewReports;
