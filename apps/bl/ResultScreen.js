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

import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer
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
                  data:[/*
                    {
                        "name": "Miyah Myles",
                        "email": "miyah.myles@gmail.com",
                        "position": "Data Entry Clerk",
                        "photo": "https:\/\/images.unsplash.com\/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6"
                    },
                    {
                        "name": "June Cha",
                        "email": "june.cha@gmail.com",
                        "position": "Sales Manager",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/44.jpg"
                    },
                    {
                        "name": "Iida Niskanen",
                        "email": "iida.niskanen@gmail.com",
                        "position": "Sales Manager",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/68.jpg"
                    },
                    {
                        "name": "Renee Sims",
                        "email": "renee.sims@gmail.com",
                        "position": "Medical Assistant",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/65.jpg"
                    },
                    {
                        "name": "Jonathan Nu\u00f1ez",
                        "email": "jonathan.nu\u00f1ez@gmail.com",
                        "position": "Clerical",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/men\/43.jpg"
                    },
                    {
                        "name": "Sasha Ho",
                        "email": "sasha.ho@gmail.com",
                        "position": "Administrative Assistant",
                        "photo": "https:\/\/images.pexels.com\/photos\/415829\/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb"
                    },
                    {
                        "name": "Abdullah Hadley",
                        "email": "abdullah.hadley@gmail.com",
                        "position": "Marketing",
                        "photo": "https:\/\/images.unsplash.com\/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=a72ca28288878f8404a795f39642a46f"
                    },
                    {
                        "name": "Thomas Stock",
                        "email": "thomas.stock@gmail.com",
                        "position": "Product Designer",
                        "photo": "https:\/\/tinyfac.es\/data\/avatars\/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg"
                    },
                    {
                        "name": "Veeti Seppanen",
                        "email": "veeti.seppanen@gmail.com",
                        "position": "Product Designer",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/men\/97.jpg"
                    },
                    {
                        "name": "Bonnie Riley",
                        "email": "bonnie.riley@gmail.com",
                        "position": "Marketing",
                        "photo": "https:\/\/randomuser.me\/api\/portraits\/women\/26.jpg"
                    }
                    */
                ]
                };
  }

  componentDidMount() {
    // let { navigation, route } = this.props;
    // let key_search =  route.params.key_search;
  }

  handleSearch= () => {
    let { navigation, route, user } = this.props;

    let _this = this;
    
    // if(!offset){
    //   _this.setState({spinner: true, datas:[]})
    // }else{
      _this.setState({loading: true})
    // }
    
    axios.post(`${API_URL}/api/search?_format=json`, {
      key_word: route.params.key_search,
      offset
    }, {
      headers: { 
        'Authorization': `Basic ${user.basic_auth}` 
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log()
      if(results.result){
        // true
        console.log('results : ', results);
        // console.log(results);

        // let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        // if(datas && datas.length > 0){

        //   console.log(datas)
        //   _this.setState({spinner: false, execution_time, datas:[ ..._this.state.datas, ...datas], count, loading: false});
        // }else{

        //   _this.setState({spinner: false, loading: false})
        //   // alert('Empty result.');

        //   _this.toast.show('Empty result.');
        // }
        
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

  render(){
    let {data} = this.state
    return (<View style={styles.container}>
              <FlatList
                style={{flex:1}}
                data={data}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.email}
              />
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
