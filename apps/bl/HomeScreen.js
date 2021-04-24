/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */ 

import React, {Component, useEffect, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';

import { connect } from 'react-redux';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import ActionButton from 'react-native-action-button';
const axios = require('axios');
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FastImage from 'react-native-fast-image'
import Toast, {DURATION} from 'react-native-easy-toast'
import CameraRoll from "@react-native-community/cameraroll";
import ImageViewer from 'react-native-image-zoom-viewer';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const Image = createImageProgress(FastImage);
import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID} from "./constants"
import { isEmpty } from './Utils'
import { fetchData, fetchDataAll, checkFetchData, clearData, testFetchData,  } from './actions/app';

import {___followUp} from './actions/user'

import ModalLogin from './ModalLogin'
import HomeScreenItem from './HomeScreenItem'
import { SafeAreaView } from 'react-native';

import SafeArea, { withSafeArea } from 'react-native-safe-area'

class HomeScreen extends Component {
  constructor(props) {
      super(props);

      this.is_mounted = false;

      this.state = {
                  data:[],
                  loading: false,
                  nid_last: 0,
                  offset: 0,

                  selected: false,

                  chatMessage: "",
                  chatMessages: [],

                  refreshing: false,

                  modalVisible: false,
                  init_index: 0,
                  mv: 0,


                  showModalLogin:false
                  };
  }

  componentDidMount(){
    this.is_mounted = true;
    const { navigation, data } = this.props;

    navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => { this.scrollToOffset() }}>
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
            </View>
        )
    })

    if(isEmpty(data)){
      this.getData()
    }

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });

    DeviceEventEmitter.removeListener("event.homeScrollToOffset");
    DeviceEventEmitter.addListener("event.homeScrollToOffset", (event)=>{
      this.scrollToOffset()
    })
  }

  componentWillUnmount(){
    this.is_mounted = false;

    DeviceEventEmitter.removeListener("event.homeScrollToOffset");
  }

  componentDidUpdate(prevProps){
    // console.log('componentDidUpdate :  >> ', prevProps.data)
    // console.log('componentDidUpdate :  this.props.data ', this.props.data)

    // if (this.props.data !== prevProps.data) {

    //   console.log('componentDidUpdate 1, ::: ', prevProps.data)
    //   console.log('componentDidUpdate 2, ::: ', this.props.data)
    //   this.setState({data: prevProps.data})
    // }
  }

  scrollToOffset = () =>{
    if(this.flatlistref){
      this.flatlistref.scrollToOffset({ animated: true, offset: 0 });
    }
  }

  isOwner = (id_check) => {
    return this.props.my_apps.includes(id_check)
  }

  refresh = () =>{
    this.is_mounted && this.setState({offset: 0},() => { this.getData() });
  }

  onUpdateState = data => {
    this.setState(data);
  }

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  getData = () => {
    // console.log('getData');

    let {data, user} = this.props
   
    let _this     = this;
    let { offset }  = _this.state;

    _this.setState({loading: true})

    if(data && data.length){
      nid_last = data[data.length - 1].id; 
    }

    console.log('start : > ')
    
    let basic_auth = API_TOKEN;
    if(!isEmpty(user)){
      basic_auth = this.props.user.basic_auth
    }

    axios.post(`${API_URL}/api/search?_format=json`, {
      type: 0,
      key_word: '*',
      offset
    }, {
        headers: {'Authorization': `Basic ${basic_auth}`}
    })
    .then(function (response) {
      let results = response.data
      console.log('end : > ')
      if(results.result){
        // true
        let {execution_time, datas, count} = results;
        _this.props.fetchData(datas);
      }

      _this.setState({loading: false})
    })
    .catch(function (error) {
      // alert(error.message)

      // console.log("error :", error)

      _this.toast.show(error.message);

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
    return  <HomeScreenItem
              {...this.props}
              item={item}
              toast={this.toast}
              onChange={this.changeHandler} />
  }

  renderFooter = () => {
    let {loading, offset} = this.state
    return (
      //Footer View with Load More button
      <TouchableOpacity
          activeOpacity={0.9}
          // onPress={this.getData}
          onPress={()=>{
            this.setState({
                offset:  offset + 1
            },() => {
                this.getData();
            });
          }}
          >
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

  imageViewerHeader = () =>{
    return (<View style={[
                          { position:'absolute',
                            top:10,
                            right:10,
                            opacity: 0.5,
                            zIndex: 9999},
                          Platform.OS === 'ios' ? { paddingTop: 48 } : { }
                        ]}>
              <TouchableOpacity style={{ borderRadius: 20,  backgroundColor:'white', }}>
                <MaterialIcons
                  name='close'
                  style={{alignSelf: 'flex-end',
                          color: 'gray',
                          fontSize: 30,
                          padding:5
                          }}
                  onPress={()=>{
                    this.setState({modalVisible: false})
                  }}/>
              </TouchableOpacity>
            </View>)
  }

  imageViewer = () =>{
    let {modalVisible, mv, init_index} = this.state
   
    let found = this.props.data.find( item =>{ return item.id === mv } );
      
    let images = []

    if ( !isEmpty(found) && !isEmpty(found.images) ){
      if ( found.images.medium){
        found.images.medium.map( (itm) => {
          return images.push({url:itm.url});
        })
      }
    }

    return (
            <Modal 
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => this.setState({ modalVisible: false })}>
              <ImageViewer 
                  imageUrls={images.filter(function(item){return item.empty !== true;})}
                  index={init_index}
                  renderHeader={this.imageViewerHeader}
                  // renderFooter={this.renderFooterImageViewer}
                  onSwipeDown={() => {
                      this.setState({modalVisible: false})
                  }}
                  onSave={uri => {
                      this._saveImage(uri)
                  }}
                  onMove={data => console.log(data)}
                  enableSwipeDown={true}
                  renderImage={(props)=>{
                    return(
                      <Image {...props}
                          indicator={Progress.Pie}
                          indicatorProps={{
                              size: 50,
                              borderWidth: 1,
                              color: '#ffffff',
                              // unfilledColor: 'rgba(60,14,101, 0.2)',
                          }}
                          onLoadStart={e => console.log('Loading Start >>> ')}
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
                      )
                    }}
                  />
              {/* {this.renderFooterImageViewer()} */}
            </Modal>

    )
  }

  render(){
      const { navigation, data } = this.props;
      const {showModalLogin, modalVisible} = this.state

      return (<View style={styles.container}>
                <FlatList
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
                      this.setState({showModalLogin: true})
                    }else{
                      navigation.navigate('add_banlist', { updateState: this.onUpdateState })
                    }
                  }}/>
                { 
                  isEmpty(this.props.user)  
                  && <ModalLogin {...this.props } showModalLogin={showModalLogin} updateState={ this.onUpdateState } />
                }
                
                <Toast
                  ref={(toast) => this.toast = toast}
                  position='bottom'
                  positionValue={220}
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}/>

                { modalVisible && this.imageViewer()}

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
    my_apps: state.user.my_apps,

    ___follow_ups: state.user.___follow_ups
  }
}

/*
 is function call by user
*/
const mapDispatchToProps = {
  fetchData,
  fetchDataAll,
  checkFetchData,
  clearData,


  testFetchData,


  ___followUp
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)