import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import MyReports from './reports/MyReports';
import { NewReport } from './reports/NewReport';
import MainStack from '../navigation/MainTask';
function Main() {
  return (
          <MainStack />
   
  );
}

export default Main;