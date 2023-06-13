import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

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
import HomeBooks from '../src/bookCheck/HomeBooks';
import ViewBooks from '../src/bookCheck/ViewBooks';
import ViewBooksDirective from '../src/bookCheck/ViewBooksDirective';
import HomeBooksDirective from '../src/bookCheck/HomeBooksDirective';
import ViewBooksStatusAndStage from '../src/bookCheck/ViewBooksStatusAndStage';
import ManagedUsers from '../src/managedUser/ManagedUsers';
import DetailUser from '../src/managedUser/DetailUser';
import HomeCreate from '../src/create/HomeCreate';
import CreateStudent from '../src/create/CreateStudent';
import CreateTeacher from '../src/create/CreateTeacher';
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
        <Stack.Screen
          name='HomeBooks'
          component={HomeBooks}
        />
        <Stack.Screen
          name='ViewBooks'
          component={ViewBooks}
        />
           <Stack.Screen
          name='CreateStudent'
          component={CreateStudent}
        />
                   <Stack.Screen
          name='CreateTeacher'
          component={CreateTeacher}
        />
        <Stack.Screen
          name='HomeCreate'
          component={HomeCreate}
        />

        <Stack.Screen
          name='ViewBooksDirective'
          component={ViewBooksDirective}
        />
        <Stack.Screen
          name='HomeBooksDirective'
          component={HomeBooksDirective}
        />

        <Stack.Screen
          name='ViewBooksStatusAndStage'
          component={ViewBooksStatusAndStage}
        />

        <Stack.Screen
          name='ManagedUsers'
          component={ManagedUsers}
        />


        <Stack.Screen
          name='DetailUser'
          component={DetailUser}
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