import React, { useContext, useEffect, useState, useCallback } from "react";
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import {
  Button,
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import MaskInput, { Masks } from 'react-native-mask-input';
import { LoginContext } from "../Context/LogginContext/LoginContext";

export default function HomeScreenProdOrders({ navigation }) {
  const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
  const parser = new XMLParser();
  const builder = new XMLBuilder();
  const [dataOPS, setDataOPS] = useState([]);
  const [text, setText] = React.useState('');
  const [listObjdataOPS, setListObjdataOPS] = useState([]);
  const [listObjdataOPSTemp, setListObjdataOPSTemp] = useState([]);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  const [selectPending, setSelectPending] = useState(true);
  const [selectInProcess, setSelectInProcess] = useState(false);
  const [selectCompleted, setSelectCompleted] = useState(false);
  const [selectFinished, setSelectFinished] = useState(false);

  const [TXTselectPending, setSelectPendingTXT] = useState('Pending');
  const [TXTselectInProcess, setSelectInProcessTXT] = useState('');
  const [TXTselectCompleted, setSelectCompletedTXT] = useState('');
  const [TXTselectFinished, setSelectFinishedTXT] = useState('');

  const [strStates, setStrStates] = useState('<tem:_Pending>1</tem:_Pending>');


  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [fechaHasta, setFechaHasta] = useState(new Date());
  const [txtfechaDesde, settxtFechaDesde] = useState(("0" + (fechaDesde.getDay() + 1)).slice(-2) + '-' + ("0" + (fechaDesde.getMonth() + 1)).slice(-2) + '-' + fechaDesde.getFullYear());
  const [txtfechaHasta, settxtFechaHasta] = useState(("0" + (fechaDesde.getDay() + 1)).slice(-2) + '-' + ("0" + (fechaDesde.getMonth() + 1)).slice(-2) + '-' + fechaDesde.getFullYear());
  const { stateLogin, userLogin, getLogin, closeSesion } = useContext(LoginContext);





  const newSearch = () => {
    setModalVisible(false);
    selectPending ? setSelectPendingTXT('Pending') : setSelectPendingTXT('no');
    selectInProcess ? setSelectInProcessTXT('InProcess') : setSelectInProcessTXT('no');
    selectCompleted ? setSelectCompletedTXT('Completed') : setSelectCompletedTXT('no');
    selectFinished ? setSelectFinishedTXT('Finished') : setSelectFinishedTXT('no');

    var Newstr = '';

    if (selectPending) {
      Newstr = Newstr + '<tem:_Pending>1</tem:_Pending>';
    } else {
      Newstr = Newstr + '<tem:_Pending>0</tem:_Pending>';
    }


    if (selectInProcess) {
      Newstr = Newstr + '<tem:_InProcess>1</tem:_InProcess>';
    } else {
      Newstr = Newstr + '<tem:_InProcess>0</tem:_InProcess>';
    }

    if (selectCompleted) {
      Newstr = Newstr + '<tem:_Completed>1</tem:_Completed>';
    } else {
      Newstr = Newstr + '<tem:_Completed>0</tem:_Completed>';
    }

    if (selectFinished) {
      Newstr = Newstr + '<tem:_Finished>1</tem:_Finished>';
    } else {
      Newstr = Newstr + '<tem:_Finished>0</tem:_Finished>';
    }
    getProdOrders(Newstr, txtfechaDesde, txtfechaHasta);
  }





  const showMode = currentMode => {
    console.log("prueba2");
    setShow(true);
    setMode(currentMode);
  };
  const showDatePicker = () => {
    console.log("prueba");
    showMode('date');
  };
  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log("CurrentDate " + currentDate);
    await setDate(currentDate);
    await console.log("date " + date);
    setShow(false);
    setBirthday(formatDate(date));
    console.log("cumple  " + birthday);
  }
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    var localFechaDesde = ("0" + (fechaDesde.getDay() + 1)).slice(-2) + '-' + ("0" + (fechaDesde.getMonth() + 1)).slice(-2) + '-' + fechaDesde.getFullYear();
    var localFechaHasta = ("0" + (fechaDesde.getDay() + 1)).slice(-2) + '-' + ("0" + (fechaDesde.getMonth() + 1)).slice(-2) + '-' + fechaDesde.getFullYear();
    getProdOrders(strStates, localFechaDesde, localFechaHasta);


  }, []);


  const getProdOrders = (strStatesLocal, fechaDesde, fechaHasta) => {   
    let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
              <soapenv:Header/>\
              <soapenv:Body>\
                  <tem:cnftFindProdTableBVS>\
                    <!--Optional:-->\
                    <tem:_company>conf</tem:_company>\
                    <!--Optional:-->\
                    <tem:_fromDate>'+ fechaDesde + '</tem:_fromDate>\
                    <!--Optional:-->\
                    <tem:_toDate>'+ fechaHasta + '</tem:_toDate>\
                    <!--Optional:-->\
                    <tem:_location></tem:_location>'+ strStatesLocal + '\
                    <!--Optional:-->\
                  </tem:cnftFindProdTableBVS>\
              </soapenv:Body>\
            </soapenv:Envelope>';



    axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
      xmls,
      {
        headers:
        {
          'Content-Type': 'text/xml',
          SOAPAction: 'http://tempuri.org/IService1/cnftFindProdTableBVS'
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

    let list = [];

    if (lastObj.Envelope.Body.cnftFindProdTableBVSResponse.cnftFindProdTableBVSResult.cnftWSProdTableContract.length == undefined) {
      list.push(lastObj.Envelope.Body.cnftFindProdTableBVSResponse.cnftFindProdTableBVSResult.cnftWSProdTableContract);
    }
    else {
      list = lastObj.Envelope.Body.cnftFindProdTableBVSResponse.cnftFindProdTableBVSResult.cnftWSProdTableContract;
    }
    await setDataOPS(list);

    createObjs(list);
  }

  const createObjs = (list) => {
    // var listFinal=[];
    if (list.length > 0) {
      setListObjdataOPSTemp(list);
      setListObjdataOPS(list);
      // list.forEach(element=>{
      //   var arr=element.split(';');
      //   let obj={
      //     op:arr[0],
      //     item:arr[1],
      //     cantidad:arr[2],
      //     val:arr[3]
      //   }
      //   listFinal.push(obj);


    };
    //   console.log(listFinal[60]);
    //   setListObjdataOPS(listFinal);  
  }
  const onChangeText = (text) => {
    try {
      if (text != '') {
        setText(text);
        const newData = listObjdataOPS.filter((data) => data.ProdId.toLowerCase().includes(text.toLowerCase()));
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

  const onChangeTextFechaDesde = (text) => {
    var newText = text;
    try {
      newText = text.split("/").join("-");
      if (newText != '') {
        settxtFechaDesde(newText);
      } else {
        settxtFechaDesde('');
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }
  const onChangeTextFechaHasta = (text) => {
    var newText = text;
    try {
      newText = text.split("/").join("-");
      if (newText != '') {
        settxtFechaHasta(newText);
      } else {
        settxtFechaHasta('');
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }

  const renderItem = useCallback(({ item, index }) => (
    <Pressable key={index} style={({ pressed }) => [
      {
        backgroundColor: pressed ? '#DE9393' :
          item.cnftProdStatus == "Finished" ? '#D6EAFA'
            : item.cnftProdStatus == "InProcess" ? '#FDFF62'
              : item.cnftProdStatus == "Completed" ? '#99FF45'
                : item.cnftProdStatus == "Pending" ? '#FE8B79'
                  : '#DADADA'
      }, styles.contOPSelect
    ]}
      onPress={() => navigation.navigate('ListSelection', {
        op: item.ProdId,
      })} ProdId
    >
      <View style={{ flexDirection: 'column', justifyContent: 'center', paddingVertical: 10 }}>
        <View style={{ paddingVertical: 5 }}>
          <Text style={styles.titOpts}>PRODUCTO</Text>
          <Text style={styles.txtTitleProd}>{item.ProdName}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 5, borderTopWidth: 1 }}>
          <View style={{ width: '40%', marginHorizontal: 5, marginTop: 5, alignContent: 'flex-start' }}>
            <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>OP</Text>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{item.ProdId}</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>ESTADO</Text>
            {
              item.cnftProdStatus == "Finished" ? <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Finalizado</Text>
                : item.cnftProdStatus == "InProcess" ? <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}> En Proceso</Text>
                  : item.cnftProdStatus == "Completed" ? <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Completado</Text>
                    : item.cnftProdStatus == "Pending" ? <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Pendiente</Text> : <></>
            }

          </View>
          <View style={styles.contOpt}>
            <View>
              <Text style={styles.titOpts}>ID</Text>
              <Text style={styles.txt}>{item.ItemId}</Text>
            </View>
            <View style={styles.contOpt}>
              <Text style={styles.titOpts}>CANTIDAD</Text>
              <Text style={styles.txt}>{item.QtySched}</Text>
            </View>
          </View>
        </View>

      </View>
    </Pressable>

  ), []);

  const finishSesion = () => {
    closeSesion();
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View flexDirection='row'>
        <View style={{ width: '50%' }}>
          <AntDesign name="leftcircle" size={50} color="#923D3D" style={{ marginHorizontal: 20, width: 50 }}
            onPress={() => navigation.navigate('InitialPage')} />
        </View>
        <Pressable onPress={() => finishSesion()} style={{ padding: 20, alignItems: 'flex-end', width: '50%' }}>
          <Text style={{ textAlign: 'right', color: 'gray', fontWeight: 'bold', fontSize: 15 }} >CERRAR SESION</Text>
        </Pressable>
      </View>



      <Text style={styles.tit}>Órdenes de producción</Text>

      <View flexDirection='row' style={{ justifyContent: 'center', width: '100%' }}>
        <View style={styles.TextDate} >
          <Text style={styles.TextSmall} >Fecha desde:</Text>
          <MaskInput
            style={{ textAlign: 'center' }}
            keyboardType='numeric'
            value={txtfechaDesde}
            onChangeText={(txtfechaDesde) => onChangeTextFechaDesde(txtfechaDesde)}
            mask={Masks.DATE_DDMMYYYY}
          />
        </View>
        <View style={styles.TextDate} onPress={() => setOpen(true)}>
          <Text style={styles.TextSmall}>Fecha hasta:</Text>
          <MaskInput
            style={{ textAlign: 'center' }}
            keyboardType='numeric'
            value={txtfechaHasta}
            onChangeText={(txtfechaHasta) => onChangeTextFechaHasta(txtfechaHasta)}
            mask={Masks.DATE_DDMMYYYY}
          />
        </View>
      </View>


      <View flexDirection='row' style={{ justifyContent: 'center', width: '100%' }}>
        <View style={{ width: '45%' }}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(text)}
            value={text}
            placeholder='Buscar OP'
          />
        </View>

        <View style={{ width: '45%', marginHorizontal: 5 }}>
          <Pressable onPress={() => setModalVisible(true)}>
            <View style={{ borderColor: '#923D3D', borderWidth: 1, borderRadius: 10, height: 40, justifyContent: 'center', textAlign: 'center' }}>
              <Text style={{ textAlign: 'center' }}>Seleccionar Estados</Text>
            </View>
          </Pressable>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Selecciona los estados</Text>
              <View flexDirection='row' style={{ marginBottom: 5 }}>
                <CheckBox value={selectPending} onValueChange={setSelectPending} style={styles.checkbox} />
                <Text style={{ margin: 8, width: '50%' }}>Pendiente</Text>
              </View>
              <View flexDirection='row' style={{ marginBottom: 5 }}>
                <CheckBox value={selectInProcess} onValueChange={setSelectInProcess} style={styles.checkbox} />
                <Text style={{ margin: 8, width: '50%' }}>En Proceso</Text>
              </View>
              <View flexDirection='row' style={{ marginBottom: 5 }}>
                <CheckBox value={selectCompleted} onValueChange={setSelectCompleted} style={styles.checkbox} />
                <Text style={{ margin: 8, width: '50%' }}>Completado</Text>
              </View>
              <View flexDirection='row' style={{ marginBottom: 5 }}>
                <CheckBox value={selectFinished} onValueChange={setSelectFinished} style={styles.checkbox} />
                <Text style={{ margin: 8, width: '50%' }}>Finalizado</Text>
              </View>


              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => newSearch()}>
                <Text style={styles.textStyle}>Buscar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


        {/* <Picker >           
            <Picker.Item style={{color:'gray'}} label="Estado" enabled={false} value="O"/>                    
            <Picker.Item style={{color:'black'}}label="Pendiente" value="Pending" />
            <Picker.Item style={{color:'black'}} label="En Proceso" value="InProcess" />
            <Picker.Item style={{color:'black'}} label="Completado" value="Completed" />

            <Picker.Item style={{color:'black'}} label="Finalizado" value="Finished" />
            
          </Picker> */}

      </View>

      {/* <DatePicker      
        locale="es"
        mode="date"
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />    */}
      <View style={{ height: '80%' }}>
        <FlatList data={listObjdataOPSTemp} renderItem={renderItem} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#923D3D',
    marginHorizontal: 0,
    width: '100%',
    borderRadius: 10,
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
  },
  TextSmall: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 'bold'

  },
  TextDate: {
    borderColor: '#923D3D', marginHorizontal: 5,
    width: '45%',
    borderRadius: 10,
    height: 60,
    marginBottom: 15,
    borderWidth: 1,
    padding: 1,
  },
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#C4C4C4',
    textAlign: 'center',
    justifyContent: 'center'
  },
  tit: {
    color: '#923D3D',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 20
  },
  contOPSelect: {
    width: '90%',
    marginVertical: 5,
    height: 230,

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
    marginHorizontal: 2
  },
  txt: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  txtTitleProd: {
    marginHorizontal: 5,
    color: '#923D3D',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  checkbox: {

  },
  centeredView: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
    marginTop: 20,
    width: '40%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

});
