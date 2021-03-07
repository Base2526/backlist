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
 
 class LoginScreen extends Component {
   constructor(props) {
     super(props);
     this.state = {name:'', 
                   email:'', 
                   password:'', 
                   confirm_password:''};
   }
 
   componentDidMount() {
   }

  
   handleForgotPassword= () =>{
    const { navigation } = this.props;
    navigation.navigate('forgot_password');
  }

  handleSignUp= () =>{
    const { navigation } = this.props;
    navigation.navigate('sign_up');
  }
 
   render(){
     return (
             <SafeAreaView style={{flex: 1}}>
             <View style={styles.container}>
                <Text>Email</Text>
                <TextInput
                  style={{height: 40,
                          borderWidth: .5,}}
                  ref= {(el) => { this.name = el; }}
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}/>
                <Text>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={{height: 40, 
                          borderWidth: .5,}}
                  ref= {(el) => { this.password = el; }}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}/>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleLogin}>
                  <Text>Login</Text>
                </TouchableOpacity>

                <View style={{ flexDirection:"row",}}>
                  <TouchableOpacity
                    style={{margin:5}}
                    onPress={this.handleForgotPassword}>
                    <Text>Forgot Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{margin:5}}
                    onPress={this.handleSignUp}>
                    <Text>Sign up</Text>
                  </TouchableOpacity>
                </View>
 
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
     paddingHorizontal: 10,
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
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
   footer: {
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
 
 export default LoginScreen;
 