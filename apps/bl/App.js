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
  Platform
} from 'react-native';

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

import MeScreen from './MeScreen'
import ForgotPassword from './ForgotPassword'
import SignUp from './SignUp'
import Profile from './profile/Profile'

import Setting from './setting/Setting'

import {API_URL_SOCKET_IO} from "@env"

import { Base64 } from './Utils'

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MeStack = createStackNavigator();

const ProfileStack = createStackNavigator()

function HomeStackScreen({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if ( routeName === "result" || routeName === "add_banlist" || routeName == "search" || routeName == "detail"){
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
          options={{  title: 'Home', 
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
          options={{  title: 'Search',  /*headerStyle: { backgroundColor: 'gray',} */ }}
          // options={{ title: 'Banlist.info' }}
          // options={{
          //   title: 'My home',
          //   // headerStyle: {
          //   //   backgroundColor: '#f4511e',
          //   // },
          //   // headerTintColor: '#fff',
          //   // headerTitleStyle: {
          //   //   fontWeight: 'bold',
          //   // },
          //   // headerRight: <Button title="Name" onPress={()=>{ navigation.navigate('viewname'); }} />,
          //   // headerLeft: (
          //   //   <TouchableOpacity style={{ marginHorizontal: 10 }}>
          //   //     <Ionicons name="ios-information-circle" size={28} color="#5751D9" />
          //   //   </TouchableOpacity>
          //   // )
          // }}

          // options={{ title: 'My Profile', 
          //            headerShown: true, 
          //            headerBackTitle: 'Back', 
          //            headerRight: () => (
          //             <TouchableOpacity 
          //               style={{ marginHorizontal: 10 }}
          //               onPress={()=>{
          //                 navigation.navigate('result')
          //               }}>
          //               <Ionicons name="search-outline" size={28} color="#5751D9" />
          //             </TouchableOpacity>
          // ) }}

          // options={{
          //   header: ({ scene, previous, navigation }) => {
          //     const { options } = scene.descriptor;
          //     const title =
          //       options.headerTitle !== undefined
          //         ? options.headerTitle
          //         : options.title !== undefined
          //         ? options.title
          //         : scene.route.name;
            
          //     return (
          //       // <MyHeader
          //       //   title={title}
          //       //   leftButton={
          //       //     previous ? <MyBackButton onPress={navigation.goBack} /> : undefined
          //       //   }
          //       //   style={options.headerStyle}
          //       // />
          //       <SafeAreaView>
          //         <SearchBar
          //           style={options.headerStyle}
          //           placeholder="Type Here..."
          //           onChangeText={()=>{

          //           }}
          //           value={''}
          //         />
          //       </SafeAreaView>
          //     );
          //   }
          // }}
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
    </HomeStack.Navigator>
  );
}

function MeStackScreen({navigation, route}) {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if ( routeName === "forgot_password" || routeName === "sign_up" || routeName == "setting" ){
        navigation.setOptions({tabBarVisible: false});
    }else {
        navigation.setOptions({tabBarVisible: true});
    }
  }, [navigation, route]);

  return (
    <MeStack.Navigator>
        <MeStack.Screen 
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
        />

        {/* Profile */}
        <MeStack.Screen 
          name="setting" 
          component={Setting} 
          options={{ title: 'Setting' }}
        />
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
  }

  componentDidMount() {
    SplashScreen.hide();

    this.onSocket()
  }

  // https://github.com/vinnyoodles/react-native-socket-io-example/blob/master/client/index.js
  onSocket = () =>{

    console.log(API_URL_SOCKET_IO)
    this.socket = io(API_URL_SOCKET_IO, { query:`platform=${Base64.btoa(JSON.stringify(Platform))}&unique_id=${Base64.btoa(getUniqueId())}&version=${getVersion()}` });
    this.socket.on('message', (data)=>{
      console.log('-message>')
      console.log(data)
      console.log('<message-')
    });
  }

  render(){
    return(
      <NavigationContainer>
        <Tab.Navigator
         screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home') {
              return <Ionicons name={'home-outline'} size={size} color={color} />;
            } else if (route.name === 'Me') {
              return <Ionicons name={'person-outline'} size={size} color={color} />;
            }        
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Me" component={MeStackScreen} />
          {/* <Tab.Screen name="Profile" component={ProfileStackScreen} /> */}
        </Tab.Navigator>
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