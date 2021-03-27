import React, {Component, } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Linking, 
    Alert,
    StatusBar,
} from 'react-native';
  
import SettingsList from 'react-native-settings-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modal';

import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';

import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';


import {API_URL, API_TOKEN, WEB_CLIENT_ID, IOS_CLIENT_ID} from "@env"

import { ValidateEmail, isEmpty, checkLogin, logout } from './Utils'
  
class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {bottomModalAndTitle: false, 
                      isLogin:false, 
                      laps: ['1', '2', '3']}
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        navigation.setOptions({
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => console.log('Button is Pressed!') }>
                <Text style={{ fontSize: 20, paddingLeft:10}}>Setting</Text>
              </TouchableOpacity>
            )
        })

        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });

        checkLogin().then(res => {
            if(isEmpty(res)){
                this.setState({isLogin: false})
            }else{
                this.setState({isLogin: true})
            }
          })

        this.modalLogin = this.modalLogin.bind(this)
    }

    onSelect = data => {
        this.setState(data);
    };

    handleLoginWithFacebook= () =>{
        console.log('handleLoginWithFacebook')

        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function(result) {
            console.log(result)
            if (result.isCancelled) {
                console.log("Login cancelled");
            } else {
                console.log(
                "Login success with permissions: " +
                    result.grantedPermissions.toString()
                );
            }
            },
            function(error) {
            console.log("Login fail with error: " + error);
            }
        );
    }
    
    handleLoginWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo)
        // setUser(userInfo)
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

    modalLogin(){
        let { navigation } = this.props;
        return(
            <Modal
            testID={'modal'}
            isVisible={this.state.bottomModalAndTitle}
            onSwipeComplete={this.close}
            // swipeDirection={['up', 'left', 'right', 'down']}
            style={{justifyContent: 'flex-end', margin: 0,}}
            backdropOpacity={0.5}
            useNativeDriver={true}
            onBackdropPress={() => {
                this.setState({ bottomModalAndTitle: false })
            }}>
            <SafeAreaView style={{backgroundColor: 'white'}}>
            <View style={{ backgroundColor:'white', padding:10}}>

            <View style={{ flexDirection: 'column', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom:10}}>
            <Text style={{fontSize:24}}>
                Sign up for Banlist
            </Text>
            <Text style={{ textAlign: 'center', fontSize:16}}>
                Create a profile, favorite, share, report criminals and more...
            </Text>
            </View>

            <TouchableOpacity
                style={{   
                marginTop:10,      
                borderColor:'gray',
                borderWidth:.5 
                }}
                onPress={()=>{
                    this.setState({ bottomModalAndTitle: false }, ()=>{
                        navigation.navigate('login', { onSelect: this.onSelect })
                    })
                }}>
                <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
                <Ionicons name="person-outline" size={25} color={'grey'} />
                <Text style={{paddingLeft:10}}>Use phone or email</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{   
                marginTop:10,      
                borderColor:'gray',
                borderWidth:.5 
                }}
                onPress={()=>{

                this.setState({ bottomModalAndTitle: false }, ()=>{
                    this.handleLoginWithFacebook()
                })
                
                }}>
                <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
                <Ionicons name="logo-facebook" size={25} color={'grey'} />
                <Text style={{paddingLeft:10}}>Login with facebook</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{   
                marginTop:10,      
                borderColor:'gray',
                borderWidth:.5 
                }}
                onPress={()=>{

                this.setState({ bottomModalAndTitle: false }, ()=>{
                    this.handleLoginWithGoogle()
                })
                
                }}>
                <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
                <Ionicons name="logo-google" size={25} color={'grey'} />
                <Text style={{paddingLeft:10}}>Login with google</Text>
                </View>
            </TouchableOpacity>
            </View>
            </SafeAreaView>
        </Modal>
        )
    }

    sleep(timeout) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    async openLink(url) {
        let statusBarStyle=  'dark-content';
        try {
          if (await InAppBrowser.isAvailable()) {
            // A delay to change the StatusBar when the browser is opened
            const animated = true;
            const delay = animated && Platform.OS === 'ios' ? 400 : 0;
            setTimeout(() => StatusBar.setBarStyle('light-content'), delay);
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#453AA4',
              preferredControlTintColor: 'white',
              readerMode: true,
              animated,
              modalPresentationStyle: 'fullScreen',
              modalTransitionStyle: 'flipHorizontal',
              modalEnabled: true,
              enableBarCollapsing: true,
              // Android Properties
              showTitle: true,
              toolbarColor: '#6200EE',
              secondaryToolbarColor: 'black',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              // Specify full animation resource identifier(package:anim/name)
              // or only resource name(in case of animation bundled with app).
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right',
              },
              headers: {
                'my-custom-header': 'my custom header value',
              },
              hasBackButton: true,
              browserPackage: null,
              showInRecents: false
            });
            // A delay to show an alert when the browser is closed
            await this.sleep(800);
            // Alert.alert('Response', JSON.stringify(result));
          } else {
            Linking.openURL(url);
          }
        } catch (error) {
          console.error(error);
        //   Alert.alert(error.message);
        } finally {
          // Restore the previous StatusBar of the App
          StatusBar.setBarStyle(statusBarStyle);
        }
    }

    lapsList() {
        let { navigation } = this.props;

        let { isLogin } = this.state
        let laps = [{'id': 0, 'title': 'Account', 'icon_name': "person-outline" }, 
                    {'id': 1, 'title': 'Post', 'icon_name': "add-circle-outline" },
                    {'id': 2, 'title': 'Following', 'icon_name': "at-circle-outline" },
                    // {'id': 3, 'title': 'Followers', 'icon_name': "people-outline" },
                ]
                // <ion-icon name="people-outline"></ion-icon>

        if(isLogin){
            return laps.map((data) => {
                console.log(data)
                return (
                  <SettingsList.Item
                          icon={
                              <View style={styles.imageStyle}>
                                  <Ionicons name={data.icon_name} size={20} color={'grey'} />
                              </View>
                          }
                          title={data.title} 
                          itemWidth={70}
                          titleStyle={{color:'black', fontSize: 16}}
                          hasNavArrow={false}
                          onPress={()=>{
                            switch(data.id){
                                case 0:{
                                    navigation.navigate('profile')

                                    break;
                                }

                                case 1:{
                                    navigation.navigate('mypost')
                                    
                                    break;
                                }

                                case 2:{
                                    navigation.navigate('myfollowing')
                                    
                                    break;
                                }

                                case 3:{
                                     Alert.alert(
                                                "Comfirm",
                                                "Are you sure logout?",
                                                [
                                                    {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                    },
                                                    { text: "Logout", onPress: () => {
                                                        logout().then(res => {
                                                            this.setState({isLogin: false})
                                                        })
                                                    } }
                                                ]
                                                );
                                    break;
                                }
                            }
                          }}/>
                )
            })
        }
    }

    render() {
        let { navigation } = this.props;
        let { isLogin } = this.state
        
        return (
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
            <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
                <SettingsList.Item
                hasNavArrow={false}
                title='My Info'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                itemWidth={70}
                borderHide={'Both'}
                onPress={()=>{
                    if(!isLogin){
                        this.setState({bottomModalAndTitle: true})
                    }
                }}
                />

                { this.lapsList() }
               
                <SettingsList.Header headerStyle={{marginTop:-5}}/>
                <SettingsList.Item
                hasNavArrow={false}
                title='Info'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                itemWidth={70}
                borderHide={'Both'}
                />
                <SettingsList.Item
                    icon={
                        <View style={styles.imageStyle}>
                            <Ionicons name="bug-outline" size={20} color={'grey'} />
                        </View>
                    }
                    title='For developer'
                    itemWidth={70}
                    titleStyle={{color:'black', fontSize: 16}}
                    hasNavArrow={false}
                    onPress={()=>{
                        // navigation.navigate('inappbrowser')
                        this.openLink('https://banlist.info/node/151')
                    }}/>
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                        <Ionicons name="terminal-outline" size={20} color={'grey'} />
                    </View>
                }
                title='Terms of service'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                onPress={()=>{
                    // navigation.navigate('inappbrowser')
                    this.openLink('https://banlist.info/node/149')
                }}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                        <Ionicons name="information-outline" size={20} color={'grey'} />
                    </View>
                }
                hasNavArrow={false}
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                title='About'
                onPress={()=>{
                    this.openLink('https://banlist.info/node/150')
                }}
                />
               
            </SettingsList>        

            {this.modalLogin()}
      
        </View>
        );
    }
}
  
const styles = StyleSheet.create({
imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:20,
    height:24,
    justifyContent:'center'
}
});

export default SettingsScreen;