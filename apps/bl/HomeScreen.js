/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useEffect} from 'react';
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
  // Image
} from 'react-native';

// import { Image } from 'react-native-elements';

import Modal from 'react-native-modal';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import ActionButton from 'react-native-action-button';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'
import Toast, {DURATION} from 'react-native-easy-toast'

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

import Share from 'react-native-share';

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID} from "@env"

import { NumberFormat } from './Utils'

class HomeScreen extends Component {
  constructor(props) {
      super(props);

      // useEffect(() => this.getData(), []);

      this.state = {
                  data:[],
                  loading: false,
                  nid_last: 0,

                  selected: false,



                  chatMessage: "",
                  chatMessages: []
                  };
  }

  componentDidMount() {
    // useEffect(() => this.getData(), []);

    const { route, navigation } = this.props;

    let _this = this
    let _menu = null;
    navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => console.log('Button is Pressed!') }>
            <Text style={{ fontSize: 20, paddingLeft:10}}>Home</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity 
                style={{  }}
                onPress={()=>{
                  navigation.navigate('search')
                }}>
                <Ionicons name="search-outline" size={25} color={'grey'} />
              </TouchableOpacity>
              <View style={{}}>
                        <Menu
                        ref={(ref) => (_menu = ref)}
                        button={
                            <TouchableOpacity 
                                style={{ marginHorizontal: 10 }}
                                onPress={()=>{
                                    _menu.show()
                            }}>
                            <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                            </TouchableOpacity>
                        }>

                        
                        <MenuItem onPress={() => {
                            _menu.hide();
                            _this.refresh();
                        }}>
                            
                            <View style={{flexDirection:'row', alignItems: 'center',}}>
                                <MaterialIcons style={{padding:10}} name="cached" size={20} color={'grey'}  />
                                <Text>Refresh</Text>
                            </View>
                        </MenuItem>
                        </Menu>
                    </View>
            </View>
          )
    })

    this.getData()

    this.renderItem = this.renderItem.bind(this)

    this.saveData()


    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  refresh = () =>{
    this.setState({
      data:[],
      nid_last: 0,
    },() => {
      this.getData()
    });
  }

  saveData = async () => {
    try {
      await AsyncStorage.setItem('save_age', '1000')
      console.log('Data successfully saved')
    } catch (e) {
      console.log('Failed to save the data to the storage')
    }
  }

  onSelect = data => {

    console.log('onSelect');
  };

  handleSearch= () => {
      console.log(this.state.name);
      console.log(this.state.surname);
      console.log(this.state.bank_account);
  }

//   detail

  getData = () => {
    console.log('getData');
   
    let _this     = this;
    let {data, nid_last}  = _this.state;

    _this.setState({loading: true})

    if(data && data.length){
      nid_last = data[data.length - 1].id; 
    }

    console.log(API_URL)
    axios.post(`${API_URL}/api/fetch?_format=json`, {
      nid_last,
    }, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` 
      }
    })
    .then(function (response) {
      let results = response.data
      console.log(results)
      if(results.result){
        // true
        // console.log('true');
        // console.log(results);

        let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        // if(datas && datas.length > 0){
        //   _this.setState({spinner: false, execution_time, datas, count});
        // }else{

        _this.setState({data: [ ..._this.state.data, ...datas]});
        
        // _this.setState({data: [...this.state.data, ...datas]})
        //   alert('Empty result.');
        // }
        
      }else{
        // false
        // console.log('false');

        // _this.setState({spinner: false})
      }

      _this.setState({loading: false})
    })
    .catch(function (error) {
      console.log(error)
      _this.setState({loading: false})
    });
  }

  renderImage = (item) =>{
    // console.log(item.images)
    switch(item.images.length){
      case 0:{
        return(<View />)
        break;
      }
      case 1:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, margin: 2}} >
                      <FastImage
                        // style={{ StyleSheet.absoluteFill }}
                        style={{ ...StyleSheet.absoluteFill, borderWidth:.3, borderColor:'gray' }}
                        source={{
                            uri: item.images[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                  </View>
                </View>)
      }

      case 2:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
                <View style={{flex: 1, backgroundColor: 'red', margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
              </View>
            </View>)

      }

      case 3:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
                <View style={{flex: 1,  margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1,  margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
              </View>
            </View>)
      }

      case 4:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1, margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
                <View style={{flex: 1, margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1,  margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
                <View style={{flex: 1,  margin: 2}} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </View>
              </View>
            </View>)
      }

      default:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <View style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View style={{flex: 1, margin: 2}} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, margin: 2}} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View style={{flex: 1, margin: 2}} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View style={{flex: 1, margin: 2}} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: item.images[4],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                          <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{item.images.length - 5}</Text>
                        </View>
                    </View>
                  </View>
                </View>)

      }
      // default:{
      //   return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
      //             <View style={{flex: 2, flexDirection: 'row'}}>
      //               <View style={{flex: 1, flexDirection: 'column'}}>
      //                 <View style={{flex: 1, margin: 2}} >
      //                   <Image
      //                     source={{uri: item.images[0]}}
      //                     style={{flex: 1, backgroundColor:'gray'}}
      //                     resizeMode="cover" />
      //                 </View>
      //                 <View style={{flex: 1, margin: 2}} >
      //                   <Image
      //                     source={{uri: item.images[1]}}
      //                     style={{flex: 1, backgroundColor:'gray'}}
      //                     resizeMode="cover" />
      //                 </View>
      //               </View>
      //               <View style={{flex: 2, margin: 2}} >
      //                 <Image
      //                   source={{uri: item.images[3]}}
      //                   style={{flex: 1, backgroundColor:'gray'}}
      //                   resizeMode="cover" />
      //               </View>
      //             </View>
      //             <View style={{flex: 1, flexDirection: 'row'}}>
      //               <View style={{flex: 1, margin: 2}} >
      //                 <Image
      //                   source={{uri: item.images[4]}}
      //                   style={{flex: 1, backgroundColor:'gray'}}
      //                   resizeMode="cover" />
      //               </View>
      //               <View style={{flex: 1, margin: 2}} >
      //                 <Image
      //                   source={{uri: item.images[5]}}
      //                   style={{flex: 1, backgroundColor:'gray'}}
      //                   resizeMode="cover" />
      //               </View>
      //               <View style={{flex: 1, margin: 2}} >
      //                 <Image
      //                   source={{uri: item.images[6]}}
      //                   style={{flex: 1, backgroundColor:'gray'}}
      //                   resizeMode="cover" />
      //               </View>
      //             </View>
      //           </View>)
      
      // }
    }
  }

  renderItem = (item) =>{
    const { navigation } = this.props;

    let _this = this
    let _menu = null;
    return (
        <TouchableOpacity 
            key={Math.floor(Math.random() * 100) + 1}
            style={styles.listItem}
            onPress={()=>{
              navigation.navigate('detail', {data:item})
            }}>
          {/* <Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} /> */}
          <View style={{flex:1}}>
            {/* <Text style={{fontWeight:"bold"}}>{item.name} {item.surname}</Text> */}
            
            <View style={{flexDirection:'row'}}>
              <View style={{position:'absolute', right: 0, flexDirection:'row'}}>
                <TouchableOpacity 
                  style={{ padding:3,}}
                  onPress={()=>{
                    _this.toast.show('Follow');
                  }}>
                  {/* <Ionicons name="shield-checkmark" size={25} color={'grey'} /> */}
                  <Ionicons name="shield-checkmark-outline" size={25} color={'red'} />

                </TouchableOpacity>
                {/* <TouchableOpacity 
                      style={{ }}
                      onPress={()=>{}}>
                  <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                </TouchableOpacity> */}
                <View style={{justifyContent:'center'}}>
                  <Menu
                    ref={(ref) => (_menu = ref)}
                    button={
                      <TouchableOpacity 
                        style={{ paddingLeft:3, }}
                        onPress={()=>{
                          _menu.show()
                        }}>
                      <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                      </TouchableOpacity>
                    }>
                    <MenuItem onPress={() => {
                            _menu.hide();
                            const shareOptions = {
                                title: 'Share Banlist',
                                url: item.link,
                                failOnCancel: false,
                            };

                            Share.open(shareOptions)
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                err && console.log(err);
                            });
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Share</Text>
                        </View>
                    </MenuItem>

                    <MenuItem onPress={() => {
                            _menu.hide();
                            _this.toast.show('Report');
                            
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="report" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Report</Text>
                        </View>
                    </MenuItem>
                  </Menu>
                </View>
              </View>
              <View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                  <Text>{item.name} {item.surname}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                  <Text>{item.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                  <Text>{item.transfer_amount}</Text>
                </View>
                {/* transfer_date */}
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                  <Text>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                </View>
              </View>
            </View>
            <View style={{paddingRight:5, paddingBottom:5}}>
              {this.renderImage(item)}
            </View>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
              <Text>{item.detail}</Text>
            </View>
          </View>
          {/* <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"green"}}>Call</Text>
          </TouchableOpacity> */}
        </TouchableOpacity>
      );
  }

  renderFooter = () => {
    let {loading} = this.state
    return (
      //Footer View with Load More button
      <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.getData}>
          <View style={{backgroundColor:'#fff', alignItems: 'center', padding:10, margin:5}}> 
            <View style={{flexDirection:'row'}}>
              <Text>Load More</Text>
              {loading ? (
                <ActivityIndicator color="black" style={{marginLeft: 8}} />
              ) : null}
            </View>
          </View>
      </TouchableOpacity>
    );
  };

  handleLoginWithFacebook= () =>{
    console.log('handleLoginWithFacebook')

    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        console.log(result)
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  handleLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      // setUser(userInfo)
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  }

  modalLogin(){
    return(
      <Modal
      testID={'modal'}
      isVisible={this.state.bottomModalAndTitle}
      onSwipeComplete={this.close}
      // swipeDirection={['up', 'left', 'right', 'down']}
      style={{justifyContent: 'flex-end', margin: 0,}}
      backdropOpacity={0.5}
      onBackdropPress={() => {
        this.setState({ bottomModalAndTitle: false })
      }}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={{ backgroundColor:'white', padding:10}}>

      <View style={{ flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom:10}}>
       <Text style={{fontSize:24}}>
         Sign up for Banlist
       </Text>
       <Text style={{ textAlign: 'center', fontSize:16}}>
         Create a profile, favorite, share, report criminals and more...
       </Text>
      </View>

      <TouchableOpacity
          style={{   
            marginTop:10,      
            borderColor:'gray',
            borderWidth:.5 
          }}
          onPress={()=>{

            this.setState({ bottomModalAndTitle: false }, ()=>{
              navigation.navigate('login')
            })
            
          }}>
          <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
          <Ionicons name="person-outline" size={25} color={'grey'} />
          <Text style={{paddingLeft:10}}>Use phone or email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{   
            marginTop:10,      
            borderColor:'gray',
            borderWidth:.5 
          }}
          onPress={()=>{

            this.setState({ bottomModalAndTitle: false }, ()=>{
              this.handleLoginWithFacebook()
            })
            
          }}>
          <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
            <Ionicons name="logo-facebook" size={25} color={'grey'} />
            <Text style={{paddingLeft:10}}>Login with facebook</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{   
            marginTop:10,      
            borderColor:'gray',
            borderWidth:.5 
          }}
          onPress={()=>{

            this.setState({ bottomModalAndTitle: false }, ()=>{
              this.handleLoginWithGoogle()
            })
            
          }}>
          <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
            <Ionicons name="logo-google" size={25} color={'grey'} />
            <Text style={{paddingLeft:10}}>Login with google</Text>
          </View>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </Modal>
    )
  }

  render(){
      const { navigation } = this.props;
      return (
              <View style={styles.container}>
                <FlatList
                  style={{flex:1}}
                  data={this.state.data}
                  renderItem={({ item }) => this.renderItem(item)}
                  enableEmptySections={true}
                  ListFooterComponent={this.renderFooter()}
                  keyExtractor={(item, index) => String(index)}/>
                <ActionButton
                  buttonColor="rgba(231,76,60,1)"
                  onPress={() => { 

                    // console.log('add_banlist')
                    // navigation.navigate('add_banlist');

                    this.setState({bottomModalAndTitle: true})
                  }}/>
                
                {this.modalLogin()}

                <Toast
                  ref={(toast) => this.toast = toast}
                  position='bottom'
                  positionValue={220}
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}
                  />
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingHorizontal: 5
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
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  listItem:{
    margin:5,
    padding:10,
    backgroundColor:"#FFF",
    // width:"80%",
    // flex:1,
    // alignSelf:"center",
    // flexDirection:"row",
    borderRadius:5
  },
  footer: {
    // padding: 10,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    // padding: 10,
    backgroundColor: '#800000',
    // borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 10
  },
});

export default HomeScreen;
