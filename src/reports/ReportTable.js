import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, ScrollView ,TouchableHighlight,Alert} from 'react-native';
import { DataTable } from 'react-native-paper';
import { green100 } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

const ReportTable = ({ data }) => {
    const navigation = useNavigation();
    const navigateToDetailReport = (props) => {
        
        navigation.navigate('DetailReport', props);
    };
    return (
        <View style={styles.container}>
            <ScrollView >
                <DataTable >
                <DataTable.Header style={styles.tableHeader}
          >
            <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white'}}>Id usuario</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white'}}>Descripción</DataTable.Title>
            <DataTable.Title textStyle={{fontWeight:'bold', fontSize:20, color:'white', marginLeft:10}}>Estado</DataTable.Title>
          </DataTable.Header>

                    {data && data.length > 0 ? (
                        data.map((incidencia, index) => (
                            <TouchableHighlight  onPress={() => {  navigateToDetailReport({incidencia: incidencia}) }}>
                            <DataTable.Row key={index} style={styles.Row}>
                                <DataTable.Cell  textStyle={{fontFamily:'NotoSansHK-Medium-Alphabetic',marginLeft:10}}>
                                    {incidencia.date}
                                </DataTable.Cell>
                                <DataTable.Cell  textStyle={{fontFamily:'NotoSansHK-Medium-Alphabetic',marginLeft:10}}>{incidencia.description}</DataTable.Cell>
                                <DataTable.Cell  textStyle={{fontFamily:'NotoSansHK-Medium-Alphabetic',marginLeft:10}}>{incidencia.status}</DataTable.Cell>
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
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      container: {
        backgroundColor: '#85FEE6',
        padding: 10,
        borderRadius: 10,
        margin: 10,
      },
      tableHeader: {
        backgroundColor: '#007932',
        alignItems:'center'
      },
});

export default ReportTable;
