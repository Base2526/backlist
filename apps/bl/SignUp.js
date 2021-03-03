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
  Image,
  Keyboard
} from 'react-native';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import {API_URL, API_TOKEN} from "@env"

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'

import { ValidateEmail, isEmpty } from './Utils'

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {name:'', 
                  email:'', 
                  password:'', 
                  confirm_password:''};
  }

  componentDidMount() {
  }

  handleSignUp= () =>{
    console.log('handleSignUp')
     // Hide that keyboard!
    Keyboard.dismiss()

    let {name, email, password, confirm_password} = this.state
    name      = name.trim();
    email     = email.trim();
    password  = password.trim();
    confirm_password = confirm_password.trim();

    if( isEmpty(name) && isEmpty(email) && isEmpty(password) && isEmpty(confirm_password) ){
      this.toast.show('Name && Email && Password && Confirm password empty');
    }else if( isEmpty(name) ){
      this.toast.show('Name empty');
    }else if( isEmpty(email) ){
      this.toast.show('Email empty');
    }else if( isEmpty(password) && isEmpty(confirm_password) ){
      this.toast.show('Password && Confirm password empty');
    }else if( isEmpty(password) ){
      this.toast.show('Password empty');
    }else if( isEmpty(confirm_password) ){
      this.toast.show('Confirm password empty');
    }else if(password != confirm_password){
      this.toast.show('Password && Confirm password not match');
    }else if(!ValidateEmail(email)){
      this.toast.show('Email Field is Invalid');
    }else{
      this.setState({spinner: true});

      let _this =this

      
      axios.post(`${API_URL}/api/register?_format=json`, {
        type: 0,
        name,
        email,
        password
      }/*, {
        headers: { 
          'Authorization': `Basic ${API_TOKEN}` 
        }
      }*/
      )
      .then(function (response) {
        let results = response.data
        console.log(results)
        if(results.result){
          // true
          console.log('true');
          console.log(results);
  
          _this.toast.show('Check email.');

          _this.props.navigation.pop();   
          _this.setState({spinner: false})
        }else{

          _this.toast.show(results.message, 500);

          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {

        console.log(error)
        _this.setState({spinner: false})
      });
    }
  }

  render(){
    return (
            <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <Text>Name</Text>
              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.name = el; }}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}/>
              <Text>Email</Text>

              <TextInput
                style={{height: 40,
                        borderWidth: .5,}}
                ref= {(el) => { this.email = el; }}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}/>
              <Text>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.password = el; }}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}/>

              <Text>Confirm Password</Text>
              <TextInput
                secureTextEntry={true}
                style={{height: 40, 
                        borderWidth: .5,}}
                ref= {(el) => { this.confirm_password = el; }}
                onChangeText={(confirm_password) => this.setState({confirm_password})}
                value={this.state.confirm_password}/>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSignUp}>
                <Text>Sign Up</Text>
              </TouchableOpacity>

              <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}/> 
              <Toast
                ref={(toast) => this.toast = toast}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}/>
            </View>
            </SafeAreaView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10
  },
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
  engine: {
    position: 'absolute',
    right: 0,
  },
//   body: {
//     backgroundColor: Colors.white,
//   },
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
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginTop:10,
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
  }
});

export default SignUp;
