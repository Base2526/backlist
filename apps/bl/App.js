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

// import { ModalPortal } from 'react-native-modals';

import Ionicons from 'react-native-vector-icons/Ionicons';
const axios = require('axios');
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchBar } from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen'
import io from 'socket.io-client';
var Buffer = require('buffer/').Buffer

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import { getUniqueId, getVersion } from 'react-native-device-info';

import HomeScreen from './HomeScreen';
// import SearchScreen from './SearchScreen';
import ResultScreen from './ResultScreen';
import AddBanlistScreen from './AddBanlistScreen';
import DetailScreen from './DetailScreen'
import LoginScreen from './LoginScreen'
import FilterScreen from './FilterScreen'

import SearchScreen from './SearchScreen'

import MeScreen from './MeScreen'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Profile from './Profile1/Profile'
import MyPost from './MyPost'
import MyFollowUps from './MyFollowUps'
import FollowUp from './FollowUp'

import SettingsScreen from './SettingsScreen'
import ReportScreen from './ReportScreen'
import Notification from './Notification'

import Test from './Test'

import {API_URL_SOCKET_IO} from "./constants"

import Toast, {DURATION} from 'react-native-easy-toast'

import { Base64, checkLogin, isEmpty} from './Utils'

import {store, persistor} from './reduxStore'

import { fetchProfile, followUp, fetchMyApps, followerPost } from './actions/user';
import { testFetchData, clearData } from './actions/app'

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MeStack = createStackNavigator();

const ProfileStack = createStackNavigator()

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
                    
                      ) ,
                      
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

        {/* LoginScreen */}
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
          routeName == 'test' ){
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
          // options={{ title: 'Result Search',  }}
          options={{
            title: 'Login',
            tabBarVisible: false,
          }}
        />
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
    </MeStack.Navigator>
  );
}

let socket;
let interval;
class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      isloggedin: false,
      backPressed: 0
    }
  }

  componentDidMount() {
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
      console.log('setInterval');
    }, 1000 * 60);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton());

    this.offSocket()

    clearInterval(interval)
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
    let cL = this.props.user
    console.log('API_URL_SOCKET_IO : ', API_URL_SOCKET_IO())
    if(!isEmpty(cL)){    
      socket = io(API_URL_SOCKET_IO(), { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${getUniqueId()}&version=${getVersion()}&uid=${cL.uid}` });
    }else{
      socket = io(API_URL_SOCKET_IO(), { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${getUniqueId()}&version=${getVersion()}` });
    }
    socket.on('message', this.onSocketMessage);
    socket.on('update_profile', this.onSocketUpdateProfile)
    socket.on('follow_up', this.onSocketFollowUp)
    socket.on('my_apps', this.onSocketMyApps)
    socket.on('follower_post', this.onFollowerPost)
  }

  offSocket = () =>{
    if(isEmpty(socket)){
      return ;
    }
    socket.off('message', this.onSocketMessage);
    socket.off('update_profile', this.onSocketUpdateProfile)
    socket.off('follow_up', this.onSocketFollowUp)
    socket.off('my_apps', this.onSocketMyApps)
    socket.off('follower_post', this.onFollowerPost)
  }

  onSocketMessage = (data) => {

    console.log('onSocketMessage >>>> ')
    console.log(data)
  }

  onSocketUpdateProfile = (data) => {
    console.log('onSocketUpdateProfile >>>> ')
    this.props.fetchProfile(this.props.user.basic_auth)
  }

  onSocketFollowUp = (data) => {
    console.log('onSocketFollowUp >>>> ')
    this.props.followUp(JSON.parse(data))
  }

  onSocketMyApps = (data) => {
    console.log('onSocketMyApps >>>> ')
    this.props.fetchMyApps(this.props.user.basic_auth)
  }

  onFollowerPost = (data) => {
    console.log('onFollowerPost >>>> ', JSON.parse(data))
    this.props.followerPost(JSON.parse(data))
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
    tests: state.app.tests
  }
}

const mapDispatchToProps = {
  fetchProfile,
  followUp,
  fetchMyApps,
  followerPost,

  testFetchData,
  clearData
}

export default connect(mapStateToProps, mapDispatchToProps)(App)