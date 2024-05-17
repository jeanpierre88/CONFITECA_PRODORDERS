import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  TextInput
} from 'react-native';


export default function SelectionList({ route, navigation }) {
  const { op } = route.params;

  const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [text, setText] = React.useState('');
  const [listObjdataOPS, setListObjdataOPS] = useState([]);
  const [listObjdataOPSTemp, setListObjdataOPSTemp] = useState([]);


  useEffect(() => {
    getJournals();  
 }, []);


 const getJournals=()=>{
  let xmls='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
              <soapenv:Header/>\
              <soapenv:Body>\
                <tem:cnftFindProdJournalTableBVS>\
                    <!--Optional:-->\
                    <tem:_company>CONF</tem:_company>\
                    <!--Optional:-->\
                    <tem:_prodId>'+op+'</tem:_prodId>\
                </tem:cnftFindProdJournalTableBVS>\
              </soapenv:Body>\
            </soapenv:Envelope>';

        axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
           xmls,
            {headers:
            {
              'Content-Type': 'text/xml',
              SOAPAction: 'http://tempuri.org/IService1/cnftFindProdJournalTableBVS'}
            }).then(res => {    
              let jObj = parser.parse(res.data);
              const xmlContent = builder.build(jObj);    
              if(jObj!=undefined && jObj!='' && jObj!=null)
              {
                convertObj(jObj);
              }
            }).catch(err => {
              console.log(err)
            })
  }
  const convertObj= async (obj) =>
  {
    let myJSON = JSON.stringify(obj);
    myJSON=myJSON.replace(/s:/g,'');
    myJSON=myJSON.replace(/a:/g,'');
    let lastObj=JSON.parse(myJSON);
    
    let list=lastObj.Envelope.Body.cnftFindProdJournalTableBVSResponse.cnftFindProdJournalTableBVSResult.cnftWSProdJournalContract;
    await setDataOPS(list);

    createObjs(list);
  }

  const createObjs=(list)=>{
    var listFinal=[];

    if(Array.isArray(list))
    {
      setListObjdataOPS(list);
      setListObjdataOPSTemp(list);
    }
    else{      
      let obj={
            Description:list.Description,
            JournalId:list.JournalId,
            JournalNameId:list.JournalNameId, 
            Posted:list.Posted
          }
      listFinal.push(obj);
      setListObjdataOPS(listFinal);
      setListObjdataOPSTemp(listFinal);

    }
  }
  const onChangeText=(text)=>{
    try {      
      if(text!='')
      {
        setText(text);        
        const newData=  listObjdataOPS.filter((data) =>data.JournalId.toLowerCase().includes(text.toLowerCase()));
        setListObjdataOPSTemp(newData);
        
      }else{
        setText('');
        setListObjdataOPSTemp(listObjdataOPS);
      }     
   } catch (error) {
     console.error(error);
   } finally {
     
   }
  }

 

  return (
    <View style={styles.container}>
      <AntDesign name="leftcircle" size={50} color="#923D3D" style={{ marginHorizontal: 20, width: 50 }}
        onPress={() => navigation.navigate('ProdOrders')} />
      <Text style={styles.tit}>Diarios  {op}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text)=>onChangeText(text)}
        value={text}
        placeholder='Buscar DIARIO'
      />
      <View style={{height:'80%'}}>
        <FlatList
        initialNumToRender={20} 
          data={listObjdataOPSTemp} 
          renderItem={({item, index}) => {
          return (
          <Pressable style={({pressed}) => [
            {
              backgroundColor: pressed ? '#DE9393' : 'white'
            },styles.contOPSelect
            ]}
            onPress={() => navigation.navigate('Lines', {
              op: op,
              diario: item.JournalId
            })}
            >
            <View style={{flexDirection:'column',justifyContent:'center',paddingVertical:5}}>
              <View style={{width:'50%',marginHorizontal:5,borderBottomWidth:2,width:'95%',marginBottom:5}}>
                <Text style={{textAlign:'center', fontSize:15,fontWeight:'bold'}}>DIARIO</Text>
                <Text style={{ textAlign:'center',fontSize:20,fontWeight:'bold'}}>{item.JournalId}</Text>
              </View>
              <View style={styles.contOpt}>
                <View>
                  <Text style={styles.titOpts}>DESCRIPCIÓN</Text>
                  <Text style={styles.txt}>{item.Description}</Text>
                </View> 
                <View style={{flexDirection:'row',justifyContent:'center',paddingVertical:5}}>
                  <View style={styles.contOpt}>
                    <Text style={styles.titOpts}>TIPO</Text>
                    <Text style={styles.txt}>{item.JournalNameId}</Text>
                  </View>
                  <View style={styles.contOpt}>
                    <Text style={styles.titOpts}>REGISTRADO</Text>
                    <Text style={styles.txt}>{item.Posted}</Text>
                  </View>                
                </View>                               
                
              </View>
              
            </View>           
          </Pressable>)
        }}/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius:10,
    height: 40,
    marginHorizontal:25,
    marginBottom:15,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    paddingTop:40,
    flex: 1,
    backgroundColor: '#DADADA',
    textAlign:'center',
    justifyContent:'center'
  },
  tit:{
    color:'#923D3D',
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold',
    marginVertical:20
  },
  contOPSelect:{
    width:'90%',
    marginVertical:5,
    height:200,    
    borderRadius:10,
    marginHorizontal:'5%',
    borderColor:'#923D3D',
    borderStyle:'solid',
    borderWidth:2

  },
  titOpts:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:14,
    color:'black',
  },
  contOpt:{
    marginHorizontal:25
  },
  txt:{
    color:'black',
    fontSize:16,
    textAlign:'center',
  }

});
