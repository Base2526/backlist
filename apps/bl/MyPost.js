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
    RefreshControl,
    Alert
} from 'react-native';

import { connect } from 'react-redux';

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

import Share from 'react-native-share';

import ReadMore from '@fawazahmed/react-native-read-more';

import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID} from "./constants"

import { fetchData } from './actions/app';
 
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
      let _this = this

      let {data, my_apps} = this.props
      // 
      // let new_data = data.filter(item => (follow_ups.includes(item.id)))

      console.log('my_apps > ', my_apps)

      let {basic_auth} = this.props.user

      axios.post(`${API_URL}/api/fetch_post_by_id?_format=json`, {
        data: JSON.stringify(my_apps)
      }, {
        headers: { 
          'Authorization': `Basic ${basic_auth}` 
        }
      })
      .then(function (response) {
        let results = response.data
        if(results.result){
          let {datas} = results

          // console.log('MyPost : ', datas)

          _this.props.fetchData(datas)
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    }

    renderItem = (item) =>{
      let { navigation, route } = this.props;

      let _this = this
      let _menu = null

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
                      
                    }}>
                    <View style={{flexDirection:'row', borderColor:'gray', borderWidth:1, alignItems:'center', padding:2, borderRadius: 10}}>
                      <Ionicons name="people-outline" size={20} color={'gray'} />
                      <Text style={{padding:5, fontSize:14, color:'gray'}}>5</Text>
                    </View>
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
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons style={{justifyContent:'center', alignItems: 'center', marginRight:5}}  name="people-outline" size={25} color={'gray'} />
                          <Text style={{ textAlign: 'center' }}>Followers</Text>
                        </View>
                      </MenuItem>

                      <MenuItem onPress={() => {
                            _menu.hide();
                            const shareOptions = {
                              title: 'Share Banlist',
                              url:  API_URL + '/node/24443',
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
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          {/* <Ionicons style={{justifyContent:'center', alignItems: 'center', marginRight:5}}  name="share" size={25} color={'gray'} /> */}
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Share</Text>
                        </View>
                      </MenuItem>
                      <MenuItem onPress={() => {
                            _menu.hide();
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="edit" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Edite</Text>
                        </View>
                      </MenuItem>
                      <MenuItem onPress={() => {
                            _menu.hide();

                            Alert.alert(
                              "Comfirm",
                              "Are you sure delete?",
                              [
                                  {
                                  text: "Cancel",
                                  onPress: () => console.log("Cancel Pressed"),
                                  style: "cancel"
                                  },
                                  { text: "Delete", onPress: () => {
                                      // logout().then(res => {
                                      //     this.setState({isLogin: false})
                                      // })
                                  } }
                              ]
                              );
                            // navigation.navigate('report', {data:item})
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5, color:'red'}} name="delete" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center', color:'red' }}>Delete</Text>
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
                  {/* transfer_date */}
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                  </View>
                </View>
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
        );
    }

    render(){
        const { navigation, data } = this.props;
        return (<View style={styles.container}>
                  <FlatList
                    ref={(ref) => this.flatlistref = ref}
                    style={{flex:1}}
                    data={data}
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

                  <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => { 
                      navigation.navigate('add_banlist');
                    }}/>
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
  

// export default MyPost;
const mapStateToProps = state => {
  return{
    data: state.app.data.filter(item => (state.user.my_apps.includes(item.id))),
    user: state.user.data,
    my_apps: state.user.my_apps
  }
}

// fetchData
const mapDispatchToProps = {
  fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPost)