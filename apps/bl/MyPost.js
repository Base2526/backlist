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
    Modal,
    RefreshControl
} from 'react-native';

// import { Image } from 'react-native-elements';

import ReactNativeModal from 'react-native-modal';

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

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import FastImage from 'react-native-fast-image'

import ReadMore from '@fawazahmed/react-native-read-more';
 
class MyPost extends Component {
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
                   };
    }
    
    componentDidMount() {
    }

    renderItem = (item) =>{
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
                    {/* <TouchableOpacity 
                      style={{ padding:3,}}
                      onPress={ async ()=>{
                        // _this.toast.show('Follow');
                        // /api/favorite'
    
                        let cL = await checkLogin()
    
                        console.log(cL)
    
                        // uid, id_favorite, unique_id 
    
                        // console.log(API_URL_SOCKET_IO)
                        axios.post(`${API_URL_SOCKET_IO}/api/favorite`, {
                          uid: cL.uid,
                          id_favorite: id,
                          unique_id: Base64.btoa(getUniqueId())
                        }, {
                          headers: { 
                            'Content-Type': 'application/json',
                          }
                        })
                        .then(function (response) {
                          let {result, message} = response.data
    
                          if(result){
    
                          }else{
                            _this.toast.show(message);
                          }
                        })
                        .catch(function (error) {
                          console.log(error)
                          // _this.setState({loading: false})
                        });
                      }}>
                      <Ionicons name="shield-checkmark-outline" size={25} color={'red'} />
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
                                navigation.navigate('report', {data:item})
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
                        <Text style={{color:'gray'}}>-</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                      <Text style={{color:'gray'}}>-</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                      <Text style={{color:'gray'}}>-</Text>
                    </View>
                    {/* transfer_date */}
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                      <Text style={{color:'gray'}}>-</Text>
                    </View>
                  </View>
                </View>
                <View style={{paddingRight:5, paddingBottom:5}}>
                                {/*  */}

                    <View style={{width: '100%', height: 300, flexDirection: 'column'}}>
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <TouchableOpacity onPress={()=>{
                            this.setState({modalVisible: true})
                            }} style={{flex: 1, margin: 2, }} >
                            <FastImage
                                style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                                containerStyle={{ ...StyleSheet.absoluteFillObject }}
                                source={{
                                    uri: '',
                                    headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{}} style={{flex: 1, margin: 2, }} >
                            <FastImage
                                style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                                containerStyle={{ ...StyleSheet.absoluteFillObject }}
                                source={{
                                    uri: '',
                                    headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>{}} style={{flex: 1, margin: 2, }} >
                        <FastImage
                            style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                            containerStyle={{ ...StyleSheet.absoluteFillObject }}
                            source={{
                                uri: '',
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{}} style={{flex: 1, margin: 2, }} >
                        <FastImage
                            style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                            containerStyle={{ ...StyleSheet.absoluteFillObject }}
                            source={{
                                uri: '',
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{}} style={{flex: 1, margin: 2, }} >
                        <FastImage
                            style={{ ...StyleSheet.absoluteFillObject, borderWidth:.3, borderColor:'gray' }}
                            containerStyle={{ ...StyleSheet.absoluteFillObject }}
                            source={{
                                uri: '',
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  opacity: 0.5, backgroundColor: 'black', }} >
                            <Text style={{fontWeight:'bold', fontSize:33, color:'white'}}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </View>
                                {/*  */}
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
                      style={styles.textStyle}>-</ReadMore>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
    }

    render(){
        const { navigation } = this.props;
        return (<View style={styles.container}>
                <FlatList
                    ref={(ref) => this.flatlistref = ref}
                    style={{flex:1}}
                    data={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                    renderItem={({ item }) => this.renderItem(item)}
                    enableEmptySections={true}
                    // ListFooterComponent={this.renderFooter()}
                    keyExtractor={(item, index) => String(index)}
                    // refreshControl={
                    //   <RefreshControl
                    //       refreshing={this.state.refreshing}
                    //       onRefresh={this.refresh}
                    //   />
                    // }
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
    root: {
      flex: 1,
      // padding: 16,
    },
    textStyle: {
      fontSize: 14,
      color:'gray'
    },
});
  

export default MyPost;