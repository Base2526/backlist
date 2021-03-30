/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
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
  Image 
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer
import Toast, {DURATION} from 'react-native-easy-toast'

import {API_URL} from "./constants"

function Item({ item }) {
  return (
    <View style={styles.listItem}>
      <Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} />
      <View style={{alignItems:"center",flex:1}}>
        <Text style={{fontWeight:"bold"}}>{item.name}</Text>
        <Text>{item.position}</Text>
      </View>
      <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:"green"}}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

class ResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
                  offset: 0,
                  data:[],
                  loading: false
                };
  }

  componentDidMount() {
    // let { navigation, route } = this.props;
    // let key_search =  route.params.key_search;

    this.handleSearch()
  }

  handleSearch= () => {
    let { navigation, route, offset } = this.props;

    let _this = this;
    
    // if(!offset){
    //   _this.setState({spinner: true, datas:[]})
    // }else{
      _this.setState({loading: true})
    // }

    /**
      let text = '';
      switch(id){
        case '0':{
          text = 'ti:';
          break;
        }

        case '1':{
          text = 'ns:';
          break;
        }

        case '2':{
          text = 'in:';
          break;
        }
      }

      { section: '1', id: '0', title: 'ti:', ex: 'Ex. title' },
      { section: '1', id: '1', title: 'ns:', ex: 'Ex. name subname' },
      { section: '1', id: '2', title: 'in:', ex: 'Ex. 33209xxxxxx72' },

      1 : title
      2 : name
      3 : surname
      4 : detail
      5 : name & surname
    */

    let key_search = route.params.key_search;
    let type = 0;
    switch(key_search.substring(0, 3)){
      case 'ti:':{
        type = 1;
        key_search = key_search.substring(3, key_search.length)
        break;
      }

      case 'ns:':{
        type = 5;
        key_search = key_search.substring(3, key_search.length)
        break;
      }

      case 'in:':{
        type = 6;
        key_search = key_search.substring(3, key_search.length).replace(" ", "&")
        break;
      }
    }
    
    axios.post(`${API_URL}/api/search?_format=json`, {
      key_word: key_search,
      offset,
      type
    }, {
      headers: { 
        'Authorization': `Basic YWRtaW46U29ta2lkMDU4ODQ4Mzkx` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log()
      if(results.result){
        // true
        // console.log('result search : ', results);
        // console.log(results);

        let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        if(datas && datas.length > 0){

          console.log(datas)
          _this.setState({spinner: false, execution_time, data:[ ..._this.state.data, ...datas], count, loading: false});
        }else{

          _this.setState({spinner: false, loading: false})
          // alert('Empty result.');

          _this.toast.show('Empty result.');
        }
        
      }else{
        // false
        console.log(results);

        // _this.setState({spinner: false, loading: false})
      }
    })
    .catch(function (error) {

      // _this.setState({spinner: false, loading: false})

      console.log(error);
    });
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
    let {data} = this.state
    return (<View style={styles.container}>
              <FlatList
                style={{flex:1}}
                data={data}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtrac
                tor={(item, index) => String(index)}
                ListFooterComponent={this.renderFooter()}/>
              <Toast
                ref={(toast) => this.toast = toast}
                position='bottom'
                positionValue={220}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}/>
            </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  listItem:{
    margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"80%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  }
});

const mapStateToProps = state => {
  return{
    user: state.user.data
  }
}

export default connect(mapStateToProps, null)(ResultScreen)
