import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet} from 'react-native';

import Home from '../src/loggin/Home';
import Login from '../src/loggin/Login';
import { NewReport } from '../src/reports/NewReport';
import MyReports from '../src/reports/MyReports';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import ResetPass from '../src/loggin/ResetPass';
import DetailReviewReport from '../src/reports/DetailReviewReport';
import ReviewReports from '../src/reports/ReviewReports';
import HomeReports from '../src/reports/HomeReports';
import SearchBook from '../src/bookCheck/SearchBook';
import TableBooks from '../src/bookCheck/TableBooks';
import DetailReport from '../src/reports/DetailReport';
const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
        />

        <Stack.Screen
          name='Home'
          component={Home}
        />
        <Stack.Screen
          name='HomeReports'
          component={HomeReports}
        />

        <Stack.Screen
          name='NewReport'
          component={NewReport}
        />
        <Stack.Screen
          name='DetailReport'
          component={DetailReport}
        />
        <Stack.Screen
          name='MyReports'
          component={MyReports}
        />

        <Stack.Screen
          name='SearchBook'
          component={SearchBook}
        />
        <Stack.Screen
          name='TableBooks'
          component={TableBooks}
        />
        <Stack.Screen
          name='ReviewReports'
          component={ReviewReports}
        />
              <Stack.Screen
          name='DetailReviewReport'
          component={DetailReviewReport}
        />
       
              <Stack.Screen
          name='ResetPass'
          component={ResetPass}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStack;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#85FEE6',
    }
  });