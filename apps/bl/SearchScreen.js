/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, } from 'react';
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
  Animated,
  Platform,
  FlatList
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

import {API_URL, API_TOKEN} from "@env"

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import Toast, {DURATION} from 'react-native-easy-toast'

import { NumberFormat } from './Utils'

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {key_word: "", 
                  spinner: false, 
                  
                  execution_time:'', 
                  count:'',
                  datas:[], 
                  offset: 0,
                
                  loading: false}

    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount(){
  }

  handleSearch= () => {
    let {key_word, offset} = this.state
    console.log(key_word)

    let _this = this;
    if(key_word.trim() == ""){
      alert('กรุณากรอกคำค้น.');
    }else if(key_word.trim().length < 4){
      alert('ต้องมากกว่า 3 ตัวอักษร');
    }else{
      if(!offset){
        _this.setState({spinner: true, datas:[]})
      }else{
        _this.setState({loading: true})
      }
      
      axios.post(`${API_URL}/api/search?_format=json`, {
        key_word,
        offset
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
          console.log('true');
          // console.log(results);
  
          let {execution_time, datas, count} = results;
          // console.log(execution_time);
          // console.log(count);
          // console.log(datas);

          if(datas && datas.length > 0){

            console.log(datas)
            _this.setState({spinner: false, execution_time, datas:[ ..._this.state.datas, ...datas], count, loading: false});
          }else{

            _this.setState({spinner: false, loading: false})
            // alert('Empty result.');

            _this.toast.show('Empty result.');
          }
          
        }else{
          // false
          console.log(results);

          _this.setState({spinner: false, loading: false})
        }
      })
      .catch(function (error) {

        _this.setState({spinner: false, loading: false})

        console.log(error);
      });
    }
  }

  renderItem = (item) =>{
    console.log(item.id)
    const { navigation } = this.props;
    return (
        <TouchableOpacity 
            key={item.id}
            style={{padding:5}}
            onPress={()=>{
              navigation.navigate('detail', {data:item})
            }}
          >
          {/* <Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} /> */}
          <View style={{ flex:1, backgroundColor:'#fff', padding:10 }}>
            {/*      'name'    => $name, 
                      'surname' => $surname,  */}
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
              {/* <Text>{item.name} {item.surname}</Text> */}

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
              <Text style={{color:'gray'}}>{NumberFormat(Number(item.transfer_amount))}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text style={{color:'gray'}}>{item.transfer_date ==='' ? '-' : item.transfer_date}</Text>
                </View>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
              <Text style={{color:'gray'}}>{item.detail}</Text>
            </View>
            
          </View>
          {/* <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"green"}}>Call</Text>
          </TouchableOpacity> */}
        </TouchableOpacity>
      );
  }

  renderFooter = () => {
    let {loading, offset} = this.state
    return (
      //Footer View with Load More button
      <TouchableOpacity
          activeOpacity={0.9}
          onPress={()=>{

            // this.setState({offset: offset+1})
            this.setState({
              offset: offset+1
            },() => {
              this.handleSearch();
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

  render(){
    const { navigation } = this.props;

    let {datas, execution_time, count} = this.state

    let v = <View />
    if(datas && datas.length){
      v = <View style={{flex:1}}>
          <Text style={{padding:5}}>Search time : {execution_time} / {count}</Text>
          {/* <Text>Count : {count}</Text> */}
          <FlatList
                style={{flex:1}}
                data={datas}
                renderItem={({ item }) => this.renderItem(item)}
  
                ListFooterComponent={this.renderFooter()}
                keyExtractor={(item, index) => String(index)}
            />
          </View>
    }
    return (
            <SafeAreaView style={{flex:1, marginTop:10}}>
            <View style={styles.container}>
              <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}/>  
               <TextInput
                style={{height: 40, 
                        borderWidth: .5,
                        paddingTop: 10}}
                ref= {(el) => { this.key_word = el; }}
                onChangeText={(key_word) => this.setState({key_word})}
                value={this.state.key_word}
                placeholder="มากกว่า 3 ตัวอักษร"
                onSubmitEditing={
                  this.handleSearch
                }/>            
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSearch}>
                <Text>Search</Text>
              </TouchableOpacity>
              {/*  execution_time:'', 
                  count:'', */}
              
              { v }

              <Toast
                ref={(toast) => this.toast = toast}
                position='bottom'
                positionValue={220}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                />
            </View>
            </SafeAreaView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10
  },
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
  engine: {
    position: 'absolute',
    right: 0,
  },
//   body: {
//     backgroundColor: Colors.white,
//   },
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
  footer: {
    // color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

export default SearchScreen;
