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
// 
class MyFollowUps extends Component {
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

    let {data, follow_ups} = this.props
    // 
    // let new_data = data.filter(item => (follow_ups.includes(item.id)))

    // console.log('follow_ups > ', follow_ups)

    let {basic_auth} = this.props.user

    axios.post(`${API_URL}/api/fetch_post_by_id?_format=json`, {
      data: JSON.stringify(follow_ups)
    }, {
      headers: { 
        'Authorization': `Basic ${basic_auth}` 
      }
    })
    .then(function (response) {
      let results = response.data
      if(results.result){
        let {datas} = results

        _this.props.fetchData(datas)
      }
    })
    .catch(function (error) {
      console.log(error)
    });

    this.updateNavigation();
  }

  componentDidUpdate(prevProps){
    if(!compare2Arrays(prevProps.follow_ups, this.props.follow_ups)){
        this.updateNavigation()
    }
  }

  updateNavigation(){
    let { navigation, follow_ups} = this.props;

    let _this = this
    let _menu = null;
    navigation.setOptions({
      title: 'My follow ups (' + follow_ups.length + ')', 
    })
  }

  renderItem = (item) =>{
    let { navigation, follow_ups } = this.props;

    let _this = this
    let _menu = null

    console.log('follow_ups : ', follow_ups)
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
                <View style={{justifyContent:'center'}}>
                  <TouchableOpacity 
                    style={{ padding:3,}}
                    onPress={ async ()=>{
                      let cL = this.props.user
                      axios.post(`${API_URL_SOCKET_IO()}/api/follow_up`, {
                        uid: cL.uid,
                        id_follow_up: item.id,
                        unique_id: getUniqueId(),
                        owner_id: item.owner_id
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
                    <Ionicons 
                      name="shield-checkmark-outline" 
                      size={25} 
                      color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => String(f) === String(item.id) )) ? 'gray' : 'red')} 
                    />
                  </TouchableOpacity>
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
    follow_ups: state.user.follow_ups
  }
}

// fetchData
const mapDispatchToProps = {
  fetchData
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFollowUps)