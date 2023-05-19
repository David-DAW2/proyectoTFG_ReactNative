import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { Button } from '@rneui/themed';
import { Select, Box, NativeBaseProvider, Center, extendTheme, TextArea, CheckIcon, ScrollView } from "native-base";
import TableBooks from "./TableBooks";
import revisiones from "../revisiones";

export default function SearchBook({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

    const [group, setGroup] = useState('')
    const [subject, setsubject] = useState('')
    const [period, setPeriod] = useState('')
    const [visual, setVisual]= useState(1)
    const[search, setSearch]= useState({
        group:'',
        subject:'',
        period:''

    })


    const [results, setResults] = useState('')

    const handleSave = () => {
        // Check if fields are empty
        if (group === '' && subject === '' && period === '') {
          setResults(null)
        } else {
          setSearch({ group, subject, period })
          // Perform search here and set results
        }
      }
    const handleVisual= () =>{
        setVisual(0)
    }
    return (
        <NativeBaseProvider>
                    <ScrollView>
                    {visual === 1 ? (
  <>
    <Text style={[styles.Text, ]} >Grupo:</Text>
    <TextInput
      style={styles.input}
      onChangeText={setGroup}
      value={group}
      placeholder="ej:1ºA.."
    />

    <Text style={styles.Text}>Asignatura:</Text>
    <TextInput
      style={styles.input}
      onChangeText={setsubject}
      value={subject}
      placeholder="ej: Matemáticas"
    ></TextInput>
    <Center>
      <Box maxW="300">
        <Select selectedValue={period} minWidth="200" accessibilityLabel="Elija el periodo" placeholder="Elija el periodo" _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
        }} mt={1} onValueChange={itemValue => setPeriod(itemValue)}>
          <Select.Item label="entrega" value="entrega" />
          <Select.Item label="inter 1" value="inter 1" />
          <Select.Item label="inter 2" value="inter 2" />
          <Select.Item label="recogida" value="recogida" />
        </Select>
      </Box>
    </Center>
    <Button type="solid" style={styles.button} onPress={() => {handleSave(),handleVisual(), Alert.alert(`group: ${search.group}\n subject: ${search.subject}`), Alert.alert(search.period) }}>
                Mostrar resultados
            </Button>

  </>
) : null}


{search != null ? (
  <>
    <Text style={styles.Text}>Resultados:</Text>
    <TableBooks data={revisiones}></TableBooks>
  </>
) : (
  <Text style={styles.Text}>No se encuentran resultados</Text>
)}
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
    container: {
        flex: 1,
        paddingHorizontal: 20,
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

