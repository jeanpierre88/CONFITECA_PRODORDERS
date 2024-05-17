import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Modal
} from 'react-native';


export default function Lines({ route, navigation }) {
  const { op } = route.params;
  const { diario } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [text, setText] = React.useState('');
  const [listObjdataOPS, setListObjdataOPS] = useState([]);
  const [listObjdataOPSTemp, setListObjdataOPSTemp] = useState([]);
  const [objUpdate, setObjUpdate] = useState({
    BOMConsump: "",
    BOMProposal: "",
    InventLocationId: "",
    ItemId: "",
    ItemName: "",
    recId: ""
  });
  const [BOMConsump, setBOMConsump] = useState(0);
  const [BOMProposal, setBOMProposal] = useState(0);
  const [ItemId, setItemId] = useState("");
  const [ItemName, setItemName] = useState("");





  useEffect(() => {
    getLines();


  }, []);


  const getLines = () => {
    let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
              <soapenv:Header/>\
              <soapenv:Body>\
                <tem:cnftFindProdJournalBomBVS>\
                    <!--Optional:-->\
                    <tem:_company>CONF</tem:_company>\
                    <!--Optional:-->\
                    <tem:_prodId>'+ op + '</tem:_prodId>\
                    <!--Optional:-->\
                    <tem:_journalId>'+ diario + '</tem:_journalId>\
                </tem:cnftFindProdJournalBomBVS>\
              </soapenv:Body>\
            </soapenv:Envelope>';

    axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
      xmls,
      {
        headers:
        {
          'Content-Type': 'text/xml',
          SOAPAction: 'http://tempuri.org/IService1/cnftFindProdJournalBomBVS'
        }
      }).then(res => {
        let jObj = parser.parse(res.data);
        const xmlContent = builder.build(jObj);
        if (jObj != undefined && jObj != '' && jObj != null) {
          convertObj(jObj);
        }
      }).catch(err => {
        console.log(err)
      })
  }
  const convertObj = async (obj) => {
    let myJSON = JSON.stringify(obj);
    myJSON = myJSON.replace(/s:/g, '');
    myJSON = myJSON.replace(/a:/g, '');
    let lastObj = JSON.parse(myJSON);

    let list = lastObj.Envelope.Body.cnftFindProdJournalBomBVSResponse.cnftFindProdJournalBomBVSResult.cnftWSProdJournalBomContract;
    await setDataOPS(list);

    createObjs(list);
  }
  const createObjs = (list) => {
    var listFinal = [];

    if (Array.isArray(list)) {
      setListObjdataOPS(list);
      setListObjdataOPSTemp(list);
    }
    else {
      let obj = {
        BOMConsump: list.BOMConsump,
        BOMProposal: list.BOMProposal,
        InventLocationId: list.InventLocationId,
        ItemId: list.ItemId,
        ItemName: list.ItemName,
        recId: list.recId
      }
      listFinal.push(obj);
      setListObjdataOPS(listFinal);
      setListObjdataOPSTemp(listFinal);

    }
  }
  const onChangeText = (text) => {
    try {
      if (text != '') {
        setText(text);
        const newData = listObjdataOPS.filter((data) => data.ItemId.toLowerCase().includes(text.toLowerCase()));
        setListObjdataOPSTemp(newData);

      } else {
        setText('');
        setListObjdataOPSTemp(listObjdataOPS);
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }
  const openModalUpdate = async (item) => {
    await setObjUpdate(item);
    await setBOMProposal(item.BOMProposal);
    await setBOMConsump(item.BOMConsump);
    await setItemName(item.ItemName);
    await setItemId(item.ItemId);
    setModalVisible(true);
  }

  const updateConsume = async () => {
    setModalVisible(false);
    const company = 'CONF';
    console.log("company: " + company);
    console.log("prodId: " + op);
    console.log("jouranlId: " + diario);
    console.log("recid Prod: " + objUpdate.recId)
    console.log("Nueva Cantidad: " + BOMConsump);
    // UpdateProdJournalBom(company);
  }

  const UpdateProdJournalBom = (company) => {
    let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                <soapenv:Body>\
                  <tem:cnftUpdateProdJournalBomBVS>\
                      <!--Optional:-->\
                      <tem:_company>'+ company + '</tem:_company>\
                      <!--Optional:-->\
                      <tem:_prodId>'+ op + '</tem:_prodId>\
                      <!--Optional:-->\
                      <tem:_journalId>'+ diario + '</tem:_journalId>\
                      <!--Optional:-->\
                      <tem:_itemId>'+ objUpdate.recId + '</tem:_itemId>\
                      <!--Optional:-->\
                      <tem:_bomConsum>'+ BOMConsump + '</tem:_bomConsum>\
                  </tem:cnftUpdateProdJournalBomBVS>\
                </soapenv:Body>\
            </soapenv:Envelope>';

    axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
      xmls,
      {
        headers:
        {
          'Content-Type': 'text/xml',
          SOAPAction: 'http://tempuri.org/IService1/cnftUpdateProdJournalBomBVS'
        }
      }).then(res => {
        let jObj = parser.parse(res.data);
        const xmlContent = builder.build(jObj);
        if (jObj != undefined && jObj != '' && jObj != null) {
          console.log(jObj);
        }
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <View style={styles.container}>
      <AntDesign name="leftcircle" size={50} color="#923D3D" style={{ marginHorizontal: 20, width: 50 }}
        onPress={() => navigation.navigate('ListSelection', {
          op: op,
        })} />
      <Text style={styles.tit}>Líneas del diario</Text>
      <Text style={styles.tit1}>{diario}</Text>
      <Text style={styles.tit2}>{op}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText(text)}
        value={text}
        placeholder='Buscar Producto'
      />
      <View style={{ height: '75%' }}>
        <FlatList data={listObjdataOPSTemp} renderItem={({ item, index }) => {
          return (
            <Pressable style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#DE9393' : 'white'
              }, styles.contOPSelect
            ]}
              onPress={() => openModalUpdate(item)}
            >
              <View style={{ flexDirection: 'column', justifyContent: 'center', paddingVertical: 5 }}>
                <View style={{ paddingVertical: 10, borderBottomWidth: 2, width: '100%', marginBottom: 5, flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>PRODUCTO</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{item.ItemId}</Text>

                  <View style={{ flexDirection: 'row', paddingHorizontal: 2, paddingVertical: 5, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, paddingHorizontal: 15, color: '#923D3D' }}>{item.ItemName}</Text>
                  </View>
                </View>
                <View style={styles.contOpt}>
                  <View>
                    <Text style={styles.titOpts}>ALMACÉN</Text>
                    <Text style={styles.txt}>{item.InventLocationId}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5 }}>
                    <View style={styles.contOpt}>
                      <Text style={styles.titOpts}>CANTIDAD</Text>
                      <Text style={styles.txt}>{item.BOMConsump}</Text>
                    </View>
                    <View style={styles.contOpt}>
                      <Text style={styles.titOpts}>CONSUMO</Text>
                      <Text style={styles.txt}>{item.BOMProposal}</Text>
                    </View>
                  </View>

                </View>

              </View>
            </Pressable>)
        }} />

      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView} backgroundColor={"rgba(0,0,0,0.65)"}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Actualizar Consumo</Text>
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }} >PRODUCTO</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{ItemId}</Text>
              <Text style={{ textAlign: 'center', fontSize: 15, paddingHorizontal: 15, color: '#923D3D' }}>{ItemName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold', width: '50%' }} >Consumo estimado:</Text>
              <TextInput
                onChangeText={setBOMProposal}
                style={styles.input}
                value={BOMProposal.toString()}
                placeholder='Nueva cantidad'
                numeric   // This prop makes the input to get numeric only 
                keyboardType={'numeric'} // This prop help to open numeric keyboard
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold', width: '50%' }} >Consumo real:</Text>
              <TextInput
                onChangeText={setBOMConsump}
                style={styles.input}
                value={BOMConsump.toString()}
                placeholder='Nueva cantidad'
                numeric   // This prop makes the input to get numeric only 
                keyboardType={'numeric'} // This prop help to open numeric keyboard
              />
            </View>



            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => updateConsume()}>
                <Text style={styles.textStyle}>Actualizar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    height: 40,
    marginHorizontal: 25,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#DADADA',
    textAlign: 'center',
    justifyContent: 'center'
  },
  tit: {
    marginTop: 20,
    color: '#923D3D',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  tit1: {
    marginTop: 5,
    color: '#923D3D',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  tit2: {
    color: '#923D3D',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20
  },
  contOPSelect: {
    width: '90%',
    marginVertical: 5,
    height: 260,
    borderRadius: 10,
    marginHorizontal: '5%',
    borderColor: '#923D3D',
    borderStyle: 'solid',
    borderWidth: 2

  },
  titOpts: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  contOpt: {
    marginHorizontal: 25
  },
  txt: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 30,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#923D3D'
  },
  buttonOpen: {
    backgroundColor: '#923D3D',
  },
  buttonClose: {
    backgroundColor: '#923D3D',
  },
  textStyle: {

    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 25,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },

});
