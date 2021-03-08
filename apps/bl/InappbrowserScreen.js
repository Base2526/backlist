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
   Image,
   Keyboard,
   Linking, 
   Alert,
   Button,
} from 'react-native';

import { InAppBrowser } from 'react-native-inappbrowser-reborn';
 
const axios = require('axios');
var Buffer = require('buffer/').Buffer

import {API_URL, API_TOKEN} from "@env"

import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'

import { ValidateEmail, isEmpty } from './Utils'
 
class InappbrowserScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: 'https://www.google.com',
            statusBarStyle: 'dark-content',
          };
    }
    
    componentDidMount() {
        // this.openLink()
    }

    sleep(timeout) {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }

    async openLink() {
        const {url, statusBarStyle} = this.state;
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
            Alert.alert('Response', JSON.stringify(result));
          } else {
            Linking.openURL(url);
          }
        } catch (error) {
          console.error(error);
          Alert.alert(error.message);
        } finally {
          // Restore the previous StatusBar of the App
          StatusBar.setBarStyle(statusBarStyle);
        }
    }

    render(){
     return (<SafeAreaView style={{flex: 1}}>
                <View>
                <Button title="Open link" onPress={() => this.openLink()} />
                </View>
             </SafeAreaView>)
    }
}
 
export default InappbrowserScreen;
 