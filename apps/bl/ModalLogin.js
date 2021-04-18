// import React, { Component } from 'react';
import React, {useEffect, useState, useRef} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    TouchableNativeFeedback,
    TextInput,
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    Dimensions,
    DeviceEventEmitter,
    TouchableHighlightBase
  } from 'react-native';

import ReactNativeModal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default ModalLogin = (props) => {

    const mounted = useRef();
    const [showModalLogin, setShowModalLogin] = useState(props.showModalLogin);

    useEffect(() => {
        console.log('useEffect props >>> ')

        if (!mounted.current) {
            // do componentDidMount logic
            mounted.current = true;

            let { navigation, onSelect } = props;
            console.log('useEffect bottomModalAndTitle >>> ', showModalLogin, props.showModalLogin)

            console.log('props >>> ', props)
        } else {
            // do componentDidUpdate logic

            console.log('componentDidUpdate logic > ', props.showModalLogin)

            setShowModalLogin(props.showModalLogin)
        }
    }, [props])

    return (<View style={{flexDirection:'row'}}>
            <ReactNativeModal
                testID={'modal'}
                isVisible={showModalLogin}
                onSwipeComplete={this.close}
                // swipeDirection={['up', 'left', 'right', 'down']}
                style={{justifyContent: 'flex-end', margin: 0,}}
                backdropOpacity={0.5}
                useNativeDriver={true}
                onBackdropPress={() => {
                    setShowModalLogin(false)
                }}>
                <SafeAreaView style={{backgroundColor: 'white'}}>
                <View style={{ backgroundColor:'white', padding:10}}>
                <View style={{ flexDirection: 'column', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingBottom:10}}>
                    <Text style={{fontSize:20}}>Sign up for Banlist</Text>
                    <Text style={{ textAlign: 'center', fontSize:14, color:'gray'}}>
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
                        setShowModalLogin(false)
                        props.navigation.push('login', {updateState: props.updateState})
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

                    // this.setState({ bottomModalAndTitle: false }, ()=>{
                    //     this.handleLoginWithFacebook()
                    // })
                    
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

                    // this.setState({ bottomModalAndTitle: false }, ()=>{
                    //     this.handleLoginWithGoogle()
                    // })
                    
                    }}>
                    <View style={{flexDirection: 'row', alignItems: "center", padding: 10, borderRadius: 10}}>
                        <Ionicons name="logo-google" size={25} color={'grey'} />
                        <Text style={{paddingLeft:10}}>Login with google</Text>
                    </View>
                </TouchableOpacity>
                </View>
                </SafeAreaView>
            </ReactNativeModal>
            </View>
    )
}
