import React from 'react'
import { View, StyleSheet,TouchableOpacity,Image } from "react-native";
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default function HomeBooks({ navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container} >
<TouchableOpacity style={styles.containerImage  } activeOpacity={0.3}>

<Image
  source={require('../images/escudoMachado.jpg')
  } style={styles.image}

/>
</TouchableOpacity>
      <Button buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#368f3f', '#368f3f'],
          start: { x: 0, y: 0 },
          end: { x: 3, y: 0 },
        }}

        onPress={() => { navigation.navigate('SearchBook') }} title={"Nueva revisión"}></Button>
      <Button buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#368f3f', '#368f3f'],
          start: { x: 0, y: 0 },
          end: { x: 3, y: 0 },
        }}
        onPress={() => { navigation.navigate('ViewBooks') }} title={"Mis revisiones"} ></Button>

    </View>
  )
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  button: {
    width: 210,
    height: 80,

    margin: 10,
    borderRadius: 10,
  },
  image: {
    position:'absolute',
    width: 120,
    height: 120,
    resizeMode: 'center',
    top:20,
    borderWidth: 1, 
    borderRadius:6,

  borderColor: 'black', 
},
containerImage: {
  position:'absolute',
  width: 120,
  height: 120,
  resizeMode: 'center',
  top:20,


},
});