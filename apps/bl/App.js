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
  BackHandler
} from 'react-native';

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

import { getUniqueId, getVersion } from 'react-native-device-info';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import ResultScreen from './ResultScreen';
import AddBanlistScreen from './AddBanlistScreen';
import DetailScreen from './DetailScreen'
import LoginScreen from './LoginScreen'
import FilterScreen from './FilterScreen'

import SearchScreen2 from './SearchScreen2'


import MeScreen from './MeScreen'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Profile from './Profile1/index'
import MyPost from './MyPost'
import MyFollowing from './MyFollowing'

import SettingsScreen from './SettingsScreen'
import ReportScreen from './ReportScreen'

import {API_URL_SOCKET_IO} from "@env"

import Toast, {DURATION} from 'react-native-easy-toast'

import { Base64, checkLogin, isEmpty} from './Utils'

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MeStack = createStackNavigator();

const ProfileStack = createStackNavigator()

function HomeStackScreen({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (  routeName == "result" || 
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
          component={SearchScreen2}
          options={{headerShown:false}}
        />
        <HomeStack.Screen 
          name="result" 
          component={ResultScreen}
          // options={{ title: 'Result Search',  }}
          options={{
            title: 'Result',
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
          routeName == 'myfollowing' ){
        navigation.setOptions({tabBarVisible: false});
    }else {
        navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);

  return (
    <MeStack.Navigator>
        {/* <MeStack.Screen 
          name="me" 
          component={Profile} 
          options={{ title: 'Me', tabBarVisible: false, }}
        />
        <MeStack.Screen 
          name="forgot_password" 
          component={ForgotPassword} 
          options={{ title: 'Forgot password' }}
        />
        <MeStack.Screen 
          name="sign_up" 
          component={SignUp} 
          options={{ title: 'Sign Up' }}
        /> */}

        {/* Profile */}
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
          name="myfollowing" 
          component={MyFollowing}
          options={{
            title: 'My Following',
            tabBarVisible: false,
          }}
        />

        {/*  */}
    </MeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <ProfileStack.Screen 
        options={{ title: 'Profile', tabBarVisible: false, }}
        name="Profile" component={Profile} 
      />
    </ProfileStack.Navigator>
  )
}

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

    console.log(API_URL_SOCKET_IO)
    this.onSocket()

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton());
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
    console.log(API_URL_SOCKET_IO)
    let cL = await checkLogin()
    if(!isEmpty(cL)){    
      this.socket = io(API_URL_SOCKET_IO, { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${Base64.btoa(getUniqueId())}&version=${getVersion()}&uid=${cL.uid}` });
    }else{
      this.socket = io(API_URL_SOCKET_IO, { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${Base64.btoa(getUniqueId())}&version=${getVersion()}` });
    }
    
    this.socket.on('message', (data)=>{
      console.log('message>')
      console.log(data)
      console.log('<message')
    });

    this.socket.on('FromAPI', (data)=>{
      console.log('FromAPI>')
      console.log(data)
      console.log('<FromAPI')
    })
  }

  render(){
    return(
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
            // listeners={({ navigation, route }) => ({
            //   tabPress: e => {
            //     // e.preventDefault(); // Use this to navigate somewhere else
            //     console.log("button pressed : Home")
            //   },
            // })}
            />
          <Tab.Screen 
            name="Setting" 
            component={MeStackScreen} 
            // listeners={({ navigation, route }) => ({
            //   tabPress: e => {
            //     // e.preventDefault(); // Use this to navigate somewhere else
            //     console.log("button pressed : Setting")
            //   },
            // })}
            />
          {/* <Tab.Screen name="Profile" component={ProfileStackScreen} /> */}
        </Tab.Navigator>

        <Toast
          ref={(toast) => this.toast = toast}
          position='bottom'
          positionValue={220}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          />

        {/* <ModalPortal /> */}
      </NavigationContainer>
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

export default App;