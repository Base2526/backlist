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
  TextInput,
  ActivityIndicator,
  FlatList,
  Image ,
} from 'react-native';

import Modal, {
  ModalTitle,
  ModalContent,
  ModalFooter,
  ModalButton,
  SlideAnimation,
  ScaleAnimation,
  BottomModal,
  ModalPortal,
} from 'react-native-modals';

import ActionButton from 'react-native-action-button';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import AsyncStorage from '@react-native-async-storage/async-storage';

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import {API_URL, API_TOKEN} from "@env"

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
        headerRight: () => (
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity 
                style={{ marginHorizontal: 10 }}
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
    // console.log('getData');
    // setLoading(true);
  //   //Service to get the data from the server to render
  //   fetch('https://aboutreact.herokuapp.com/getpost.php?offset=' + offset)
  //     //Sending the currect offset with get request
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       // //Successful response from the API Call
  //       // setOffset(offset + 1);
  //       // //After the response increasing the offset for the next API call.
  //       // setDataSource([...dataSource, ...responseJson.results]);
  //       // setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

    let _this     = this;
    let {data, nid_last}  = _this.state;

    _this.setState({loading: true})

    if(data && data.length){
      nid_last = data[data.length - 1].id; 
    }

    axios.post(`${API_URL}/api/fetch?_format=json`, {
      nid_last,
    }, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log()
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
      _this.setState({loading: false})
    });
  }

  renderItem = (item) =>{
      const { navigation } = this.props;
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

  render(){
      const { navigation } = this.props;
      return (<View style={styles.container}>
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

                <BottomModal
                  visible={this.state.bottomModalAndTitle}
                  onTouchOutside={() => this.setState({ bottomModalAndTitle: false })}
                  height={0.4}
                  width={1}
                  onSwipeOut={() => this.setState({ bottomModalAndTitle: false })}
                  // modalTitle={
                  //   <ModalTitle
                  //     title="Bottom Modal"
                  //     hasTitleBar
                  //   />
                  // }
                  >
                  <ModalContent
                    style={{
                      flex: 1,
                      backgroundColor: 'fff',
                    }}
                  >
                  <View style={{flex:1}}>
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
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.handleLoginWithFacebook}>
                      <Text>Use phone or email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.handleLoginWithFacebook}>
                      <Text>Login with facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.signInOnGoogle}>
                      <Text>Login with google</Text>
                    </TouchableOpacity>
                  </View>
                  </ModalContent>
                </BottomModal>
                
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
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
