import React, { Component } from 'react'
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native'
import { Icon } from 'react-native-elements'
import {
  TabView,
  TabBar,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view'
import PropTypes from 'prop-types'

import Posts from './Posts'

import contactData from './contact.json'

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

const axios = require('axios');
var Buffer = require('buffer/').Buffer

import Ionicons from 'react-native-vector-icons/Ionicons';
import {API_URL, API_TOKEN} from "../constants"

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ValidateEmail } from '../Utils'

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    marginTop: 45,
  },
  indicatorTab: {
    backgroundColor: 'transparent',
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: 'row',
  },
  tabBar: {
    backgroundColor: '#EEE',
  },
  tabContainer: {
    flex: 1,
    marginBottom: 12,
  },
  tabLabelNumber: {
    color: 'gray',
    fontSize: 12.5,
    textAlign: 'center',
  },
  tabLabelText: {
    color: 'black',
    fontSize: 22.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: '#5B5A5A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
  },




  /////////////// MeScreen.js
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
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 10
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
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
})

class Profile extends Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    tabContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        words: PropTypes.string.isRequired,
        sentence: PropTypes.string.isRequired,
        paragraph: PropTypes.string.isRequired,
        image: PropTypes.string,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
        }),
      })
    ).isRequired,
  }

  static defaultProps = {
    containerStyle: {},
    tabContainerStyle: {},
  }

  state = {
    tabs: {
      index: 0,
      routes: [
        { key: '1', title: 'Posts', count: 31 },
        { key: '2', title: 'Favorite', count: 86 },
        { key: '3', title: 'Reposts', count: 95 },
        // { key: '4', title: 'followers', count: '1.3 K' },
      ],

    },
    contactData,

    name:     '', 
    password: '', 
    spinner:  false, 
    user: {},
    selectedPhotoIndex: 0,
  }

  componentDidMount(){
    GoogleSignin.configure({
      webClientId: '693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      iosClientId: '693724870615-sctm232nea5uoce5us2l5le0mj7bi77p.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    
    // this.isSignedIn()

    let _this = this
    this.readLogin().then(res => {
      console.log('this.readLogin().then(res => {');
      console.log(res);
      if(res){
        _this.setState({user: res})
      }
    });

    this.uploadProfile = this.uploadProfile.bind(this);

    this.handleLoginWithFacebook = this.handleLoginWithFacebook.bind(this)
  }

  //////////////////// MeScreen.js /////////////////////////

  readLogin = async () => {
    try {
      let user = JSON.parse(await AsyncStorage.getItem('user'))
      console.log(user)
      // JSON.parse

      if(Object.keys(user).length > 0){
        return user
      }
      return false
    } catch (e) {
      console.log('Failed to fetch the data from storage')
    }
  }

  saveLogin = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user))
      return user;
    } catch (e) {
      console.log('Failed to save the data to the storage')
    }
  }

  saveLogout = async () => {
    try {
      await AsyncStorage.setItem('user', '')
      console.log()
      console.log('Data successfully saved')
    } catch (e) {
      console.log('Failed to save the data to the storage')
    }
  }

  // isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (!!isSignedIn) {
  //     this.getCurrentUserInfo()
  //   } else {
  //     console.log('Please Login')
  //   }
  // };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // setUser(userInfo);
      console.log(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        // alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  }

  handleSearch= () => {
    console.log(this.state.name);
    console.log(this.state.surname);
    console.log(this.state.bank_account);
  }

  handleLogin= () =>{
    let {name, password} = this.state

    name = name.trim();
    password = password.trim();
    
    if(name == "" && password == ""){
      this.toast.show('Name && Password empty');
    }else if(name == ""){
      this.toast.show('Name empty');
    }else if(password == ""){
      this.toast.show('Password empty');
    }else if(!ValidateEmail(name)){
      this.toast.show('Email Field is Invalid');
    }else{
      this.setState({spinner: true});

      let _this =this

      axios.post(`${API_URL}/api/login?_format=json`, {
        name, password
      } /*, {
        headers: { 
          'Authorization': `Basic ${API_TOKEN}` 
        }
      }*/)
      .then(function (response) {
        let results = response.data
        console.log(results)
        if(results.result){
          // true
          console.log('true');
          // console.log(results);
  
          let {execution_time, user, count} = results;
          // console.log(execution_time);
          // console.log(count);
          // console.log(user);
          console.log(results);

          // if(datas && datas.length > 0){

          //   _this.setState({spinner: false, execution_time, datas:[ ..._this.state.datas, ...datas], count, loading: false});
          // }else{

          //   _this.setState({spinner: false, loading: false})
          //   alert('Empty result.');
          // }

          _this.saveLogin(user).then((user)=>{
            _this.setState({spinner: false, user})
          })          
        }else{

          _this.toast.show(results.message, 500);

          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {

        console.log(error)
        _this.setState({spinner: false})
      });
    }
  }

  handleForgotPassword= () =>{
    const { navigation } = this.props;
    navigation.navigate('forgot_password');
  }

  handleSignUp= () =>{
    const { navigation } = this.props;
    navigation.navigate('sign_up');
  }

  handleLoginWithFacebook= () =>{
    // console.log('handleLoginWithFacebook')

    let _this = this
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        console.log('handleLoginWithFacebook')
        console.log(result)
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );


          AccessToken.getCurrentAccessToken().then(
            (data) => {
                const accessToken = data.accessToken.toString()
                _this.getInfoFromToken(accessToken)
            })
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }


  handleLoginWithGoogle= () =>{
    console.log('handleLoginWithGoogle')
  }

  signInOnGoogle = async () => {

    /*
     {"idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZlZDgwZmVjNTZkYjk5MjMzZDRiNGY2MGZiYWZkYmFlYjkxODZjNzMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2OTM3MjQ4NzA2MTUtbGNxYTV2OHVxczJvNmVmMXE3ZmNrN2gwaTEyZWVhcmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2OTM3MjQ4NzA2MTUtMmhrbWtua2Uzc2o2cHVvOWM4OG5rNjdvdXV1OW04bDEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU29ta2lkIFNpbWFqYXJuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqUkh5MXdRU3d0UlZna0NqOHhzNHVqVVp4THVDWVRsdnk0WS1CVHlnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlNvbWtpZCIsImZhbWlseV9uYW1lIjoiU2ltYWphcm4iLCJsb2NhbGUiOiJlbiIsImlhdCI6MTYxNDUxOTYyMywiZXhwIjoxNjE0NTIzMjIzfQ.gMSuufqaSoYoTyyGg1FzHt75BhhA0uUQc9J8bYu_czNrvJTX1Xw4MWY5-LkIWlOldlirgYzX3-AwZTtgN5IrQUhYmPXTd2Ak3IFbIC6PQuJfFmFFUTYT1XTaQ3G4WPesUVh4bPYRloZL6mubQnOyoPDRiwF85tn9SeaH_mxmCJ1eG9ySRVw5DqcQShUQEVoPNbnigc5JxFvPH01H5IZY-PC6ccos5hjeu12wdiZKohzN6HRICI28HBgJOk2PthMBi35LB5utV4ikenyKjJaALAiCHmwaFFjtUxdc20eJC2t-IlpoyYUVO3kISE19sPxbjPAtVq5kWUne9CmlG3U0eQ", "scopes": ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/moderator"], "serverAuthCode": "4/0AY0e-g6u51BezQYun8puGWyYg6VqnMJgIT2N3SelJ7fZfj_TSojaeBOI04F-ScTxChZOWA", "user": {"email": "android.somkid@gmail.com", "familyName": "Simajarn", "givenName": "Somkid", "id": "112378752153101585347", "name": "Somkid Simajarn", "photo": "https://lh3.googleusercontent.com/a-/AOh14GjRHy1wQSwtRVgkCj8xs4ujUZxLuCYTlvy4Y-BTyg=s96-c"}}
    */
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      // setUser(userInfo)

      /*
      
      "email": "android.somkid@gmail.com",
 		"familyName": "Simajarn",
 		"givenName": "Somkid",
 		"id": "112378752153101585347",
 		"name": "Somkid Simajarn",
 		"photo": "https://lh3.go*/

      let {email, name, id, photo} = userInfo.user

      ///////////////////////

    
      this.setState({spinner: true});

      let _this =this

      
      axios.post(`${API_URL}/api/register?_format=json`, {
        type: 2,
        name,
        email,
        id,
        photo
      }/*, {
        headers: { 
          'Authorization': `Basic ${API_TOKEN}` 
        }
      }*/
      )
      .then(function (response) {
        let results = response.data
        console.log(results)
        if(results.result){
          // true
          console.log('true');
          console.log(results);

          _this.props.navigation.pop();   
          _this.setState({spinner: false})
        }else{

          _this.toast.show(results.message, 500);

          _this.setState({spinner: false})
        }
      })
      .catch(function (error) {

        console.log(error)
        _this.setState({spinner: false})
      });

      //////////////////////

    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  }

  getInfoFromToken = token => {
    let _this =this

    this.setState({spinner: true});

    const PROFILE_REQUEST_PARAMS = {
      fields: {
        // string: 'id, name,  first_name, last_name, email',
        string: 'id, name, first_name, last_name, birthday, email'
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({userInfo: result});
          console.log('result:', result);
          // result: {"first_name": "Next", "id": "10224198535420961", "last_name": "Si", "name": "Next Si"}
        
          let {name, id} = result

          axios.post(`${API_URL}/api/register?_format=json`, {
            type: 1,
            name,
            id
          }/*, {
            headers: { 
              'Authorization': `Basic ${API_TOKEN}` 
            }
          }*/
          )
          .then(function (response) {
            let results = response.data
            console.log(results)
            if(results.result){
              // true
              console.log('true');
              console.log(results);

              // _this.props.navigation.pop();   
              // _this.setState({spinner: false})
            }else{

              _this.toast.show(results.message, 500);

              _this.setState({spinner: false})
            }
          })
          .catch(function (error) {

            console.log(error)
            _this.setState({spinner: false})
          });
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };
  //////////////////// MeScreen.js ////////////////////////

  onPressPlace = () => {
    console.log('place')
  }

  handleIndexChange = index => {
    this.setState({
      tabs: {
        ...this.state.tabs,
        index,
      },
    })
  }

  renderTabBar = props => {
    return <TabBar
      indicatorStyle={styles.indicatorTab}
      renderLabel={this.renderLabel(props)}
      pressOpacity={0.8}
      style={styles.tabBar}
      {...props}
    />
  };

  renderLabel = props => ({ route }) => {
    const routes = props.navigationState.routes

    let labels = []
    routes.forEach((e, index) => {
      labels.push(index === props.navigationState.index ? 'black' : 'gray')
    })

    const currentIndex = parseInt(route.key) - 1
    const color = labels[currentIndex]

    return (
      <View>
        <Animated.Text style={[styles.tabLabelText, { color }]}>
          {route.count}
        </Animated.Text>
        <Animated.Text style={[styles.tabLabelNumber, { color }]}>
          {route.title}
        </Animated.Text>
      </View>
    )
  }

  renderScene = ({ route: { key } }) => {
    const { posts } = this.state.contactData;//this.props

    switch (key) {
      case '1':
        return <Posts containerStyle={styles.sceneContainer} posts={posts} />
      case '2':
        return <Posts containerStyle={styles.sceneContainer} posts={posts} />
      case '3':
        return <Posts containerStyle={styles.sceneContainer} posts={posts} />
      case '4':
        return <Posts containerStyle={styles.sceneContainer} posts={posts} />
      default:
        return <View />
    }
  }

  // Upload image
  onPressAddPhotoBtn = () => {
    this.ActionSheetSelectPhoto.show();
  };

  renderContactHeader = () => {
    let { avatar, bio } = this.state.contactData //this.props  
    let {name, image_url } = this.state.user
    
    return (
      <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          <TouchableOpacity 
            style={{}}
            onPress={()=>{
              // console.log('vv')
              this.onPressAddPhotoBtn()
            }
            }>
            <View>
              <Image
                style={styles.userImage}
                source={{uri: image_url}}
              />
            <Ionicons style={{position: 'absolute', right:5, bottom:5,  padding:3, borderRadius:10,borderWidth: 1, borderColor: '#fff' , overflow: 'hidden', backgroundColor:'gray'}} name="camera-outline" size={20}/>
          </View>
          </TouchableOpacity>
          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>{name}</Text>
          </View>
          {/* <View style={styles.userBioRow}>
            <Text style={styles.userBioText}>{bio}</Text>
          </View> */}
        </View>
        {/* 
        <View style={styles.socialRow}>
          <View>
            <Icon
              size={30}
              type="entypo"
              color="#3B5A98"
              name="facebook-with-circle"
              onPress={() => console.log('facebook')}
            />
          </View>
          <View style={styles.socialIcon}>
            <Icon
              size={30}
              type="entypo"
              color="#56ACEE"
              name="twitter-with-circle"
              onPress={() => console.log('twitter')}
            />
          </View>
          <View>
            <Icon
              size={30}
              type="entypo"
              color="#DD4C39"
              name="google--with-circle"
              onPress={() => console.log('google')}
            />
          </View>
        </View>
       */}
      </View>
    )
  }

  onActionSelectPhotoDone = index => {
    switch (index) {
      
      case 0:
        ImagePicker.openCamera({}).then(image => {
          // this.setState({
          //   localPhotos: [...this.state.localPhotos, image]
          // });
          this.uploadProfile(image);
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: false,
          maxFiles: 10,
          mediaType: 'photo'
        }).then(image => {
          // images.forEach((image) => {
          //   console.log(image)
          //   this.setState({
          //     localPhotos: [...this.state.localPhotos, image]
          //   });
          // });

          console.log(image)

          this.uploadProfile(image);
        }).catch(error => {
          console.log(JSON.stringify(error));
        });
        break;
      default:
        break;
    }
  };

  uploadProfile = (image) =>{
    console.log('uploadProfile');

    let {uid} = this.state.user

    this.setState({spinner: true});
    let _this = this

    let {path, mime} = image

    const data = new FormData();
    data.append('uid', uid);
    data.append('file', {
      uri: path,
      type: mime,
      name: path.substring(path.lastIndexOf('/')+1)
    });

    

    axios.post(`${API_URL}/api/update_profile?_format=json`, data, {
      headers: { 
        'Authorization': `Basic ${API_TOKEN}` ,
        'content-type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      let results = response.data
      console.log(results)
      
      if(results.result){
      //   // true
      //   console.log('true');
      //   console.log(results);
      //   _this.setState({spinner: false})

      //   _this.toast.show('เพิ่มรายงานเรียบร้อย');

      //   _this.props.navigation.pop();        
      // }else{
      //   // false
      //   console.log('false');

      // _this.setState({spinner: false})

      //   _this.toast.show('ไม่สามารถเพิ่มรายงาน');
      // }

        let user = _this.state.user
        user.image_url = results.image_url
        _this.saveLogin(user).then((user)=>{
          _this.setState({spinner: false, user})
        })
      }   
    })
    .catch(function (error) {
      _this.setState({spinner: false})
      _this.toast.show('ไม่สามารถเพิ่มรายงาน');
      console.log(error);
    });
    
  }

  render() {

    let {user} = this.state

    const { route, navigation } = this.props;
    let _this = this
    let _menu = null;

    if(Object.keys(user).length > 0){

      // navigation.setOptions({
      //   headerRight: () => (
      //     <View style={{flexDirection:'row'}}>
      //       <View style={{marginRight: 5}}>
      //           <Menu
      //           ref={(ref) => (_menu = ref)}
      //           button={
      //               <TouchableOpacity 
      //                   style={{ marginHorizontal: 10 }}
      //                   onPress={()=>{
      //                       _menu.show()
      //               }}>
      //               <MaterialIcons name="more-vert" size={25} color={'grey'}  />
      //               </TouchableOpacity>
      //           }>

      //           <MenuItem onPress={() => {
      //             _menu.hide();
                    
      //           }}>
      //              <View style={{flexDirection:'row', alignItems: 'center',}}>
      //                 <MaterialIcons style={{padding:5}} name="cached" size={20} color={'grey'}  />
      //                 <Text>Refresh</Text>
      //             </View>
      //           </MenuItem>
      //           <MenuItem onPress={() => {
      //               _menu.hide();
                    
      //               Alert.alert(
      //                 "Message",
      //                 "Are you sure logout?",
      //                 [
      //                   {
      //                     text: "Cancel",
      //                     onPress: () => console.log("Cancel Pressed"),
      //                     style: "cancel"
      //                   },
      //                   { text: "OK", onPress: () => {
      //                     _this.saveLogout().then(()=>{
      //                       _this.setState({user: {}})
      //                     })
      //                   } 
      //                   }
      //                 ],
      //                 { cancelable: false }
      //               );
      //           }}>
                    
      //               <View style={{flexDirection:'row', alignItems: 'center',}}>
      //                   <MaterialIcons style={{padding:5}} name="logout" size={20} color={'grey'}  />
      //                   <Text>Logout</Text>
      //               </View>
      //           </MenuItem>
      //           </Menu>
      //       </View>
      //     </View>
      //   )
      // })

      return (
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
            <Toast
              ref={(toast) => this.toast = toast}
              // style={{backgroundColor:'red'}}
              position='bottom'
              positionValue={200}
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
              // textStyle={{color:'red'}}
              />
            <View style={styles.cardContainer}>
              {this.renderContactHeader()}
              <TabView
                style={[styles.tabContainer, this.props.tabContainerStyle]}
                navigationState={this.state.tabs}
                renderScene={this.renderScene}
                renderTabBar={this.renderTabBar}
                onIndexChange={this.handleIndexChange}
              />
            </View>

            <ActionSheet
              ref={o => (this.ActionSheetSelectPhoto = o)}
              title={'Select photo'}
              options={['Take Photo...', 'Choose from Library...', 'Cancel']}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={index => {
                this.onActionSelectPhotoDone(index);
              }}/>
                
          </View>
        </ScrollView>
      )
    }else{

      navigation.setOptions({
        headerRight: () => (<View />)
      })

      return (<View style={{flex: 1,
                            paddingHorizontal: 10,
                            margin: 10}}>
                <Toast
                  ref={(toast) => this.toast = toast}
                  // style={{backgroundColor:'red'}}
                  position='bottom'
                  positionValue={200}
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}
                  // textStyle={{color:'red'}}
                  />
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}/> 

                <Text>Email</Text>
                <TextInput
                  style={{height: 40,
                          borderWidth: .5,}}
                  ref= {(el) => { this.name = el; }}
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}/>
                <Text>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  style={{height: 40, 
                          borderWidth: .5,}}
                  ref= {(el) => { this.password = el; }}
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}/>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleLogin}>
                  <Text>Login</Text>
                </TouchableOpacity>

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
                  <Text>Login with facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.signInOnGoogle}>
                  <Text>Login with google</Text>
                </TouchableOpacity>
              </View>)

    }
  }
}

export default Profile
