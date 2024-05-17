import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../ProductionOrders/Components/Home';
import HomeScreenProdOrders from '../ProductionOrders/Components/HomeScreenProdOrders';
import SelectionList from '../ProductionOrders/Components/SelectionList';
import Lines from '../ProductionOrders/Components/Lines';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  Image
} from 'react-native';
import InitialPage from './Components/InitialPage';
import LoginState from './Context/LogginContext/LoginState';
import AppContent from './AppContent';

const Stack = createNativeStackNavigator();
export default function App() {
  const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);


  useEffect(() => {
    

 }, []);
  
  return (
    <View style={styles.container}>
      <LoginState>
        <AppContent/>
      </LoginState>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: '#E9E6E5',
    
    
    
  },
  logo: {
    width: '90%',
  },
});