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
import { LoginContext } from '../Context/LogginContext/LoginContext';


export default function Home({ navigation }) {
  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { stateLogin, userLogin, getLogin } = useContext(LoginContext);
  const [message, setMessage] = React.useState('');
  const [appearMessage, setAppearMessage] = React.useState(false);
  const [wait, setWait] = React.useState(false);



  useEffect(() => {
    setAppearMessage(false);
    setMessage('');
    if (stateLogin) {
      navigation.navigate('InitialPage');
    }
  }, [stateLogin]);

  const verifyCredentials = async () => {
    setWait(true);

    let resp = await getLogin(user, password);

    FinalResp(resp);



  }

  const FinalResp = (resp) => {
    console.log(stateLogin);

    if (stateLogin === true) {
      setWait(false);
      navigation.navigate('InitialPage');
    }
    else {
      setWait(false);
      setMessage('Las credenciales son incorrectas');
      setAppearMessage(true);
      setUser('');
      setPassword('');

    }
  }
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
      <Text style={{ color: 'red', fontSize: 20, marginBottom: 10 }} >Bienvenido</Text>
      <Image
        style={styles.logo}
        source={require('../assets/imgs/logo.png')}
      />
      <TextInput
        style={styles.input}
        onChangeText={(user) => onChangeText(user)}
        value={user}
        placeholder='Usuario'
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        onChangeText={(password) => onChangePassword(password)}
        value={password}
        placeholder='Contraseña'
      />



      <Pressable onPress={() => verifyCredentials()}

        style={({ pressed }) => [
          {
            marginTop: 10, paddingHorizontal: 35, paddingVertical: 15, borderRadius: 20, borderColor: 'black', borderStyle: 'solid', borderWidth: 2,
            backgroundColor: pressed ? '#DE9393' : '#EB1C2E',
          }

        ]}
      >

        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          Ingreso al sistema
        </Text>
      </Pressable>
      {
        wait
          ?
          <Text>Validando tus credenciales</Text>
          :
          appearMessage
            ?
            <Text style={{ fontSize: 20, color: 'red' }} >{message}</Text>
            :
            <>

            </>

      }

    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginBottom: 50
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
