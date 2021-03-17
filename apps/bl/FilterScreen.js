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
import Toast, {DURATION} from 'react-native-easy-toast'

import { NumberFormat } from './Utils'
 
class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {key_word: "", 
                    spinner: false, 
                    
                    execution_time:'', 
                    count:'',
                    datas:[], 
                    type : 0,
                    offset: 0,
                    
                    loading: false}
    }
 
    componentDidMount(){
        let { route, navigation } = this.props;
        let { offset }            = this.state;
        if (route.params.data){
            // console.log(route.params.data)

            let data = route.params.data;

            

            this.setState({
                type:    5,
                offset:  0,
                key_word: data.name+"&"+data.surname
            },() => {
                this.search();
            });
        }
    }

    search = () =>{
        let {type, offset, key_word} = this.state

        console.log(type, offset, key_word)

        let _this = this;
        _this.setState({loading: true})
        
        axios.post(`${API_URL}/api/search?_format=json`, {
            type,
            key_word,
            offset
        }, {
            headers: {'Authorization': `Basic ${API_TOKEN}`}
        })
        .then(function (response) {
            let results = response.data
            console.log(results)
            if(results.result){
                // true
                console.log('true');
                // console.log(results);
        
                let {execution_time, datas, count} = results;
                // console.log(execution_time);
                // console.log(count);
                // console.log(datas);
    
                if(datas && datas.length > 0){
                    _this.setState({execution_time, datas:[ ..._this.state.datas, ...datas], count, loading: false});
                }else{
                    _this.setState({loading: false})
                    _this.toast.show('Empty result.');
                }
                
            }else{
                // false
                console.log(results);
                _this.setState({loading: false})
            }
        })
        .catch(function (error) {
            _this.setState({loading: false})
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
                <Text>{item.name} {item.surname}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                <Text>{item.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                <Text>{NumberFormat(Number(item.transfer_amount))}</Text>
                </View>
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
        let {loading, offset} = this.state
        return (
        //Footer View with Load More button
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={()=>{
                this.setState({
                    offset:  offset + 1
                },() => {
                    this.search();
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
    }
 
    render(){
        const { navigation } = this.props;
    
        let {datas, execution_time, count} = this.state
        return (<SafeAreaView style={{flex:1, marginTop:10}}>
                    {datas.length > 0 && <Text style={{padding:5}}>Search time : {execution_time} / {count}</Text> }
                    
                    <View style={styles.container}>
                        <FlatList
                            style={{flex:1}}
                            data={datas}
                            renderItem={({ item }) => this.renderItem(item)}
            
                            ListFooterComponent={this.renderFooter()}
                            keyExtractor={(item, index) => String(index)}/>
                    </View>

                    <Toast
                        ref={(toast) => this.toast = toast}
                        position='bottom'
                        positionValue={220}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        />
                </SafeAreaView>)
    }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
    //  paddingHorizontal: 10
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
     marginTop: 10,
     alignItems: "center",
     backgroundColor: "#DDDDDD",
     padding: 10
   },
   spinnerTextStyle: {
     color: '#FFF'
   }
 });
 
 export default FilterScreen;
 