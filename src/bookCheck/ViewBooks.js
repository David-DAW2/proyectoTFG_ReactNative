import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import React from 'react'

export default function ViewBooks({navigation}) {
    React.useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);
    
  return (
    <View>
      
    </View>
  )
}
