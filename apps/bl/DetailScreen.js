import React from 'react';
import {SafeAreaView,
        StyleSheet, 
        Text, 
        View, 
        FlatList, 
        Dimensions, 
        Modal,
        TouchableOpacity} from 'react-native';
        
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast'
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image'
import ReactNativeModal from 'react-native-modal';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import {
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginManager
} from 'react-native-fbsdk';
import CameraRoll from "@react-native-community/cameraroll";

const axios = require('axios');

import { getUniqueId, getVersion } from 'react-native-device-info';

import { NumberFormat, isEmpty, Base64, compare2Arrays } from './Utils'
import {API_URL, API_URL_SOCKET_IO, WEB_CLIENT_ID, IOS_CLIENT_ID} from "./constants"

// https://reactnativecode.com/popup-menu-overflow-menu-in-react-navigation/
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

const Image = createImageProgress(FastImage);

import ModalLogin from './ModalLogin'

import {___followUp} from './actions/user'

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return data;
};
// headerRight
const numColumns = 3;
class DetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  data:null, 
                        modalVisible: false,
                        init_index: 0,
                        images: [],
                        showModalLogin: false,

                        // isLogin:false,
                    }
    }

    componentDidMount(){
        let { navigation, route, user, follow_ups, my_apps} = this.props;

        // let cL = await checkLogin()
        // if(!isEmpty(cL)){
        //     this.setState({isLogin: true})
        // }


        let data =  route.params.data;
        // console.log('user >>>', user)

        this.updateNavigation();

        let images = []
        if (data.images.thumbnail){
            data.images.thumbnail.map(function(itm){
                images.push({url:itm.url});
            })
        }
        
        this.setState({data, images})
        
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
    }

    isOwner = (id_check) => {
        return this.props.my_apps.includes(id_check)
    }

    componentDidUpdate(prevProps){
        // if(!compare2Arrays(prevProps.___follow_ups, this.props.___follow_ups)){
            this.updateNavigation()
        // }
    }

    updateNavigation(){
        let { navigation, route, user, follow_ups, ___followUp,  ___follow_ups} = this.props;

        let data =  route.params.data;
        // console.log('user >>>', user)

        let _this = this
        let _menu = null;
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity 
                        style={{  }}
                        onPress={ async()=>{
                            // 

                            // let {user, ___followUp,  ___follow_ups} = this.props
                            // let cL = this.props.user
                            // console.log(cL.uid, data.id, getUniqueId(), API_URL_SOCKET_IO())
                  
                            console.log('user : ', user)
                            if(isEmpty(user)){
                                _this.setState({showModalLogin: true})
                            }else{
                                /*
                                axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                                        uid: cL.uid,
                                        id_follow_up: data.id,
                                        unique_id: getUniqueId(),
                                        owner_id: data.owner_id
                                    }, {
                                    headers: { 
                                        'Content-Type': 'application/json',
                                    }
                                })
                                .then(function (response) {
                                    let {result, message} = response.data
                
                                    // console.log(response.data)
                                    if(result){
            
                                    }else{
                                        _this.toast.show(message);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error)
                                    // _this.setState({loading: false})
                                });
                                */

                                let find_fup = ___follow_ups.find(value => String(value.id) === String(data.id) )
                                // console.log('fup : ', find_fup, item.id)

                                let follow_up = true;
                                if(!isEmpty(find_fup)){
                                    follow_up = !find_fup.follow_up
                                    // console.log('find_fup.follow_up', !find_fup.follow_up)
                                }

                                if(follow_up){
                                    _this.toast.show("Follow up");
                                }else{
                                    _this.toast.show("Unfollow up");
                                }

                                ___followUp({"id": data.id, 
                                            "local": true, 
                                            "follow_up": follow_up, 
                                            // "uid": user.uid, 
                                            "unique_id": getUniqueId(), 
                                            "owner_id": data.owner_id, 
                                            "date": Date.now()}, 0);
                                        }
                            
                        }}>
                        { !this.isOwner(data.id) && 
                            <Ionicons name="shield-checkmark-outline" size={25} color={isEmpty(___follow_ups.find( value => String(value.id) === String(data.id) && value.follow_up )) ? 'gray' : 'red'} />} 


                        {/* 
                        <Ionicons 
                      name="shield-checkmark-outline" 
                      size={25} 
                      color={isEmpty(___follow_ups) ? 'gray' : (isEmpty(___follow_ups.find( value => String(value.id) === String(item.id) && value.follow_up )) ? 'gray' : 'red')} />

                        */}
                    </TouchableOpacity>
                    
                    <View style={{marginRight: 5}}>
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

                            const shareOptions = {
                                title: 'Share Banlist',
                                url:  API_URL + '/node/' + route.params.data.id,
                                failOnCancel: false,
                            };

                            // console.log(route.params.data.id)

                            Share.open(shareOptions)
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                err && console.log(err);
                            });
                        }}>
                            <View style={{flexDirection:'row', alignItems: 'center',}}>
                                <MaterialIcons style={{paddingRight:10}} name="share" size={20} color={'grey'}  />
                                <Text>Share</Text>
                            </View>
                        </MenuItem>
                        <MenuItem onPress={() => {
                            _menu.hide();
                            // _this.toast.show('report');

                            navigation.navigate('report', {data:route.params.data})
                        }}>
                            
                            <View style={{flexDirection:'row', alignItems: 'center',}}>
                                <MaterialIcons style={{paddingRight:10}} name="report" size={20} color={'grey'}  />
                                <Text>Report</Text>
                            </View>
                        </MenuItem>
                        </Menu>
                    </View>
                </View>
              )
        })
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
    };

    onUpdateState = data => {
        this.setState(data);
    }
    
    onLayout = () => { 
        const {width} = Dimensions.get('window')
        const itemWidth = 100
        const numColumns = Math.floor(width/itemWidth)
        this.setState({ numColumns })
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }

        return (
            <View style={styles.item}>
                <TouchableOpacity 
                    style={{  }}
                    onPress={()=>{
                        this.setState({modalVisible: true, init_index: index})
                    }}>
                    <FastImage
                        style={{ width:80, height:80,  borderRadius: 15, borderWidth:.3, borderColor:'gray'}}
                        source={{
                            uri: item.url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
            </View>
        );
    };

    renderHeader = () =>{
        let {data} = this.state
        if(!data){
            return <View />
        }
        
        let transfer_amount = data.transfer_amount
        if(typeof(data.transfer_amount) === 'string'){
            transfer_amount =parseFloat(data.transfer_amount.replace(/,/g, ''))
        }

        return(
            <View style={{flex:1, padding:10}} >
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                    <Text style={{color:'gray'}}>{data.name} {data.surname}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                    <Text style={{color:'gray'}}>{data.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                    <Text style={{color:'gray'}}>{NumberFormat(Number(transfer_amount))}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text style={{color:'gray'}}>{data.transfer_date ==='' ? '-' : data.transfer_date}</Text>
                </View>
                <View style={{flexDirection:'column'}}>
                    <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
                    <Text style={{color:'gray'}}>{data.detail}</Text>
                </View>
            </View>
        )
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
     
    render() {
        let {init_index, showModalLogin, modalVisible} = this.state

        let { route, user } = this.props;

        let images = []
        if (route.params.data.images.medium){
            route.params.data.images.medium.map(function(itm){
                images.push({url: itm.url});
            })
        }

        return (<SafeAreaView style={styles.container} onLayout={this.onLayout}>
                    {modalVisible && 
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
                        </Modal>
                    }
                    <Toast
                        ref={(toast) => this.toast = toast}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}/>
                    <FlatList
                        ListHeaderComponent={this.renderHeader()}
                        data={formatData(this.state.images, numColumns)}
                        style={styles.container}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                        keyExtractor={(item, index) => String(index)}/>

                    { 
                        isEmpty(user)  
                        && <ModalLogin {...this.props } showModalLogin={showModalLogin} updateState={this.onUpdateState} />
                    }
                </SafeAreaView>)
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
  footer: {
    width: '100%',
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    margin: 10
  }
});

const mapStateToProps = state => {
    return{
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
    ___followUp
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen)