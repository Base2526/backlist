/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useLayoutEffect}  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Button,
  Platform,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
const axios = require('axios');
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen'
import io from 'socket.io-client';
var Buffer = require('buffer/').Buffer
import { getUniqueId, getVersion } from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo";
import HomeScreen from './HomeScreen';
import ResultScreen from './ResultScreen';
import AddBanlistScreen from './AddBanlistScreen';
import DetailScreen from './DetailScreen'
import LoginScreen from './LoginScreen'
import FilterScreen from './FilterScreen'
import SearchScreen from './SearchScreen'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Profile from './Profile1/Profile'
import MyPost from './MyPost'
import MyFollowUps from './MyFollowUps'
import FollowUp from './FollowUp'

import SettingsScreen from './SettingsScreen'
import ReportScreen from './ReportScreen'
import Notification from './Notification'

import EditName from './EditName'

import Test from './Test'

import {API_URL, API_URL_SOCKET_IO} from "./constants"

import Toast, {DURATION} from 'react-native-easy-toast'

import { Base64, isEmpty} from './Utils'
import {store, persistor} from './reduxStore'

import { fetchProfile, followUp, fetchMyApps, followerPost, ___followUp, netInfo, addfollowerPost, onNotifications } from './actions/user';
import { fetchData, testFetchData, clearData } from './actions/app'

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MeStack = createStackNavigator();

function HomeStackScreen({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (  routeName == "result_search" || 
          routeName == "add_banlist" || 
          routeName == "search" || 
          routeName == "detail" ||
          routeName == "login" ||
          routeName == "forgot_password" ||
          routeName == "sign_up" ||
          routeName == "report" ||
          routeName == "filter" ){
        navigation.setOptions({tabBarVisible: false});
    }else {
        navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);

  return (
    <HomeStack.Navigator
        headerMode="screen">
        <HomeStack.Screen
          name="home"
          component={HomeScreen} 
          options={{  title: '', 
                      headerShown: true, 
                      headerBackTitle: 'Back', 
                      // headerMode: "screen",
                      headerRight: () => (
                        <TouchableOpacity 
                          style={{ marginHorizontal: 10 }}
                          onPress={()=>{
                            navigation.navigate('search')
                          }}>
                          <Ionicons name="search-outline" size={28}  />
                        </TouchableOpacity>
                    
                      )
          }}
        />
        <HomeStack.Screen
          name="search"
          component={SearchScreen}
          options={{
            title: 'Search',
            headerShown:false
          }}
        />
        <HomeStack.Screen 
          name="result_search" 
          component={ResultScreen}
          // options={{ title: 'Result Search',  }}
          options={{
            title: 'Result search',
            tabBarVisible: false,
          }}
        />
        <HomeStack.Screen 
          name="add_banlist" 
          component={AddBanlistScreen} 
          options={{ title: 'Add Banlist' }}
        />
        <HomeStack.Screen 
          name="detail" 
          component={DetailScreen}
          // options={{ title: 'Result Search',  }}
          options={{
            title: 'Detail',
            tabBarVisible: false,
          }}
        />
        <HomeStack.Screen 
          name="login" 
          component={LoginScreen}
          options={{
            title: 'Login',
            tabBarVisible: false,
        }}/>
        <HomeStack.Screen 
          name="forgot_password" 
          component={ForgotPassword} 
          options={{ title: 'Forgot password' }}/>
        <HomeStack.Screen 
          name="sign_up" 
          component={SignUp} 
          options={{ title: 'Sign Up' }}/>  
        <HomeStack.Screen 
          name="report" 
          component={ReportScreen} 
          options={{ title: 'Report' }}/>  
        <HomeStack.Screen 
          name="filter" 
          component={FilterScreen} 
          options={{ title: '' }}/>  
    </HomeStack.Navigator>
  );
}

function MeStackScreen({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (  routeName == "forgot_password" || 
          routeName == "sign_up" || 
          routeName == 'login' ||
          routeName == 'inappbrowser' ||
          routeName == 'profile' ||
          routeName == 'mypost' ||
          routeName == 'myfollowups' ||
          routeName == 'detail' ||
          routeName == 'add_banlist' ||
          routeName == 'filter' ||
          routeName == 'follow_up' ||
          routeName == 'notification' ||
          routeName == 'test' ||
          routeName == 'edit_name' ){
        navigation.setOptions({tabBarVisible: false});
    }else {
        navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);

  return (
    <MeStack.Navigator>
        <MeStack.Screen 
          name="setting" 
          component={SettingsScreen} 
          options={{ title: '' }}
        />
        <MeStack.Screen 
          name="login" 
          component={LoginScreen}
          options={{
            title: 'Login',
            tabBarVisible: false,
          }}
        />
        <MeStack.Screen 
          name="forgot_password" 
          component={ForgotPassword} 
          options={{ title: 'Forgot password' }}/>
        <MeStack.Screen 
          name="sign_up" 
          component={SignUp} 
          options={{ title: 'Sign Up' }}/>  

        <MeStack.Screen 
          name="profile" 
          component={Profile}
          // options={{ title: 'Result Search',  }}
          options={{
            title: 'My Account',
            tabBarVisible: false,
          }}
        />
        <MeStack.Screen 
          name="mypost" 
          component={MyPost}
          options={{
            title: 'My Post',
            tabBarVisible: false,
          }}
        />
        <MeStack.Screen 
          name="myfollowups" 
          component={MyFollowUps}
          options={{
            title: 'My follow up',
            tabBarVisible: false,
          }}
        />
        <MeStack.Screen 
            name="detail" 
            component={DetailScreen}
            // options={{ title: 'Result Search',  }}
            options={{
              title: 'Detail',
              tabBarVisible: false,
            }}
          />
        <MeStack.Screen 
          name="add_banlist" 
          component={AddBanlistScreen} 
          options={{ title: 'Add Banlist' }}
        />
        <MeStack.Screen 
          name="filter" 
          component={FilterScreen} 
          options={{ title: '' }}/>  
        <MeStack.Screen 
          name="follow_up" 
          component={FollowUp} 
          options={{ title: '' }}/>  

        <MeStack.Screen 
          name="notification" 
          component={Notification} 
          options={{ title: 'Notification' }}/>  

          {/* Test */}
        <MeStack.Screen 
          name="test" 
          component={Test} 
          options={{ title: 'test' }}/>  

            {/* EditName */}
        <MeStack.Screen 
          name="edit_name" 
          component={EditName} 
          options={{ title: 'EditName' }}/>  
    </MeStack.Navigator>
  );
}

let socket;
let interval;
let unsubscribeNetInfo;
class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      isloggedin: false,
      backPressed: 0
    }
  }

  async componentDidMount() {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

    this.offSocket()

    this.onSocket()   

    let {clearData} = this.props

    clearData()

    // const interval = setInterval(() => {
    //   let {testFetchData, tests} = this.props
    //   // console.log('This will run every five second! : ', tests);

    //   let min = 1;
    //   let max = 10000000;
    //   let rand = Math.floor( min + Math.random() * (max - min) );
    //   // testFetchData
    //   if(tests.length < 5){
    //     tests = [...tests, {id: rand, value: rand}]
    //     testFetchData(tests)
    //     console.log('tests : ', tests)
    //   }else{
    //     min = 0;
    //     max = 5;
    //     rand = Math.floor( min + Math.random() * (max - min) );
    //     let markers = [ ...tests ];
    //     markers[rand] = {...markers[rand], value: Math.random() * Math.random() };
    //     // this.setState({ markers });
    //     console.log('markers : >>>>>>>>>>>>>>>>>>> ', markers[rand], rand)
    //     testFetchData(markers)
    //   }
    // }, 10000);

    interval = setInterval(() => {
      const {user, ___follow_ups, net_info} = this.props

      console.log('user-net_info: ', user, net_info)
      if(!net_info.isConnected || isEmpty(user)){
        console.log('Not connect internet OR Without login.')
        return ;
      }

      const follow_ups = ___follow_ups.filter(item=> { return item.local })
      console.log('setInterval ___follow_ups  count : ', follow_ups.length);

      axios.post(`${API_URL_SOCKET_IO()}/api/___follow_up`
                    ,{ uid:user.uid, follow_ups }
                    ,{ headers: {'Content-Type': 'application/json',}})
                    .then(function (response) {
                      let {result, message} = response.data
                      console.log('result, message :', result, message)
                    })
                    .catch(function (error) {
                      console.log('error :', error)
                    });

      // post_test
    }, 2000 * 60 );


    // historys.removeItem('init_app')
    // // historys.setItem('init_app', true);

    // console.log('init_app : >>>>>>>>>>>>>>> ', await historys.getItem('first_install')) 

    // console.log('firstInstall : >>>> ',  await this.firstInstall())


    // Subscribe
    unsubscribeNetInfo = NetInfo.addEventListener(state => {
      // console.log("Connection state", state);
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      this.props.netInfo(state)
    });

    // console.log("--------------->")
    // this.props.onNotifications([{"id":"1", "type":"1"}, {"id":"2", "type":"1"}, {"id":"3", "type":"1"}])
    // console.log("<---------------")
  }

  // firstInstall= async () =>{
  //   historys.removeItem('first_install')
  //   let is_first = await historys.getItem('first_install')
  //   if(isEmpty(is_first)){
  //     historys.setItem('first_install', true);

  //     return true
  //   }
  //   return false
  // }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton());

    this.offSocket()

    clearInterval(interval)

    unsubscribeNetInfo()
  }

  handleBackButton(){
    let {backPressed} = this.state
    if(backPressed > 0){
      this.setState({backPressed: 0})
      BackHandler.exitApp();
    }else {
      this.setState({backPressed: backPressed+1 })
      this.toast.show('Press Again To Exit');
      setTimeout( () => { 
        this.setState({backPressed: 0})
      }, 2000);
    }

    return true;
  }

  // https://github.com/vinnyoodles/react-native-socket-io-example/blob/master/client/index.js
  onSocket = async () =>{
    // let API_URL_SOCKET_IO='http://localhost:3000'
    let {user} = this.props
    // console.log('API_URL_SOCKET_IO : ', API_URL_SOCKET_IO())

    if(!isEmpty(user)){    
      socket = io(API_URL_SOCKET_IO(), { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${getUniqueId()}&version=${getVersion()}&uid=${user.uid}` });
      this.onSycNodeJs()
    }else{
      socket = io(API_URL_SOCKET_IO(), { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${getUniqueId()}&version=${getVersion()}` });
    }

    socket.on('message', this.onSocketMessage);
    socket.on('update_profile', this.onSocketUpdateProfile)
    socket.on('follow_up', this.onSocketFollowUp)
    socket.on('___follow_up', this.onSocket___FollowUp)
    socket.on('my_apps', this.onSocketMyApps)
    socket.on('follower_post', this.onFollowerPost)

    socket.on('notification_center', this.onNotificationCenter)
  }

  offSocket = () =>{
    if(isEmpty(socket)){
      return ;
    }
    
    socket.off('message', this.onSocketMessage);
    socket.off('update_profile', this.onSocketUpdateProfile)
    socket.off('follow_up', this.onSocketFollowUp)
    socket.off('___follow_up', this.onSocket___FollowUp)
    socket.off('my_apps', this.onSocketMyApps)
    socket.off('follower_post', this.onFollowerPost)

    socket.off('notification_center', this.onNotificationCenter)
  }

  onSocketMessage = (data) => {

    // data =  [ {"detail": "กู้เงิน", "id": 70277, "images": [], "name": "ธีรวัฒน์", "owner_id": 142, "surname": "สีใส", "title": "เงินกู้ออนไลน์", "transfer_amount": 500, "transfer_date": "2021-04-14"},
    //   {"detail": "กู้เงิน", "id": 70278, "images": [], "name": "ธีรวัฒน์", "owner_id": 142, "surname": "สีใส", "title": "เงินกู้ออนไลน์", "transfer_amount": 500, "transfer_date": "2021-04-14"},
    //   {"detail": "กู้เงิน", "id": 7027, "images": [], "name": "ธีรวัฒน์", "owner_id": 142, "surname": "สีใส", "title": "เงินกู้ออนไลน์", "transfer_amount": 500, "transfer_date": "2021-04-14"}]

    //   this.props.fetchData(data)
    console.log('onSocketMessage >>>> ')
    console.log(data)
  }

  onSocketUpdateProfile = (data) => {
    console.log('onSocketUpdateProfile >>>> ')
    this.props.fetchProfile(this.props.user.basic_auth)
  }

  onSocketFollowUp = (data) => {
    console.log('onSocketFollowUp >>>> ')
    // this.props.followUp(JSON.parse(data))
  }

  onSocket___FollowUp = (data) => {
    console.log('onSocket___FollowUp >>>> ')
    this.props.___followUp(JSON.parse(data), 1)
  }

  onSocketMyApps = (data) => {
    console.log('onSocketMyApps >>>> ')
    this.props.fetchMyApps(this.props.user.basic_auth)
  }

  onFollowerPost = (data) => {
    console.log('onFollowerPost >>>> ', JSON.parse(data))
    this.props.followerPost(JSON.parse(data))
  }

  onNotificationCenter = (data) =>{
    console.log('onNotificationCenter >>>> ', JSON.parse(data))
  }

  /*
  Syc current data when open first
  */
  onSycNodeJs = () =>{

    let {user, ___followUp, fetchMyApps, addfollowerPost, onNotifications} = this.props

    axios.post(`${API_URL}/api/syc_nodejs?_format=json`
              , {}
              , { headers: {'Authorization': `Basic ${user.basic_auth}` } })
    .then(function (response) {
        let results = response.data
        console.log('onSycNodeJs : ', results)
        if(results.result){
          let {follow_ups, follower_post, notification} = results;

          console.log('--> notification', notification, JSON.parse(notification) )

          ___followUp( isEmpty(follow_ups) ? follow_ups : JSON.parse(follow_ups), 1)
          fetchMyApps(user.basic_auth)
          addfollowerPost( isEmpty(follower_post) ? follower_post : JSON.parse(follower_post))
        
          onNotifications( JSON.parse(notification) )
        }
    })
    .catch(function (error) {
        console.log('onSycNodeJs error : ', error);
    });
  }

  render(){
    if(isEmpty(store)){
      console.log('store >> ', store)
      // return <View />;
    }
    
    return(
      <View style={{flex:1}}>
        <NavigationContainer>
          <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Home') {
                return <Ionicons name={'home-outline'} size={size} color={color} />;
              } else if (route.name === 'Setting') {
                return <Ionicons name={'reorder-three-outline'} size={size} color={color} />;
              }        
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
            <Tab.Screen 
              name="Home" 
              component={HomeStackScreen}
              listeners={({ navigation, route }) => ({
                tabPress: (e) => {
                  if (navigation && navigation.isFocused()) {
                    // Call when is isFocused = TRUE
                    DeviceEventEmitter.emit('event.homeScrollToOffset', {});
                  }
                }
              })}
              />
            <Tab.Screen 
              name="Setting" 
              component={MeStackScreen} 
              listeners={({ navigation, route }) => ({
                tabPress: (e) => {
                  // e.preventDefault(); // Use this to navigate somewhere else
                  // console.log("Setting", e)
                },
              })}
              />
          </Tab.Navigator>
          <Toast
            ref={(toast) => this.toast = toast}
            position='bottom'
            positionValue={220}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}/>
        </NavigationContainer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

// export default App;
const mapStateToProps = state => {
  return{
    user: state.user.data,
    tests: state.app.tests,
    ___follow_ups: state.user.___follow_ups,

    net_info: state.user.net_info
  }
}

const mapDispatchToProps = {
  fetchProfile,
  followUp,
  fetchMyApps,
  followerPost,

  testFetchData,
  clearData,

  fetchData,

  ___followUp,
  netInfo,


  addfollowerPost,

  onNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)