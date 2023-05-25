import React from 'react'
import { View, StyleSheet} from "react-native";
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default function HomeBooks({navigation}) {

    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);
    
    return (
        <View style={styles.container} >
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
onPress={()=>{navigation.navigate('ViewBooks')}} title={"Mis revisiones"} ></Button>

        </View>
    )
}

const styles = StyleSheet.create({
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