import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function HomeCreate({ navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container} >
      <TouchableOpacity style={styles.image} activeOpacity={0.3}>

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
        titleStyle={'NotoSansHK-Medium'
        }
        onPress={() => { navigation.navigate('CreateTeacher') }} title={"Alta profesor"}></Button>
      <Button buttonStyle={styles.button}
        titleStyle={'NotoSansHK-Medium'
        }
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#368f3f', '#368f3f'],
          start: { x: 0, y: 0 },
          end: { x: 3, y: 0 },
        }}
        onPress={() => { navigation.navigate('CreateStudent') }} title={"Alta alumno"} ></Button>

    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 120,
    height: 120,
    resizeMode: 'contain',
    top: 20

  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b8f7d4'
  },
  button: {
    width: 210,
    height: 80,
    margin: 10,
    borderRadius: 10,
  },
});