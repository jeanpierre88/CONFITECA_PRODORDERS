import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Components/Home';
import HomeScreenProdOrders from './Components/HomeScreenProdOrders';
import InsumosAgrupados from './Components/InsumosAgrupados';
import SelectionList from './Components/SelectionList';
import POLsByItem from './Components/POLsByItem';
import Lines from './Components/Lines';
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
import { LoginContext } from './Context/LogginContext/LoginContext';

const Stack = createNativeStackNavigator();
export default function AppContent() {
  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const { stateLogin, userLogin, getLogin } = useContext(LoginContext);



  useEffect(() => {

    //getLogin("","");


  }, [stateLogin]);

  return (
    <View style={styles.container}>

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName={stateLogin ? "InitialPage" : "Home"}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="InitialPage" component={InitialPage} />
          <Stack.Screen name="ProdOrders" component={HomeScreenProdOrders} />
          <Stack.Screen name="ListSelection" component={SelectionList} />
          <Stack.Screen name="Lines" component={Lines} />
          <Stack.Screen name="Insumos" component={InsumosAgrupados} />
          <Stack.Screen name="OrdenesXProducto" component={POLsByItem} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#E9E6E5',



  },
  logo: {
    width: '90%',
  },
});