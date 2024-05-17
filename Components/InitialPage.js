import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput
} from 'react-native';


export default function InitialPage({ navigation }) {
  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');


  useEffect(() => {


  }, []);
  const onChangeText = (text) => {
    try {
      if (text != '') {
        setUser(text);
      } else {
        setUser('');
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }
  const onChangePassword = (text) => {
    try {
      if (text != '') {
        setPassword(text);
      } else {
        setPassword('');
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }


  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/imgs/logo.png')}
      />

      <Pressable onPress={() => navigation.navigate('ProdOrders')}

        style={({ pressed }) => [
          {
            marginVertical: 20, width: '90%', paddingHorizontal: 35, paddingVertical: 15, borderRadius: 20, borderColor: 'black', borderStyle: 'solid', borderWidth: 2,
            backgroundColor: pressed ? '#DE9393' : '#EB1C2E',
          }

        ]}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>
          Órdenes Individuales
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Insumos')}

        style={({ pressed }) => [
          {
            marginVertical: 20, width: '90%', paddingHorizontal: 35, paddingVertical: 15, borderRadius: 20, borderColor: 'black', borderStyle: 'solid', borderWidth: 2,
            backgroundColor: pressed ? '#DE9393' : '#EB1C2E',
          }

        ]}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>
          Insumos Agrupados
        </Text>
      </Pressable>
      {/* <Pressable onPress={() => navigation.navigate('ProdOrders')}
       
        style={({pressed}) => [
          {
            marginVertical:20,width:'90%', paddingHorizontal:35,paddingVertical:15,borderRadius:20, borderColor:'black',borderStyle:'solid',borderWidth:2,
            backgroundColor: pressed ? '#DE9393' : '#EB1C2E',
          }
          
      ]}
      >        
        <Text style={{textAlign:'center',color:'white', fontSize:20}}>
        Entregar Órdenes
        </Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginBottom: 10,
    width: '50%',
    resizeMode: 'contain'
  },
  input: {
    textAlign: 'center',
    width: '80%',
    borderRadius: 10,
    height: 50,
    marginHorizontal: 25,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
