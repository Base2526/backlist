import React, { useEffect,useState,useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TouchableNativeFeedback,
    TextInput,
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    Alert
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-easy-toast'
import {connect} from "react-redux";
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
const axios = require('axios');

import { isEmpty } from './Utils'
import { API_URL } from "./constants"

const mapStateToProps = state => {
    return{
      user: state.user.data,
      tests: state.app.tests
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // same effect
//         firstAction : () => dispatch(action1()),
//         secondAction : bindActionCreators(action2, dispatch)
//     }
// };


const EditName = (props) => {
    const [showSpinner, setShowSpinner] = useState(false)
    const [displayName, setDisplayName] = useState(props.user.name);

    const [headerTitle, setHeaderTitle] = useState('Display name');
    // Rerender after headerTitle change
    useEffect(() => {
        props.navigation.setOptions({
            title: headerTitle,
        });

        let {user} = props

        console.log('user >>> > ', user)
    }, [headerTitle, props]);

    handleSave = () =>{
        console.log('displayName > ', displayName)

        const display_name = displayName.trim()
        if( isEmpty(display_name) ) {
            this.toast.show('DisplayName empty');
        }

        setShowSpinner(true)
        
        const data = new FormData();
        data.append('type', 1);
        data.append('display_name', display_name);
    
        axios.post(`${API_URL}/api/update_profile?_format=json`, data, 
        {
          headers: { 
            'Authorization': `Basic ${props.user.basic_auth}` ,
            'content-type': 'multipart/form-data'
          }
        })
        .then(function (response) {
            let results = response.data
            // console.log('update_profile> ', results)

            console.log('update_profile> results ', results)
            
            if(results.result){
                props.navigation.pop();
            }   

            setShowSpinner(false)
        })
        .catch(function (error) {
            console.log('update_profile error > ', error)
        //   _this.setState({spinner: false})
        //   _this.toast.show('ไม่สามารถเพิ่มรายงาน');
        //   console.log(error);

            setShowSpinner(false)
        });
    }
    
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <Text style={{fontSize:20, color:'gray', paddingTop:10}}>Display name</Text>
                <TextInput
                    style={{height: 40, borderWidth: .5, fontSize:18}}
                    ref= {(el) => { this.name = el; }}
                    onChangeText={(displayName) => setDisplayName(displayName)}
                    value={displayName}/>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleSave}>
                  <Text>Save</Text>
                </TouchableOpacity>

                <Spinner
                    visible={showSpinner}
                    textContent={'Wait...'}
                    textStyle={styles.spinnerTextStyle}/> 

                <Toast
                    ref={(toast) => this.toast = toast}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}/>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFF',
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    emailContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    headerBackgroundImage: {
      paddingBottom: 20,
      paddingTop: 45,
      backgroundColor:'gray'
    },
    headerContainer: {},
    headerColumn: {
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          alignItems: 'center',
          elevation: 1,
          marginTop: -1,
        },
        android: {
          alignItems: 'center',
        },
      }),
    },
    placeIcon: {
      color: 'white',
      fontSize: 26,
    },
    scroll: {
      backgroundColor: '#FFF',
    },
    telContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    userAddressRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    userCityRow: {
      backgroundColor: 'transparent',
      flexDirection:'row'
    },
    userCityText: {
      color: '#A5A5A5',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userImage: {
      borderColor: '#FFF',
      borderRadius: 85,
      borderWidth: 3,
      height: 170,
      // marginBottom: 15,
      width: 170,
    },
    userNameText: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        marginTop:10,
        padding: 10
    },
})

export default connect(mapStateToProps, null)(EditName)