import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView ,TouchableHighlight,Alert} from 'react-native';
import { DataTable } from 'react-native-paper';
import { green100 } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

const ReportReviewTable = ({ data }) => {
    const navigation = useNavigation();
    const navigateToDetailReport = (props) => {
        
        
        navigation.navigate('DetailReviewReport', props);
    };
    return (
        <View style={styles.container}>
            <ScrollView  style={styles.container}>
                <DataTable>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title>Fecha</DataTable.Title>
                        <DataTable.Title>Descripción</DataTable.Title>
                        <DataTable.Title>Estado</DataTable.Title>
                    </DataTable.Header>

                    {data && data.length > 0 ? (
                        data.map((incidencia, index) => (
                            <TouchableHighlight  onPress={() => {  navigateToDetailReport({incidencia: incidencia}) }}>
                            <DataTable.Row key={index} style={styles.Row}>
                                <DataTable.Cell>
                                    {incidencia.date}
                                </DataTable.Cell>
                                <DataTable.Cell>{incidencia.description}</DataTable.Cell>
                                <DataTable.Cell>{incidencia.status}</DataTable.Cell>
                            </DataTable.Row>
                            </TouchableHighlight>
                        ))
                    ) : (
                        <DataTable.Row>
                            <DataTable.Cell>No hay datos disponibles</DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#85FEE6',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    tableHeader: {
        backgroundColor: '#FDF4F5',
    },
    Row: {
        borderWidth: 1,
    }
});

export default ReportReviewTable;
