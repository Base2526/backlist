import React, { Component } from 'react'
import { Card, Icon } from 'react-native-elements'
import {
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
const axios = require('axios');
import Spinner from 'react-native-loading-spinner-overlay';

import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const Image = createImageProgress(FastImage);

import Email from './Email'
import Separator from './Separator'
import Tel from './Tel'

import contactData from '../profile/contact.json'
import { API_URL } from "../constants"
import { isEmpty } from '../Utils'
import { userLogout } from '../actions/user';



class Profile extends Component {
  // static propTypes = {
  //   avatar: PropTypes.string.isRequired,
  //   avatarBackground: PropTypes.string.isRequired,
  //   name: PropTypes.string.isRequired,
  //   address: PropTypes.shape({
  //     city: PropTypes.string.isRequired,
  //     country: PropTypes.string.isRequired,
  //   }).isRequired,
  //   emails: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       email: PropTypes.string.isRequired,
  //       id: PropTypes.number.isRequired,
  //       name: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  //   tels: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.number.isRequired,
  //       name: PropTypes.string.isRequired,
  //       number: PropTypes.string.isRequired,
  //     })
  //   ).isRequired,
  // }

  constructor(props) {
    super(props);
    this.state = {
        contactData:{},
        localPhotos:[],

        showSpinner:false
      }
  }

  componentDidMount() {
    let _this = this
    const { route, navigation, user} = this.props;

    console.log('user : ', user);

    navigation.setOptions({
        headerRight: () => (
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity 
              style={{ marginHorizontal: 10 }}
              onPress={()=>{
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
                        // logout().then(res => {
                        //     this.setState({isLogin: false})
                        // })
                        console.log('logout')

                        _this.props.userLogout();
                        navigation.pop();
                      }}
                  ]
                  );
              }}>
              <Ionicons name="log-out-outline" size={25} color={'grey'} />
            </TouchableOpacity>
          </View>
        )
    })

    this.setState({contactData})
    // console.log(contactData)
  }

  onPressPlace = () => {
    console.log('place')
  }

  onPressTel = number => {
    Linking.openURL(`tel://${number}`).catch(err => console.log('Error:', err))
  }

  onPressSms = () => {
    console.log('sms')
  }

  onPressEmail = email => {
    Linking.openURL(`mailto://${email}?subject=subject&body=body`).catch(err =>
      console.log('Error:', err)
    )
  }

  renderHeader = () => {

    let {email, image_url, name } = this.props.user
    // let {
    //   avatar,
    //   avatarBackground,
    //   name,
    //   address,
    //   // address: { city, country },
    // } = this.state.contactData

    // let { city, country } = address
    // console.log(avatar)
    // console.log(city, country)
    // return <View />
    // if(isEmpty(this.state.contactData)){
    //   return <View />
    // }

    // const {
    //   avatar,
    //   avatarBackground,
    //   name,
    //   address: { city, country },
    // } = this.state.contactData

    /*
    {"basic_auth": "c21pOjEyMzQ=", "email": "mr.simajarn@gmail.com", "image_url": "https://banlist.info/sites/default/files/02-27-2021_1019pm_1115734532.png", "name": "smi", "session": "VhgSAhZlPiV8dF7E-Ka2WaWAFYQ6TdQmYKZ18neqQ0A", "uid": "59"}
    */

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{uri: 'https://image.freepik.com/free-vector/blue-copy-space-digital-background_23-2148821698.jpg'}}
        >
          {/* 
          <TouchableOpacity style={{position:'absolute', right:8, bottom:8, borderColor:'white', backgroundColor:'gray', borderWidth:1, borderRadius:10, padding:3}}>
            <Ionicons name="camera-outline" size={20} color={'white'} />
          </TouchableOpacity> 
          */}
          <View style={styles.headerColumn}>
            <View style={{ justifyContent:'center', alignContent:'center' }}>
              <Image
                indicator={Progress.Pie}
                indicatorProps={{
                    size: 30,
                    borderWidth: 1,
                    color: '#ffffff',
                    // unfilledColor: 'rgba(60,14,101, 0.2)',
                }}
                style={styles.userImage}
                // containerStyle={{ ...StyleSheet.absoluteFillObject }}
                borderRadius={85}
                source={{
                    uri: image_url,
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}
                />

               {/* 
               
               userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    // marginBottom: 15,
    width: 170,
  },*/}
              <TouchableOpacity style={{position:'absolute', right:8, bottom:8, borderColor:'#A5A5A5', backgroundColor:'gray', borderWidth:1, borderRadius:10, padding:3}}
                onPress={()=>{
                  this.actionSheet.show();
                }}>
                <Ionicons name="camera-outline" size={20} color={'white'} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'center', marginTop:10 }}>
              <Text style={{ justifyContent:'center', textAlign:'center', color:'#A5A5A5', fontSize:22,  fontWeight: 'bold', }}>{name}</Text>
              <TouchableOpacity style={{justifyContent:'center', alignItems:'center', marginLeft:5 }}
                onPress={()=>{
                  // edit_name
                  // const { route, navigation, user} = this.props;

                  this.props.navigation.push('edit_name')
                }}>
                <Ionicons name="create-outline" size={20} color={'#A5A5A5'} />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="place"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View>
              <View style={styles.userCityRow }>
                <Text style={styles.userCityText}>
                  {email}
                </Text>
                <TouchableOpacity style={{ justifyContent:'center', alignItems:'center', marginLeft:5 }}>
                  <Ionicons name="create-outline" size={15} color={'white'} />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderTel = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={this.state.contactData.tels}
      renderItem={(list) => {
        const { id, name, number } = list.item

        return (
          <Tel
            key={`tel-${id}`}
            index={list.index}
            name={name}
            number={number}
            onPressSms={this.onPressSms}
            onPressTel={this.onPressTel}
          />
        )
      }}
    />
  )

  renderEmail = () => {
    let {email} = this.props.user
    let emails = [
      { "id": 1, "name": "Personal", "email": email },
      // { "id": 2, "name": "Work", "email": "elsie@work.com" }
    ];
    return (<FlatList
            contentContainerStyle={styles.emailContainer}
            data={emails}
            renderItem={(list) => {
              const { email, id, name } = list.item

              return (
                <Email
                  key={`email-${id}`}
                  index={list.index}
                  name={name}
                  email={email}
                  onPressEmail={this.onPressEmail}
                />
              )
            }}
          />)
  }

  handlePhoto = (image) =>{
    const { user } = this.props;

    let _this = this
    _this.setState({showSpinner:true})

    const data = new FormData();
    data.append('type', 2);
    data.append('file', {uri: image.path, type: image.mime, name: image.path.substring(image.path.lastIndexOf('/')+1)});
        
    axios.post(`${API_URL}/api/update_profile?_format=json`, data, 
    {
      headers: { 
        'Authorization': `Basic ${user.basic_auth}` ,
        'content-type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      let results = response.data
      // console.log('update_profile> ', results)

      console.log('update_profile> results ', results)
      
      // if(results.result){
      //     props.navigation.pop();
      // }   

      _this.setState({showSpinner:false})
    })
    .catch(function (error) {
      console.log('update_profile error > ', error)
      _this.setState({showSpinner:false})
    });
  
  }

  onActionSheet = index => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({}).then(image => {
          // console.log('images : ', index, images)
          // this.setState({
          //   localPhotos: [...this.state.localPhotos, image]
          // });

          this.handlePhoto(image)
        }).catch(error => {
          console.log('0, error > ', error)
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: false,
          maxFiles: 10,
          mediaType: 'photo'
        }).then(image => {
          console.log('image : ', image)
          // images.forEach((image) => {
          //   this.setState({
          //     localPhotos: [...this.state.localPhotos, image]
          //   });
          // });

          // this.setState({localPhotos: [images] });
          this.handlePhoto(image)
        }).catch(error => {
          console.log('1, error > ', error)
        });
        break;
      default:
        break;
    }
  };

  render() {
    if(isEmpty(this.state.contactData)){
      return <View />
    }

    let {showSpinner} = this.state
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            {this.renderHeader()}
            {/* {this.renderTel()} */}
            {/* {Separator()} */}
            {this.renderEmail()}

            {/* <View style={{padding:10}}>
              <Text style={{color:'gray', fontSize:20}}>
                  Status message
              </Text>
              <Text>
                  ddd
              </Text>
            </View> */}
          </Card>

          <ActionSheet
            ref={o => (this.actionSheet = o)}
            title={'Select photo'}
            options={['Take Photo...', 'Choose from Library...', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={index => {
              this.onActionSheet(index);
            }}/>

          <Spinner
            visible={showSpinner}
            textContent={'Wait...'}
            textStyle={styles.spinnerTextStyle}/> 
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
    backgroundColor:'gray'
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
    flexDirection:'row'
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    // marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
})

// export default Profile
// export default MyPost;
const mapStateToProps = state => {
  return{
    user: state.user.data,
  }
}

const mapDispatchToProps = {
  userLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
