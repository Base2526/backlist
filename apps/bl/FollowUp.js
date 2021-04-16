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
import ReadMore from '@fawazahmed/react-native-read-more';

import { isEmpty, compare2Arrays } from './Utils'
import { getUniqueId, getVersion } from 'react-native-device-info';
import {API_URL, API_URL_SOCKET_IO} from "./constants"
import { fetchData } from './actions/app';

class FollowUp extends Component {
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
    
    let { navigation, route, follower_post} = this.props;

    let data =  route.params.data;

    let fp = follower_post.find((im)=>{ return String(im.post_id) === String(data.id) })

    if(isEmpty(fp)){
      return;
    }

    let _this = this
    let {basic_auth} = this.props.user
    axios.post(`${API_URL}/api/fetch_profile_by_id?_format=json`, {
      data: JSON.stringify(fp.follower)
    }, {
      headers: { 
        'Authorization': `Basic ${basic_auth}` 
      }
    })
    .then(function (response) {
      let results = response.data
      console.log('results >> : ', results)
      if(results.result){
        let {datas} = results

        // _this.props.fetchData(datas)

        _this.setState({data: datas})
      }
    })
    .catch(function (error) {
      console.log(error)
    });

    this.updateNavigation();
  }

  componentDidUpdate(prevProps){
    if(!compare2Arrays(prevProps.follower_post, this.props.follower_post)){
        this.updateNavigation()
    }
  }

  updateNavigation(){
    let { navigation, route, follower_post} = this.props;

    let data =  route.params.data;
    let fp = follower_post.find((im)=>{ return String(im.post_id) === String(data.id) })

    if(isEmpty(fp)){
      navigation.pop();
      return;
    }

    let _menu = null

    navigation.setOptions({
      title: 'Follow up (' + fp.follower.length + ')', 
      headerRight: () => (
        // <TouchableOpacity 
        //   style={{ marginHorizontal: 10 }}
        //   onPress={()=>{
        //     navigation.navigate('search')
        //   }}>
        //   <Ionicons name="search-outline" size={28}  />
        // </TouchableOpacity>

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
            <MenuItem onPress={() => {}} style={{alignItems:'center'}}>
              <Text style={{flex:9,
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'center'}}>รายงานผู้ติดตาม</Text>
            </MenuItem>
          </Menu>
        </View>
      ) 
    })
  }

  renderItem = (item) =>{
    let { navigation } = this.props;

    let _this = this
    let _menu = null
    return(<TouchableOpacity
            style={{
              margin:5,
              // padding:10,
              backgroundColor:"#FFF",
              borderRadius:5
            }}>
            <View style={{flexDirection:'row', margin:10}}>
              <View style={{}}>
              {isEmpty(item.image_url)? <Ionicons name="person-outline" size={30} style={{borderWidth:.3, borderColor:'gray', borderRadius: 20, padding: 5 }}/> : 
                                                                                            <FastImage
                                                                                              style={{ width:40, height:40,  borderRadius: 20, borderWidth:.3, borderColor:'gray'}}
                                                                                              source={{
                                                                                                  uri: item.image_url,
                                                                                                  headers: { Authorization: 'someAuthToken' },
                                                                                                  priority: FastImage.priority.normal,
                                                                                              }}
                                                                                              resizeMode={FastImage.resizeMode.cover}
                                                                                              />}
                
              </View>
              <View style={{flexDirection:'row', flex:1, paddingLeft:10}}>
                <Text style={{fontWeight:"bold", fontSize:18}}>ชื่อ:</Text>
                <TouchableOpacity>
                  <Text style={{color:'gray', fontSize:18}}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>)
  }

  render(){
    let { data } = this.state;
    return (<View style={styles.container}>
              <FlatList
                  ref={(ref) => this.flatlistref = ref}
                  style={{flex:1}}
                  data={data}
                  renderItem={({ item }) => this.renderItem(item)}
                  enableEmptySections={true}
                  keyExtractor={(item, index) => String(index)}
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
   
const mapStateToProps = state => {
  return{
    data: state.app.data.filter(item => (state.user.follow_ups.includes(item.id))),
    user: state.user.data,
    follow_ups: state.user.follow_ups,
    follower_post: state.user.follower_post
  }
}

export default connect(mapStateToProps, null)(FollowUp)