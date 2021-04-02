/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */ 

import React, {Component, useEffect, PureComponent} from 'react';
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
  Dimensions,
  Image
} from 'react-native';

import {OptimizedFlatList} from 'react-native-optimized-flatlist'

import { connect } from 'react-redux';
import ReactNativeModal from 'react-native-modal';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import ImageView from "react-native-image-viewing";
import ActionButton from 'react-native-action-button';

const axios = require('axios');
var Buffer = require('buffer/').Buffer
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image'
import Toast, {DURATION} from 'react-native-easy-toast'
import CameraRoll from "@react-native-community/cameraroll";
import ImageViewer from 'react-native-image-zoom-viewer';

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

import Share from 'react-native-share';

import ReadMore from '@fawazahmed/react-native-read-more';

import { getUniqueId, getVersion } from 'react-native-device-info';

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID, API_URL_SOCKET_IO} from "./constants"

import { Base64, ValidateEmail, isEmpty } from './Utils'

import { fetchData, fetchDataAll, checkFetchData, clearData } from './actions/app';

class MyListItem extends PureComponent {

  renderImage = (item) =>{
    if(isEmpty(item.images.thumbnail)){
      return <View />
    }
    let thumbnail = item.images.thumbnail
    switch(thumbnail.length){
      case 0:{
        return(<View />)
        break;
      }
      case 1 :{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                    onPress={()=>{
                      this.props.onChange({modalVisible: true, init_index: 0, mv: item.id})
                    }}
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                      style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                      containerStyle={{ ...StyleSheet.absoluteFillObject }}
                      source={{
                          uri: thumbnail[0],
                          headers: { Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  </View>
                </View>)
      }

      case 2 :{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.props.onChange({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.props.onChange({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    
                </TouchableOpacity>
                
              </View>
            </View>)
      }

      default:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    // this.setState({modalVisible: true, init_index: 0, mv: item.id})
                    this.props.onChange({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}

                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                          console.log(
                            'Loading Progress ' +
                              e.nativeEvent.loaded / e.nativeEvent.total
                          )
                        }
                        onLoad={e =>
                          console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                          )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.props.onChange({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}



                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                          console.log(
                            'Loading Progress ' +
                              e.nativeEvent.loaded / e.nativeEvent.total
                          )
                        }
                        onLoad={e =>
                          console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                          )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.props.onChange({modalVisible: true, init_index: 2, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}


                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                          console.log(
                            'Loading Progress ' +
                              e.nativeEvent.loaded / e.nativeEvent.total
                          )
                        }
                        onLoad={e =>
                          console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                          )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />

                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                    <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 3}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>)
      }

      /*
      case 4:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 2, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 3, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
              </View>
            </View>)
      }

      default:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 0, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 1, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 2, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 3, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 4, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[4],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                          <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 5}</Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>)
      }

      */
    }
  }

  isOwner = (id_check) => {
    return this.props.my_apps.includes(id_check)
  }

  render() {
    // props.onChange
    let { navigation, follow_ups, item, user, toast, onChange } = this.props;
    // console.log('onChange : ', onChange)
    let { id } = item

    // 

    let _menu = null;
    return (
      <TouchableOpacity 
        key={Math.floor(Math.random() * 100) + 1}
        style={styles.listItem}
        onPress={()=>{
          navigation.navigate('detail', {data:item})
        }}>
        <View style={{flex:1}}>
          <View style={{flexDirection:'row'}}>
            <View style={{position:'absolute', right: 0, flexDirection:'row'}}>
              <TouchableOpacity 
                style={{ padding:3,}}
                onPress={ async ()=>{

                  let cL = this.props.user
                  console.log(API_URL_SOCKET_IO(), cL.uid, id, getUniqueId())
                
                  if(isEmpty(cL)){
                    this.setState({ bottomModalAndTitle: true })
                  }else{
                    axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                      uid: cL.uid,
                      id_follow_up: id,
                      unique_id: getUniqueId()
                    }, {
                      headers: { 
                        'Content-Type': 'application/json',
                      }
                    })
                    .then(function (response) {
                      let {result, message} = response.data

                      // console.log('message :', message)
                      if(result){

                      }else{
                        
                      }
                      toast.show(message);
                    })
                    .catch(function (error) {
                      console.log('error :', error)
                      // _this.setState({loading: false})
                    });
                  }
                  
                }}>
                { 
                !this.isOwner(id) &&
                <Ionicons 
                name="shield-checkmark-outline" 
                size={25} 
                /*color={isEmpty(follow_ups.find( f => f === id )) ? 'gray' : 'red'}*/ 
                color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => String(f) === String(id) )) ? 'gray' : 'red')} />
                }
              </TouchableOpacity>
              
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
                              // console.log(res);
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

                  <MenuItem onPress={ async () => {
                          _menu.hide();
                          
                          let cL = this.props.user
                          if(isEmpty(cL)){
                            this.setState({ bottomModalAndTitle: true })
                          }else{
                            navigation.navigate('report', {data:item})
                          }
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
                <TouchableOpacity 
                  style={{ }}
                  onPress={()=>{
                    navigation.navigate('filter', {data:item})
                  }}>
                  <Text style={{color:'#1a73e8'}}>{item.name} {item.surname}</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                <Text style={{color:'gray'}}>{item.title}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                <Text style={{color:'gray'}}>{item.transfer_amount}</Text>
              </View>
              {/* transfer_date */}
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
              </View>
            </View>
          </View>
          <View style={{paddingRight:5, paddingBottom:5}}>
            {this.renderImage(item)}
          </View>
          <View style={{flexDirection:'column'}}>
            <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
            <View style={styles.root}>
              <ReadMore 
                ellipsis={''} 
                seeMoreText={'See More'} 
                seeLessText={''}
                animate={false} 
                numberOfLines={3} 
                seeMoreStyle={{color:'black'}}
                style={styles.textStyle}>{ item.detail == '' ? '-' : item.detail}</ReadMore>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class HomeScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
                  data:[],
                  loading: false,
                  nid_last: 0,

                  selected: false,

                  chatMessage: "",
                  chatMessages: [],

                  refreshing: false,

                  modalVisible: false,
                  init_index: 0,
                  mv: 0
                  };
  }

  componentDidMount  = async () => {
    

    // useEffect(() => this.getData(), []);

    // console.log('async componentDidMount : ', API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID, API_URL_SOCKET_IO)

    // console.log('mergeArrays > ', this.mergeArrays([{"id":1},{"id":2},{"id":3},{"id":3},{"id":3}], [{"id":1},{"id":4},{"id":5},{"id":2}]))

    // console.log('API_URL_SOCKET_IO : ', API_URL_SOCKET_IO())

    const { route, navigation, fetchDataAll } = this.props;

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
                style={{ marginHorizontal: 10 }}
                onPress={()=>{
                  navigation.navigate('search')
                }}>
                <Ionicons name="search-outline" size={25} color={'grey'} />
              </TouchableOpacity>
              {/* <TouchableOpacity 
                style={{ marginHorizontal: 10 }}
                onPress={()=>{
                  console.log('Show Data :  ', this.props.data.length) 
                }}>
                <Text>Show Data</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ marginHorizontal: 10 }}
                onPress={()=>{
                  let {clearData} =  this.props;
                  clearData()
                }}>
                <Text>Clear Data</Text>
              </TouchableOpacity> */}
              {/* <View style={{}}>
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
                    </View> */}
            </View>
        )
    })

    this.getData()

    this.renderItem = this.renderItem.bind(this)

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  componentDidUpdate(prevProps){
    // console.log('componentDidUpdate : ', prevProps)
  }

  isOwner = (id_check) => {
    return this.props.my_apps.includes(id_check)
  }


  refresh = () =>{
    this.setState({
      nid_last: 0,
    },() => {
      this.getData()
    });
  }

  onSelect = data => {
    this.setState(data);
  }

  handleSearch= () => {
      console.log(this.state.name);
      console.log(this.state.surname);
      console.log(this.state.bank_account);
  }

  getData = () => {
    // console.log('getData');

    let {data} = this.props
   
    let _this     = this;
    let { nid_last }  = _this.state;

    _this.setState({loading: true})

    if(data && data.length){
      nid_last = data[data.length - 1].id; 
    }

    console.log('start : > ')
    axios.post(`${API_URL}/api/fetch?_format=json`, {
      nid_last,
    }, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log('results : ', results)
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

        // _this.setState({data: [ ..._this.state.data, ...datas]});

        _this.props.fetchData(datas);
        
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
      // console.log(error)
      _this.setState({loading: false})
    });
  }

  _saveImage = uri => {
    let _this = this
    let promise = CameraRoll.saveToCameraRoll(uri);

    promise.then(function(result) {
            _this.toast.show('Image Saved to Photo Gallery');
        })
        .catch(function(error) {
            _this.toast.show('Error Saving Image');
        });
  }

  renderImage = (item) =>{
    let thumbnail = item.images.thumbnail
    switch(thumbnail.length){
      case 0:{
        return(<View />)
        break;
      }
      case 1 :{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 0, mv: item.id})
                    }}
                    style={{flex: 1, margin: 2, }} >
                    <FastImage
                      style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                      containerStyle={{ ...StyleSheet.absoluteFillObject }}
                      source={{
                          uri: thumbnail[0],
                          headers: { Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  </View>
                </View>)
      }

      case 2 :{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    
                </TouchableOpacity>
                
              </View>
            </View>)
      }

      default:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}

                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                          console.log(
                            'Loading Progress ' +
                              e.nativeEvent.loaded / e.nativeEvent.total
                          )
                        }
                        onLoad={e =>
                          console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                          )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}



                        onLoadStart={e => console.log('Loading Start')}
                        onProgress={e =>
                          console.log(
                            'Loading Progress ' +
                              e.nativeEvent.loaded / e.nativeEvent.total
                          )
                        }
                        onLoad={e =>
                          console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                          )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 2, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}


                        onLoadStart={e => console.log('Loading Start')}
    onProgress={e =>
      console.log(
        'Loading Progress ' +
          e.nativeEvent.loaded / e.nativeEvent.total
      )
    }
    onLoad={e =>
      console.log(
        'Loading Loaded ' + e.nativeEvent.width,
        e.nativeEvent.height
      )
    }
    onLoadEnd={e => console.log('Loading Ended')}
                        />

                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                    <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 3}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>)
      }

      /*
      case 4:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 0, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 1, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 2, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={()=>{
                    this.setState({modalVisible: true, init_index: 3, mv: item.id})
                  }} 
                  style={{flex: 1, margin: 2, }} >
                  <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
              </View>
            </View>)
      }

      default:{
        return (<View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                  <View style={{flex: 2, flexDirection: 'row'}}>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 0, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[0],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 1, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[1],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 2, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[2],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 3, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[3],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{
                      this.setState({modalVisible: true, init_index: 4, mv: item.id})
                    }} 
                    style={{flex: 1, margin: 2, }} >
                      <FastImage
                        style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                        containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        source={{
                            uri: thumbnail[4],
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                          <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+{thumbnail.length - 5}</Text>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>)
      }

      */
    }
  }


  changeHandler = (val) => {
    this.setState(val)
  }

  renderItem = (item) =>{
    let { navigation, follow_ups, user, my_apps } = this.props;

    return <MyListItem
            item={item}
            navigation={navigation}
            follow_ups={follow_ups}
            user={user}
            toast={this.toast}
            my_apps={my_apps}
            onChange={this.changeHandler} />

    /*
    // let { navigation, follow_ups } = this.props;
    let { id } = item

    // let test = ;
    // console.log('test : ', id , test, follow_ups)

    let _this = this
    let _menu = null;
    return (
        <TouchableOpacity 
            key={Math.floor(Math.random() * 100) + 1}
            style={styles.listItem}
            onPress={()=>{
              navigation.navigate('detail', {data:item})
            }}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
              <View style={{position:'absolute', right: 0, flexDirection:'row'}}>
                <TouchableOpacity 
                  style={{ padding:3,}}
                  onPress={ async ()=>{

                    let cL = this.props.user
                    console.log(API_URL_SOCKET_IO(), cL.uid, id, getUniqueId())
                  
                    if(isEmpty(cL)){
                      this.setState({ bottomModalAndTitle: true })
                    }else{
                      axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                        uid: cL.uid,
                        id_follow_up: id,
                        unique_id: getUniqueId()
                      }, {
                        headers: { 
                          'Content-Type': 'application/json',
                        }
                      })
                      .then(function (response) {
                        let {result, message} = response.data

                        // console.log('message :', message)
                        if(result){

                        }else{
                          
                        }
                        _this.toast.show(message);
                      })
                      .catch(function (error) {
                        console.log('error :', error)
                        // _this.setState({loading: false})
                      });
                    }
                    
                  }}>
                  <Ionicons 
                  name="shield-checkmark-outline" 
                  size={25} 
                  color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => f === id )) ? 'gray' : 'red')} />
                </TouchableOpacity>
                
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
                                // console.log(res);
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

                    <MenuItem onPress={ async () => {
                            _menu.hide();
                            
                            let cL = this.props.user
                            if(isEmpty(cL)){
                              this.setState({ bottomModalAndTitle: true })
                            }else{
                              navigation.navigate('report', {data:item})
                            }
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
                  <TouchableOpacity 
                    style={{ }}
                    onPress={()=>{
                      navigation.navigate('filter', {data:item})
                    }}>
                    <Text style={{color:'gray'}}>{item.name} {item.surname}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                  <Text style={{color:'gray'}}>{item.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                  <Text style={{color:'gray'}}>{item.transfer_amount}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                  <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                </View>
              </View>
            </View>
            <View style={{paddingRight:5, paddingBottom:5}}>
              {this.renderImage(item)}
            </View>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
              <View style={styles.root}>
                <ReadMore 
                  ellipsis={''} 
                  seeMoreText={'See More'} 
                  seeLessText={''}
                  animate={false} 
                  numberOfLines={3} 
                  seeMoreStyle={{color:'black'}}
                  style={styles.textStyle}>{ item.detail == '' ? '-' : item.detail}</ReadMore>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
      */
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
    // console.log('handleLoginWithFacebook')

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
    let { navigation } = this.props;

    return(
      <ReactNativeModal
      testID={'modal'}
      isVisible={this.state.bottomModalAndTitle}
      onSwipeComplete={this.close}
      // swipeDirection={['up', 'left', 'right', 'down']}
      style={{justifyContent: 'flex-end', margin: 0,}}
      backdropOpacity={0.5}
      useNativeDriver={true}
      onBackdropPress={() => {
        this.setState({ bottomModalAndTitle: false })
      }}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={{ backgroundColor:'white', padding:10}}>

      <View style={{ flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom:10}}>
       <Text style={{fontSize:20}}>
         Sign up for Banlist
       </Text>
       <Text style={{ textAlign: 'center', fontSize:14, color:'gray'}}>
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
              navigation.navigate('login', { onSelect: this.onSelect })
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
    </ReactNativeModal>
    )
  }

  viewImageViewer = () =>{
    let {modalVisible, mv, init_index} = this.state
   
    const { data } = this.props;
    let found = data.find( item =>{ return item.id === mv } );
      
    let images = []

    if ( !isEmpty(found) && !isEmpty(found.images) ){
      if ( found.images.medium){
        found.images.medium.map( (uri) => {
          return images.push({uri});
        })
      }
    }
    
    return <ImageView
          images={images}
          imageIndex={init_index}
          visible={modalVisible}
          swipeToCloseEnabled={true}
          onRequestClose={() => this.setState({ modalVisible: false })}
        />
    // }

    // return v;

    console.log('----------')
    // const images = [{
    //                     // Simplest usage.
    //                     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
                    
    //                     // width: number
    //                     // height: number
    //                     // Optional, if you know the image size, you can set the optimization performance
                    
    //                     // You can pass props to <Image />.
    //                     props: {
    //                         // headers: ...
    //                     }
    //                 },]

    /*
    if (found.images.medium){
  found.images.medium.map( async (url) => {
        let {width, height} = await this.getImageSize(url);
        console.log('w h : ', width, height)
        return images.push({url, width, height});
    })
}
    */

   

    // console.log(images)

    // images = [
    //   {
    //     uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
    //   },
    //   {
    //     uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
    //   },
    //   {
    //     uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    //   },
    // ];

    
    return  <Modal 
              visible={modalVisible}
              transparent={true}
              // style={{flex:1, backgroundColor:'red'}}
              onRequestClose={() => this.setState({ modalVisible: false })}>
              <ImageViewer 
                  // style={{flex:1}}
                  imageUrls={images.filter(function(item){return item.empty !== true;})}
                  index={init_index}
                  // imageUrls={images}
                  // renderHeader={this.renderHeaderImageViewer}
                  // renderFooter={this.renderFooterImageViewer}
                  onSwipeDown={() => {this.setState({modalVisible: false}) }}
                  onMove={data => {

                  }}
                  enableSwipeDown={true}
                  onSave={uri => {this._saveImage(uri)}}
                  loadingRender={() => (
                  //   // <View style={{flex:1, backgroundColor:'yellow', justifyContent:'center', alignItems:'center'}}>
                  //   // <ActivityIndicator
                  //   //   color='white'
                  //   //   size="small"
                  //   //   style={{
                  //   //     height: Dimensions.get('window').height,
                  //   //     alignItems: 'center',
                  //   //     justifyContent: 'center',
                  //   //   }}
                  //   // />
                  //   // </View>
                    <View style={{width:50,height:50,backgroundColor:'yellow',zIndex:99}}>
                      <ActivityIndicator color={'yellow'}/>
                    </View>
                  )}

                  // renderImage={(props)=>{
                  //   return(
                  //       <View style={{flex:1 }}>
                  //       <FastImage
                  //             // style={{ width: 960, height: 960, backgroundColor:'blue' }}
                  //             style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                  //             containerStyle={{ ...StyleSheet.absoluteFillObject }}
                  //             source={{
                  //                 uri: props.source.uri,
                  //                 headers: { Authorization: 'someAuthToken' },
                  //                 priority: FastImage.priority.normal,
                  //             }}
                  //             resizeMode={FastImage.resizeMode.center}


                  //             onLoadStart={e => console.log('Loading Start : x')}
                  //             onProgress={e =>
                  //               console.log(
                  //                 'Loading Progress  : x ' +
                  //                   e.nativeEvent.loaded / e.nativeEvent.total
                  //               )
                  //             }
                  //             onLoad={e =>
                  //               console.log(
                  //                 'Loading Loaded  : x' + e.nativeEvent.width,
                  //                 e.nativeEvent.height
                  //               )
                  //             }
                  //             onLoadEnd={e => console.log('Loading Ended : x')}
                  //           />  
                  //           </View>
                  //        )
                  //   }}

                  /*
                  renderImage={(props) => {
                    console.log(props)
                    console.log(Dimensions.get('window').width)
                    console.log(Dimensions.get('window').height)
                    return  <View style={{flex:1, backgroundColor:'blue'}}>
                            <FastImage
                              // style={{ width: 960, height: 960, backgroundColor:'blue' }}
                              style={{flex:1}}
                              containerStyle={{ ...StyleSheet.absoluteFillObject }}
                              source={{
                                  uri: props.source.uri,
                                  headers: { Authorization: 'someAuthToken' },
                                  priority: FastImage.priority.normal,
                              }}
                              resizeMode={FastImage.resizeMode.center}
                            />  
                            </View>
                   
  }}
  */
                  />
              {/* {this.renderFooterImageViewer()} */}
            </Modal>
  }

  render(){
      const { navigation, data } = this.props;
      return (<View style={styles.container}>
                <OptimizedFlatList
                  ref={(ref) => this.flatlistref = ref}
                  style={{flex:1}}
                  data={data}
                  renderItem={({ item }) => this.renderItem(item)}
                  enableEmptySections={true}
                  ListFooterComponent={this.renderFooter()}
                  keyExtractor={(item, index) => String(index)}
                  refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                    />
                  }

                  // Performance settings
                  removeClippedSubviews={true} // Unmount components when outside of window 
                  initialNumToRender={2} // Reduce initial render amount
                  maxToRenderPerBatch={1} // Reduce number in each render batch
                  updateCellsBatchingPeriod={100} // Increase time between renders
                  windowSize={7} // Reduce the window size
                
                />
                <ActionButton
                  buttonColor="rgba(231,76,60,1)"
                  onPress={() => { 
                    // console.log(this.props.user)
                    if(isEmpty(this.props.user)){
                      this.setState({bottomModalAndTitle: true})
                    }else{
                      navigation.navigate('add_banlist', { onSelect: this.onSelect })
                    }
                  }}/>
                {this.modalLogin()}

                <Toast
                  ref={(toast) => this.toast = toast}
                  position='bottom'
                  positionValue={220}
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}/>

                {this.viewImageViewer()}
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  listItem:{
    margin:5,
    padding:10,
    backgroundColor:"#FFF",
    borderRadius:5
  },
  footer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    backgroundColor: '#800000',
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
  root: {
    flex: 1,
  },
  textStyle: {
    fontSize: 14,
    color:'gray'
  },
});

const mapStateToProps = state => {
  return{
    data: state.app.data,
    user: state.user.data,
    follow_ups: state.user.follow_ups,
    my_apps: state.user.my_apps
  }
}

/*
 is function call by user
*/
const mapDispatchToProps = {
  fetchData,
  fetchDataAll,
  checkFetchData,
  clearData
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
