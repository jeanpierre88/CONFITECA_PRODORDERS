import React, { useReducer } from "react";
import { LoginContext } from "./LoginContext";
import { LoginReducer } from "./LoginReducer";
import { LOGIN } from "./LoginReducer";
import axios from 'axios';



const LoginState = (props) => {
    const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
    const parser = new XMLParser();
    const builder = new XMLBuilder();
    const initialState = {
        stateLogin: false

    };

    const [state, dispatch] = useReducer(LoginReducer, initialState);

    const getLogin = async (user, password) => {
        let xmls = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
              <soapenv:Header/>\
              <soapenv:Body>\
                  <tem:cnftLoginAccess>\
                    <!--Optional:-->\
                    <tem:_company>conf</tem:_company>\
                    <!--Optional:-->\
                    <tem:_UserId>'+ user + '</tem:_UserId>\
                    <!--Optional:-->\
                    <tem:_Pass>'+ password + '</tem:_Pass>\
                  </tem:cnftLoginAccess>\
              </soapenv:Body>\
            </soapenv:Envelope>';

        axios.post('http://52.175.245.156:7082/Service1.svc?wsdl',
            xmls,
            {
                headers:
                {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'http://tempuri.org/IService1/cnftLoginAccess'
                }
            }).then(async res => {
                let jObj = parser.parse(res.data);
                const xmlContent = builder.build(jObj);
                if (jObj != undefined && jObj != '' && jObj != null) {
                    let resp = await convertObj(jObj);

                    console.log("respuesta Final:" + resp)
                    return resp;
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const closeSesion = async () => {
        dispatch(
            {
                type: LOGIN.GET_STATES,
                payload: { stateLogin: false, userLogin: '' },
            }
        );
    }


    const convertObj = async (obj) => {
        let myJSON = JSON.stringify(obj);
        myJSON = myJSON.replace(/s:/g, '');
        myJSON = myJSON.replace(/a:/g, '');
        let lastObj = JSON.parse(myJSON);

        let list = lastObj.Envelope.Body.cnftLoginAccessResponse.cnftLoginAccessResult.cnftWSUserContract;

        console.log('resp   ' + JSON.stringify(list));

        dispatch(
            {
                type: LOGIN.GET_STATES,
                payload: { stateLogin: list.ApprovedAccess, userLogin: list.UserId },
            }
        );

        return list.ApprovedAccess;
    }
    const setDates= async(date1,date2)=>{
        dispatch(
            {
                type: LOGIN.SET_DATES,
                payload: { txtDateDesde: date1, txtDateHasta: date2 },
            }
        );
    }


    return (
        <LoginContext.Provider
            value={{
                stateLogin: state.stateLogin,
                userLogin: state.userLogin,
                txtDateDesde:state.txtDateDesde,
                txtDateHasta:state.txtDateHasta,
                getLogin,
                closeSesion,
                setDates
            }}
        >
            {props.children}
        </LoginContext.Provider>
    );
};

export default LoginState;
