import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, Picker, Modal, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from 'react-native-elements';

export default function Home({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [showOptions, setShowOptions] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [rol, setRol] = useState('');
  const [rolLoaded, setRolLoaded] = useState(false);
  const [name, setName] = useState('');

 
  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('rol');
      const valueName = await AsyncStorage.getItem('user');
      setName(valueName);
      setRol(value);
      setRolLoaded(true);
    } catch (error) {
      console.log('Error al obtener datos de AsyncStorage:', error);
    }
  };
  useEffect(() => {
    loadData();
    return () => {
      setModalVisible(false);
    };
  }, [rol]);

  useEffect(() => {
    loadData();
  }, [rol]);

  const selecRolReview=(()=>{
    if (rol=='DIRECTIVO') {
      navigation.navigate('HomeBooksDirective')
    }else{
      navigation.navigate('HomeBooks')
    }
  })
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
   
      loadData(); 
    } catch (error) {
      console.log('Error al eliminar datos de AsyncStorage:', error);
    }
  };

  if (!rolLoaded) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Image 
          source={require('../images/escudoMachado.jpg')}
          style={styles.image}
        />
      

      <TouchableOpacity style={styles.icon} onPress={() => setShowOptions(!showOptions)} activeOpacity={0.3}>
        <AntDesign name='user' size={35} color='#000' />
      </TouchableOpacity>

      {rol === 'PROFESOR' && (
        <Button
          title="Incidencias"
          buttonStyle={styles.button}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#368f3f', '#368f3f'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => navigation.navigate('HomeReports')}
        />
      )}

{( rol === 'DIRECTIVO') && (
        <Button
          title="Gestionar usuarios"
          buttonStyle={styles.button}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#368f3f', '#368f3f'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => navigation.navigate('ManagedUsers')}
        />

     
      )}

{( rol === 'DIRECTIVO') && (
<Button
        title="Alta usuarios"
        buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#368f3f', '#368f3f'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        onPress={() => navigation.navigate('HomeCreate')}
      />
     )}
      {(rol === 'COORDINADOR TIC' || rol === 'DIRECTIVO') && (
        <Button
          title="Revisar incidencias"
          buttonStyle={styles.button}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#368f3f', '#368f3f'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => navigation.navigate('ReviewReports')}
        />
      )}
 {(rol !== 'COORDINADOR TIC') &&(
      <Button
        title="Revisiones libros"
        buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#368f3f', '#368f3f'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        onPress={() =>selecRolReview()}
      />
      )}
{showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => { setShowOptions(false); navigation.navigate('ResetPass') }}>
            <Text style={styles.optionText}>Cambiar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}  onPress={() => { handleLogout(), navigation.navigate('Login') }}>
            <Text style={styles.optionText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 70,
    height: 70,
    resizeMode: 'contain',
    left: 4,
    top: 4
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
    height: 120,
    margin: 10,
    marginBottom:10,
    borderRadius: 10,
  },
  buttonModal: {
    width: 150,
    margin: 10,
    borderRadius: 10,
  },
  buttonModalSesion: {
    backgroundColor: '#FF0000',
    width: 150,
    margin: 10,
    borderRadius: 10,
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  modal: {
    width: '80%',
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: '10%',
    marginTop: '40%',
    zIndex: 1
  },
  optionsContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 4,
    zIndex: 1,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    fontFamily:'NotoSansHK-Regular-Alphabetic'
  },
});
