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
  TextInput,
  Modal
} from 'react-native';
import { LoginContext } from "../Context/LogginContext/LoginContext";


export default function POLsByItem({ route, navigation }) {
  const { item, nombre, fechaDesde, fechaHasta } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [text, setText] = React.useState('');
  const [listObjdataOPS, setListObjdataOPS] = useState([]);
  const [listObjdataOPSTemp, setListObjdataOPSTemp] = useState([]);
  const { txtDateDesde, txtDateHasta, setDates, closeSesion } = useContext(LoginContext);
  const [BOMConsump, setBOMConsump] = useState(0);
  const [BOMProposal, setBOMProposal] = useState(0);
  const [ItemId, setItemId] = useState("");
  const [ItemName, setItemName] = useState("");

  const [objUpdate, setObjUpdate] = useState({
    BOMConsump: "",
    BOMProposal: "",
    InventLocationId: "",
    ItemId: "",
    ItemName: "",
    recId: ""
  });



  useEffect(() => {
    console.log("FECHAS:  " + txtDateDesde + "   " + txtDateHasta)
    getJournals();
  }, [route.params.fechaDesde, route.params.fechaHasta]);


  const getJournals = () => {
    let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                  <soapenv:Header/>\
                  <soapenv:Body>\
                    <tem:cnftFindProdItemBVS>\
                      <!--Optional:-->\
                      <tem:_itemId>'+ item + '</tem:_itemId>\
                      <!--Optional:-->\
                      <tem:_company>conf</tem:_company>\
                      <!--Optional:-->\
                      <tem:_fromDate>'+ txtDateDesde + '</tem:_fromDate>\
                      <!--Optional:-->\
                      <tem:_toDate>'+ txtDateHasta + '</tem:_toDate>\
                      <!--Optional:-->\
                      <tem:_location></tem:_location>\
                      <!--Optional:-->\
                      <tem:_Pending>0</tem:_Pending>\
                      <!--Optional:-->\
                      <tem:_InProcess>1</tem:_InProcess>\
                      <!--Optional:-->\
                      <tem:_Completed>0</tem:_Completed>\
                      <!--Optional:-->\
                      <tem:_Finished>0</tem:_Finished>\
                    </tem:cnftFindProdItemBVS>\
                  </soapenv:Body>\
                </soapenv:Envelope>';

    console.log(xmls);

    axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
      xmls,
      {
        headers:
        {
          'Content-Type': 'text/xml',
          SOAPAction: 'http://tempuri.org/IService1/cnftFindProdItemBVS'
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
    console.log(lastObj);

    let list = [];


    if (lastObj.Envelope.Body.cnftFindProdItemBVSResponse.length == undefined) {
      list.push(lastObj.Envelope.Body.cnftFindProdItemBVSResponse.cnftFindProdItemBVSResult.cnftWSProdItemContract);
    }
    else {
      list = lastObj.Envelope.Body.cnftFindProdItemBVSResponse.cnftFindProdItemBVSResult.cnftWSProdItemContract;
    }



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
        Description: list.Description,
        JournalId: list.JournalId,
        JournalNameId: list.JournalNameId,
        Posted: list.Posted
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
        const newData = listObjdataOPS.filter((data) => data.JournalId.toLowerCase().includes(text.toLowerCase()));
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
  const UpdateProdJournalBom = (company, op, diario, recId, BOMConsump) => {
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
                      <tem:_itemId>'+ recId + '</tem:_itemId>\
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
  const openModalUpdate = async (item) => {
    // await setObjUpdate(item);
    await setBOMProposal(item.QtySched);
    // await setBOMConsump(item.BOMConsump);
    // await setItemName(item.ItemName);
    // await setItemId(item.ItemId);
    setModalVisible(true);
  }
  const updateConsume = async () => {
    setModalVisible(false);
    const company = 'CONF';
    console.log("company: " + company);
    // console.log("prodId: " + op);
    // console.log("jouranlId: " + diario);
    // console.log("recid Prod: " + objUpdate.recId)
    // console.log("Nueva Cantidad: " + BOMConsump);
    // UpdateProdJournalBom(company);
  }




  return (
    <View style={styles.container}>
      <View flexDirection='row'>
        <View style={{ width: '50%' }}>
          <AntDesign name="leftcircle" size={50} color="#923D3D" style={{ marginHorizontal: 20, width: 50 }}
            onPress={() => navigation.navigate('Insumos')} />
        </View>
        <Pressable onPress={() => finishSesion()} style={{ padding: 20, alignItems: 'flex-end', width: '50%' }}>
          <Text style={{ textAlign: 'right', color: 'gray', fontWeight: 'bold', fontSize: 15 }} >CERRAR SESION</Text>
        </Pressable>
      </View>
      <Text style={styles.tit}>Órdenes por producto</Text>
      <Text style={styles.tit}>{nombre}</Text>
      <Text style={styles.tit}>Producto: {item}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText(text)}
        value={text}
        placeholder='Buscar POL'
      />
      <View style={{ height: '80%' }}>
        <FlatList
          initialNumToRender={20}
          data={listObjdataOPSTemp}
          renderItem={({ item, index }) => {
            return (
              <Pressable style={({ pressed }) => [
                {
                  backgroundColor: pressed ? '#DE9393' : 'white'
                }, styles.contOPSelect
              ]}
                onPress={() => openModalUpdate(item)}

              >
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingVertical: 5 }}>
                  <View style={{ width: '50%', marginHorizontal: 5, borderBottomWidth: 2, width: '95%', marginBottom: 5 }}>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>POL</Text>
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{item?.ProdId}</Text>
                  </View>
                  <View style={styles.contOpt}>
                    <View>
                      <Text style={styles.titOpts}>DIARIO</Text>
                      <Text style={styles.txt}>{item.JournalId}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5 }}>
                      <View style={styles.contOpt}>
                        <Text style={styles.titOpts}>Cantidad</Text>
                        <Text style={styles.txt}>{item.QtySched}</Text>
                      </View>
                      <View style={styles.contOpt}>
                        <Text style={styles.titOpts}>Paradas</Text>
                        <Text style={styles.txt}>{item.Paradas}</Text>
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
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{item}</Text>
              <Text style={{ textAlign: 'center', fontSize: 15, paddingHorizontal: 15, color: '#923D3D' }}>{nombre}</Text>
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
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#DADADA',
    textAlign: 'center',
    justifyContent: 'center'
  },
  tit: {
    color: '#923D3D',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 0
  },
  contOPSelect: {
    width: '90%',
    marginVertical: 5,
    height: 200,
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
