/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {Component} from 'react';
import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   View,
   Text,
   StatusBar,
   TouchableOpacity,
   TextInput,
   ActivityIndicator,
   FlatList,
   Image 
} from 'react-native';

import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'

import {toTimestamp, isEmpty} from './Utils'
 
import {API_URL, API_TOKEN} from "./constants"

const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };

class ReportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {  message:'', 
                        spinner: false,
                        chioces:[
                            { id: 1, value: true, name: "แจ้งลบ", selected: false },
                            { id: 2, value: false, name: "ข้อมูลไม่ครบถ้วน", selected: false },
                            { id: 3, value: false, name: "อื่นๆ", selected: false }
                          ]}
    }
    
    componentDidMount() {
        const { route, navigation } = this.props;
        if (route.params.data){
            console.log(route.params.data)
        }

        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity 
                    style={{  }}
                    onPress={()=>{
                        this.onPost()
                    }}>
                    <Text style={{ fontSize: 18, paddingRight:10, color:'#0288D1'}}>Done</Text>
                </TouchableOpacity>
                </View>
            )
        })
    }

    onPost=()=>{
        let _this = this
        let { message, chioces } = this.state
        let { navigation, user } = this.props;

        const chioce = chioces.filter(obj => obj.selected );

        message = message.trim()
        if( isEmpty(chioce) && isEmpty(message) ){
            this.toast.show('กรุณาเลือก หรือ กรอกข้อความ.');
            return;
        }else  if(isEmpty(chioce)){
            this.toast.show('กรุณาเลือก.');
            return;
        }else if(isEmpty(message)){
            this.toast.show('กรุณากรอกข้อความ.');
            return;
        }

        let basic_auth = API_TOKEN;
        if(!isEmpty(user)){
            basic_auth = user.basic_auth
        }
    
        _this.setState({spinner: true})
        axios.post(`${API_URL}/api/report?_format=json`, {
            chioce: JSON.stringify(chioce),
            message,
          }, {
            headers: { 
              'Authorization': `Basic ${basic_auth}` 
            }
        })
        .then(function (response) {
            let results = response.data
            // console.log(results)
            if(results.result){
                // true
                // console.log('true');
                // console.log(results);
                _this.toast.show('แจ้งเรียบร้อย');   
                navigation.pop();
            }else{
                // false
                // console.log('false');
                _this.toast.show('ไม่สามารถแจ้ง');
            }
            _this.setState({spinner: false})
        })
        .catch(function (error) {
            _this.setState({spinner: false})
            if (error.response) {
                _this.toast.show(error.response.data.message);
            }
            console.log('Error >  ' + error);
        });
    }
    
    handleSearch= () => {
        console.log(this.state.name);
        console.log(this.state.surname);
        console.log(this.state.bank_account);
    }

    onRadioBtnClick = (item) => {
        let {chioces} = this.state
        chioces =  chioces.map((isLikedItem)=>
            isLikedItem.id === item.id
            ? { ...isLikedItem, selected: true }
            : { ...isLikedItem, selected: false }
        )
        this.setState({chioces})
    }
 
    render(){
        let {message, chioces} = this.state
        return (
                <View style={styles.container}>
                    <Spinner visible={this.state.spinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle}/>  
                    <Toast
                        ref={(toast) => this.toast = toast}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}/>
                    
                    <Text style={{fontWeight:'bold', fontSize:18, padding:5, marginLeft:10}}>เลือก</Text>
                    <View style={{margin:10, padding:5}}>
                        
                        <View>
                        {
                        chioces.map((item) => (
                            <RadioButton
                                onPress={() => this.onRadioBtnClick(item)}
                                selected={item.selected}
                                key={item.id}
                            >
                                {item.name}
                            </RadioButton>
                        ))
                        }
                        </View>
                    </View>

                    <Text style={{fontWeight:'bold', fontSize:18, padding:5, marginLeft:10}}>รายละเอียด</Text>
                    <View style={{borderColor:'gray', borderWidth:.3, margin:10, padding:5}}>
                        <TextInput
                            style={styles.postInput}
                            onChangeText={text=> {
                                    this.setState({message: text});
                                }
                            }
                            multiline={true}
                            numberOfLines={3}
                            placeholder="ข้อความ"
                            value={message}
                            underlineColorAndroid='transparent'
                            require={true}
                            textAlignVertical='top'
                            />
                    </View>
                </View>)
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // paddingHorizontal: 10
        backgroundColor:'#fff'
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        // color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        // color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        // color: Colors.dark,
        // fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
    listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5
    },
    postInput: {
        fontSize: 18,
        borderColor:'gray',
        // borderWidth:.5,
        margin:5,
        // height: 150, 
        minHeight: '20%',
        // fontFamily: "Outrun future"
    },
    spinnerTextStyle: {
        color: '#FFF'
      },


      app: {
        marginHorizontal: "auto",
        maxWidth: 500
      },
      header: {
        padding: 20
      },
      title: {
        fontWeight: "bold",
        // fontSize: "1.5rem",
        marginVertical: "1em",
        textAlign: "center"
      },
      radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5
      },
      radioButton: {
        height: 20,
        width: 20,
        backgroundColor: "gray",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6",
        alignItems: "center",
        justifyContent: "center"
      },
      radioButtonIcon: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: "#98CFB6"
      },
      radioButtonText: {
        fontSize: 16,
        marginLeft: 16
      },
      text: {
        lineHeight: 30,
        fontSize: 20,
        marginVertical: 5
      }
});

const mapStateToProps = state => {
    return{
      user: state.user.data
    }
}
  
export default connect(mapStateToProps, null)(ReportScreen)
 