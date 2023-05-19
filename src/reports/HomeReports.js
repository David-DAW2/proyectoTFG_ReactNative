import React from 'react'
import { View, StyleSheet} from "react-native";
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default function HomeReports({navigation}) {

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);
    
    return (
        <View style={styles.container} >
            <Button buttonStyle={styles.button} 
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#FFA07A', '#00FF7F'],
                        start: { x: 0, y: 0 },
                        end: { x: 3, y: 0 },
                      }}

                    onPress={() => { navigation.navigate('NewReport') }} title={"Nueva Incidencia"}></Button>
            <Button buttonStyle={styles.button} 
               ViewComponent={LinearGradient}
               linearGradientProps={{
                   colors: ['#FFA07A', '#00FF7F'],
                   start: { x: 0, y: 0 },
                   end: { x: 3, y: 0 },
                 }}
onPress={()=>{navigation.navigate('MyReports')}} title={"Mis Incidencias"} ></Button>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#85FEE6'
      },
    button: {
      width: 210,
      height: 80,

      margin: 10,
      borderRadius: 10,
    },
  });