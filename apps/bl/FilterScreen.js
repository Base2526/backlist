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
import { connect } from 'react-redux';
const axios = require('axios');
var Buffer = require('buffer/').Buffer

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast'
import { getUniqueId } from 'react-native-device-info';

import Share from 'react-native-share';

import {API_URL, API_TOKEN, API_URL_SOCKET_IO} from "./constants"
import { NumberFormat, isEmpty } from './Utils'

import ModalLogin from './ModalLogin'
import {___followUp} from './actions/user'

class MyListItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {   
        const {___follow_ups, item} = this.props;
        // true = reload item, false = not reload item
    
        // T - T, F - F = 0 << use case ***
        // T - F, F - T = 1
        // return  (nextProps.follow_ups.includes(item.id) ^ follow_ups.includes(item.id))


        // console.log("item : ", item)
        // console.log("nextProps.___follow_ups : ", nextProps.___follow_ups.find(value=> String(value.id) === String(item.id)))
        // console.log("___follow_ups : ", ___follow_ups.find(value=> String(value.id) === String(item.id) ))
      
        if(isEmpty(nextProps.___follow_ups)){
            return true
        }
  
        const n = nextProps.___follow_ups.find(value=> String(value.id) === String(item.id));
        const nn = ___follow_ups.find(value=> String(value.id) === String(item.id))
  
        if( !isEmpty(n) && !isEmpty(nn) ){
            if(!(n.follow_up && nn.follow_up)){
                return true
            }
            return false
        }else if( !isEmpty(n) ){
            return true
        }else if( !isEmpty(nn) ){
            return true
        }else{
            return false
        }
    }

    isOwner = (id_check) => {
        return this.props.my_apps.includes(id_check)
    }
  
    render() {
        const { navigation, follow_ups, item, user, my_apps, ___follow_ups, ___followUp } = this.props;
        let _menu = null;
        let _this = this;

        // let { navigation, follow_ups, user } = this.props;
        // let _menu = null;
        // let _this = this

        // console.log(item)
        // console.log('follow_ups ?? : ', follow_ups, item.id )

        // console.log( '>>> 009', follow_ups.find( f => String(f) === String(item.id)) )
        return (
            <TouchableOpacity 
                key={item.id}
                style={{padding:5}}
                onPress={()=>{
                    navigation.navigate('detail', {data:item})
                }}
            >
            <View style={{flex:1, backgroundColor:'#fff' }}>
                <View style={{position:'absolute', right: 0, flexDirection:'row', padding:10, zIndex:10000 }}>
                    <TouchableOpacity 
                        style={{ padding:3,}}
                        onPress={ async ()=>{

                            // let {user, ___follow_ups, ___followUp } = _this.props;
                            // let cL = _this.props.user
                            // console.log(API_URL_SOCKET_IO(), cL.uid, item.id, getUniqueId())
                            
                            if(isEmpty(user)){
                                _this.props.updateState({ showModalLogin: true })
                            }else{

                                let follow_up = true;
                                if(!isEmpty(___follow_ups)){
                                    let find_fup = ___follow_ups.find(value => String(value.id) === String(item.id) )
                                
                                    if(!isEmpty(find_fup)){
                                        follow_up = !find_fup.follow_up
                                    }
                                }

                                if(follow_up){
                                  _this.props.toast.show("Follow up");
                                }else{
                                  _this.props.toast.show("Unfollow up");
                                }
        
                                ___followUp({"id": item.id, 
                                             "local": true, 
                                             "follow_up": follow_up, 
                                            //  "uid": cL.uid, 
                                             "unique_id": getUniqueId(), 
                                             "owner_id": item.owner_id, 
                                             "date": Date.now()}, 0);

                                /*
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

                                    // console.log('message :', message)
                                    if(result){

                                    }else{
                                        
                                    }
                                    _this.props.toast.show(message);
                                })
                                .catch(function (error) {
                                    console.log('error :', error)
                                    // _this.setState({loading: false})
                                });
                                */
                            }
                        }}>
                        {/* { !_this.isOwner(item.id) &&
                                <Ionicons 
                                name="shield-checkmark-outline" 
                                size={25} 
                                color={isEmpty(follow_ups) ? 'gray' : (isEmpty(follow_ups.find( f => String(f) === String(item.id) )) ? 'gray' : 'red')} 
                                />
                        } */}
                        { 
                            !this.isOwner(item.id) &&
                            <Ionicons 
                                name="shield-checkmark-outline" 
                                size={25} 
                                /*color={isEmpty(follow_ups.find( f => f === id )) ? 'gray' : 'red'}*/ 
                                color={isEmpty(___follow_ups) ? 'gray' : (isEmpty(___follow_ups.find( value => String(value.id) === String(item.id) && value.follow_up )) ? 'gray' : 'red')} />
                        }

                    </TouchableOpacity>
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
                                    url: API_URL + "/node/" +item.id,
                                    failOnCancel: false,
                                };

                                Share.open(shareOptions)
                                .then((res) => {
                                    // console.log(res);
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

                        <MenuItem onPress={ async () => {
                                _menu.hide();
                                
                                let cL = _this.props.user
                                if(isEmpty(cL)){
                                    // this.setState({ bottomModalAndTitle: true })
                                    _this.props.updateState({ showModalLogin: true })
                                }else{
                                    navigation.navigate('report', {data:item})
                                }
                                }} style={{flex:1, justifyContent:'center'}}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="report" size={25} color={'grey'}  />
                                <Text style={{ textAlign: 'center' }}>Report</Text>
                            </View>
                        </MenuItem>
                        </Menu>
                    </View> 
                </View>
                <View style={{ flex:1, padding:10 }}>
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
            </View>
            </TouchableOpacity>
        );
    }
}
 
class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {key_word: "", 
                    spinner: false, 
                    execution_time: '', 
                    count: '',
                    datas: [], 
                    type : 5,
                    offset: 0,
                    
                    loading: false,
                
                    showModalLogin:false}
    }
 
    componentDidMount(){
        let { route, navigation } = this.props;
        let { offset }            = this.state;
        if (route.params.data){
            // console.log(route.params.data)

            let data = route.params.data;

            this.setState({
                key_word: data.name+"&"+data.surname
            },() => {
                this.search();
            });
        }

        this.updateNavigation();
    }

    updateNavigation(){
        let { navigation, route} = this.props;

        if (route.params.data){
            // console.log(route.params.data)

            let data = route.params.data;
            navigation.setOptions({
                title: "คำค้น : " + data.name+" "+data.surname, 
            })
        }    
    }

    isOwner = (id_check) => {
        return this.props.my_apps.includes(id_check)
    }

    onUpdateState = data => {
        this.setState(data);
    }

    search = () =>{
        let {user} = this.props
        let {type, offset, key_word} = this.state

        // console.log(type, offset, key_word)

        let basic_auth = API_TOKEN;
        if(!isEmpty(user)){
            basic_auth = user.basic_auth
        }

        let _this = this;
        _this.setState({loading: true})
        
        axios.post(`${API_URL}/api/search?_format=json`, {
            type,
            key_word,
            offset
        }, {
            headers: {'Authorization': `Basic ${basic_auth}`}
        })
        .then(function (response) {
            let results = response.data
            // console.log('FilterScreen : ', results)
            if(results.result){
                // true
                // console.log('true');
                // console.log(results);
        
                let {execution_time, datas, count} = results;
                // console.log(execution_time);
                // console.log(count);
    
                if(datas && datas.length > 0){
                    _this.setState({execution_time, datas:[ ..._this.state.datas, ...datas], count, loading: false});
                }else{
                    _this.setState({loading: false})
                    _this.toast.show('Empty result.');
                }
                
            }else{
                // false
                // console.log(results);
                _this.setState({loading: false})
            }
        })
        .catch(function (error) {
            _this.setState({loading: false})
            console.log(error);
        });
    }
    
    renderItem = (item) =>{
        // let { navigation, follow_ups, user, my_apps } = this.props;
        // return <MyListItem
        //             item={item}
        //             navigation={navigation}
        //             follow_ups={follow_ups}
        //             user={user}
        //             my_apps={my_apps}
        //             toast={this.toast}
        //             updateState={this.onUpdateState}/>

        return  <MyListItem
                {...this.props}
                item={item}
                toast={this.toast}
                updateState={this.onUpdateState} />
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
    
        let {datas, execution_time, count, showModalLogin} = this.state
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
                        opacity={0.8}/>

                    { 
                        isEmpty(this.props.user)  
                        && <ModalLogin {...this.props } showModalLogin={showModalLogin} updateState={this.onUpdateState} />
                    }
                </SafeAreaView>)
    }
}
 
const styles = StyleSheet.create({
   container: {
     flex: 1,
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
 
const mapStateToProps = state => {  
    return{
      user: state.user.data,
      follow_ups: state.user.follow_ups,
      my_apps: state.user.my_apps,



      ___follow_ups: state.user.___follow_ups
    }
}

const mapDispatchToProps = {
    ___followUp
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen)
 