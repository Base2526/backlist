/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState} from 'react';
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
  Button,
  Image,
  Platform
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { connect } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

import ModalSelector from 'react-native-modal-selector'

import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';

import Toast, {DURATION} from 'react-native-easy-toast'

const axios = require('axios');
var Buffer = require('buffer/').Buffer
import {API_URL, API_TOKEN} from "./constants"
import { followUp, fetchMyApps } from './actions/user';
import {toTimestamp, isEmpty} from './Utils'

class AddBanlistScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {title: "", 
                  name: "", 
                  surname: "", 
                  id_card_number: "",
                  selling_website: "",
                  detail: "",
                  bank_account: "",
                  date:"2016-05-15",
                
                  transfer_amount: "",
                
                  itemsMerchantBankAccount : [],
                
                  selectedPhotoIndex: 0,
                  localPhotos: [],
                
                  showDateTimePicker: false,
                  currentDateTimePicker: new Date(),
                  spinner: false,

                  nid: undefined,
                  items_merchant_bank_account: [
                    {'key':1,'value': 'ธนาคารกรุงศรีอยุธยา'},
                    {'key':2,'value': 'ธนาคารกรุงเทพ'},
                    {'key':3,'value': 'ธนาคารซีไอเอ็มบี'},
                    {'key':4,'value': 'ธนาคารออมสิน'},
                    {'key':5,'value': 'ธนาคารอิสลาม'},
                    {'key':6,'value': 'ธนาคารกสิกรไทย'},
                    {'key':7,'value': 'ธนาคารเกียรตินาคิน'},
                    {'key':8,'value': 'ธนาคารกรุงไทย'},
                    {'key':9,'value': 'ธนาคารไทยพาณิชย์'},
                    {'key':10,'value': 'Standard Chartered'},
                    {'key':11,'value': 'ธนาคารธนชาติ'},
                    {'key':12,'value': 'ทิสโก้แบงค์'},
                    {'key':13,'value': 'ธนาคารทหารไทย'},
                    {'key':14,'value': 'ธนาคารยูโอบี'},
                    {'key':15,'value': 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร'},
                    {'key':16,'value': 'True Wallet'},
                    {'key':17,'value': 'พร้อมเพย์ (PromptPay)'},
                    {'key':18,'value': 'ธนาคารอาคารสงเคราะห์'},
                    {'key':19,'value': 'AirPay (แอร์เพย์)'},
                    {'key':20,'value': 'mPay'},
                    {'key':21,'value': '123 เซอร์วิส'},
                    {'key':22,'value': 'ธ.ไทยเครดิตเพื่อรายย่อย'},
                    {'key':23,'value': 'ธนาคารแลนด์แอนด์เฮ้าส์'},
                    {'key':24,'value': 'เก็บเงินปลายทาง'} 
                  ]};  
    this.onDoUploadPress = this.onDoUploadPress.bind(this);

    this.addItemsMerchantBankAccount = this.addItemsMerchantBankAccount.bind(this);
  }

  componentDidMount() {
    Moment.locale('en');
    const { route, navigation } = this.props;
    let {params} =  route;
    

    if(!isEmpty(params) && !isEmpty(params.data)){
      console.log('data >>>', params)

      let {data} = params
      let itemsMerchantBankAccount = data.banks.map((item, i)=>{
                                        return {key: 0, bank_account: item.bank_account, bank_wallet: item.bank_wallet}
                                      })


      let localPhotos = []
      if(!isEmpty(data.images)){
        localPhotos= data.images.thumbnail.map((item, i)=>{

          console.log('--------->')
          return {fid:item.fid, path: item.url}
        })
      }
      
      this.setState({
        nid: data.id,
        title: data.title, 
        name: data.name, 
        surname: data.surname, 
        id_card_number: data.id_card,
        selling_website: data.selling_website,
        detail: data.detail,
        transfer_amount: data.transfer_amount,
        date:data.transfer_date,
        itemsMerchantBankAccount,
        localPhotos
      })
    }

    console.log('this.state.nid : ', this.state.nid)

    let _this = this
    navigation.setOptions({
      headerRight: () => (
          <View style={{flexDirection:'row'}}>
              <TouchableOpacity 
                  style={{ marginHorizontal: 10 }}
                  onPress={()=>{
                    _this.handleAdd()
                  }}>
                  <Text style={{ fontSize: 18, paddingRight:10, color:'#0288D1'}}>{ !isEmpty(this.state.nid) ? 'Edit' : 'ADD'}</Text>
              </TouchableOpacity>
          </View>
        )
    })
  }

  getNavigationParams() {
    return this.props.navigation.state.params || {}
  }

  handleAdd= () => {
    let { title, 
          transfer_amount, 
          name, 
          surname, 
          id_card_number, 
          selling_website,
          currentDateTimePicker,
          detail,

          itemsMerchantBankAccount,
          localPhotos,
          nid} = this.state

    title = title.trim()
    name = name.trim()
    surname = surname.trim()
    selling_website = selling_website.trim()
    detail = detail.trim()

    if( isEmpty(title) || 
        isEmpty(transfer_amount) ||
        isEmpty(name) ||
        isEmpty(surname) ||
        isEmpty(id_card_number) ||
        isEmpty(selling_website) ||
        isEmpty(detail) ){
          
      this.toast.show('product_type or person_name or person_surname or transfer_date or detail');

      return;
    }
    
    let _this = this
    this.setState({spinner: true})

    //_this.props.navigation.goBack() ;   
    
    // const { navigation, route } = this.props;
    // navigation.goBack();
    // route.params.onSelect({ selected: true });
    // this.props.navigation.state.params.onSelect(status);
    // console.log(this.props.navigation.setParams({abc:'tes'}))

    // const { navigation } = this.props;
    // navigation.goBack();
    // navigation.state.params.onSelect({ selected: true });

    // console.log(itemsMerchantBankAccount)  
    console.log(localPhotos)

    let {basic_auth} = this.props.user

    const data = new FormData();

    data.append('nid', isEmpty(nid) ? 0 : nid );
    data.append('product_type', title);
    data.append('transfer_amount', transfer_amount);
    data.append('person_name', name);
    data.append('person_surname', surname);
    data.append('id_card_number', id_card_number);
    data.append('selling_website', selling_website);
    data.append('transfer_date', toTimestamp(currentDateTimePicker));
    data.append('detail', detail);
    data.append('merchant_bank_account', JSON.stringify(itemsMerchantBankAccount));

    localPhotos.map(buttonInfo => (
      data.append("files[]", {uri: buttonInfo.path, type: buttonInfo.mime,name: buttonInfo.path.substring(buttonInfo.path.lastIndexOf('/')+1)})
    ));
    /*
    [{"creationDate": "1255122560", 
      "cropRect": null, 
      "data": null, 
      "duration": null, 
      "exif": null, 
      "filename": "IMG_0002.JPG", 
      "height": 2848, 
      "localIdentifier": "B84E8479-475C-4727-A4A4-B77AA9980897/L0/001", 
      "mime": "image/jpeg", 
      "modificationDate": "1441224147", 
      "path": "/Users/somkidsimajarn/Library/Developer/CoreSimulator/Devices/0C039879-66BC-4294-A59C-E9A903694F96/data/Containers/Data/Application/D764C94F-953B-49DE-934D-C626A3650019/tmp/react-native-image-crop-picker/E9F93825-F91A-4B8E-9F48-6D140916879E.jpg", 
      "size": 2604768, 
      "sourceURL": "file:///Users/somkidsimajarn/Library/Developer/CoreSimulator/Devices/0C039879-66BC-4294-A59C-E9A903694F96/data/Media/DCIM/100APPLE/IMG_0002.JPG", 
      "width": 4288},
      {"creationDate": "1522437259", "cropRect": null, "data": null, "duration": null, "exif": null, "filename": "IMG_0006.HEIC", "height": 3024, "localIdentifier": "CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001", "mime": "image/jpeg", "modificationDate": "1617107619", "path": "/Users/somkidsimajarn/Library/Developer/CoreSimulator/Devices/0C039879-66BC-4294-A59C-E9A903694F96/data/Containers/Data/Application/D764C94F-953B-49DE-934D-C626A3650019/tmp/react-native-image-crop-picker/B81249C6-26DA-4C84-A4C4-EEE209D46793.jpg", "size": 4075105, "sourceURL": "file:///Users/somkidsimajarn/Library/Developer/CoreSimulator/Devices/0C039879-66BC-4294-A59C-E9A903694F96/data/Media/DCIM/100APPLE/IMG_0006.HEIC", "width": 4032}]
    */
    // return;
   
    // console.log(title, transfer_amount, name, surname, id_card_number, selling_website, currentDateTimePicker)

    
    // axios.post(`${API_URL}/api/update_profile?_format=json`, data, {
    //   headers: { 
    //     'Authorization': `Basic ${API_TOKEN}` ,
    //     'content-type': 'multipart/form-data'
    //   }
    // })
   
    axios.post(`${API_URL}/api/added_banlist?_format=json`, data, {
      headers: { 
        'Authorization': `Basic ${basic_auth}`,
        'content-type': 'multipart/form-data'
      }
    })
    .then(function (response) {
      let results = response.data
      console.log(results)
      
      if(results.result){
        // true
        console.log('true');
        console.log(results);

        // let {execution_time, datas, count} = results;
        // console.log(execution_time);
        // console.log(count);
        // console.log(datas);

        // if(datas && datas.length > 0){
        //   _this.setState({spinner: false, execution_time, datas, count});
        // }else{

        _this.setState({spinner: false})
        //   alert('Empty result.');
        // }

        let {navigation, route} = _this.props;

        navigation.pop();
        route.params.onSelect({});

        // _this.toast.show('เพิ่มรายงานเรียบร้อย');

        // _this.props.navigation.pop();        
      }else{
        // false
        console.log('false');

        _this.setState({spinner: false})

        _this.toast.show('ไม่สามารถเพิ่มรายงาน');
      }
    })
    .catch(function (error) {

      _this.setState({spinner: false})

      // _this.toast.show('ไม่สามารถเพิ่มรายงาน');

      console.log('Error >  ' + error);
    });
  }

  handleDelete=(key)=>{
    console.log('handDelete > ' + key);
  }

  itemsMerchant = () =>{
    return this.state.items_merchant_bank_account.map((item, key) => {
      return {key: item.key, label:item.value}
    })
  }

  getNameMerchant = (key) =>{
    console.log('key : ', key, this.state.items_merchant_bank_account.find( item => String(item.key)  === String(key) ))
    return this.state.items_merchant_bank_account.find( item => String(item.key)  === String(key) )
  }

  listMerchantBank = () =>{
    let items_merchant_bank_account = {
                                        1: 'ธนาคารกรุงศรีอยุธยา',
                                        2: 'ธนาคารกรุงเทพ',
                                        3: 'ธนาคารซีไอเอ็มบี' ,
                                        4: 'ธนาคารออมสิน',
                                        5: 'ธนาคารอิสลาม',
                                        6: 'ธนาคารกสิกรไทย',
                                        7: 'ธนาคารเกียรตินาคิน',
                                        8: 'ธนาคารกรุงไทย',
                                        9: 'ธนาคารไทยพาณิชย์',
                                        10: 'Standard Chartered',
                                        11: 'ธนาคารธนชาติ',
                                        12: 'ทิสโก้แบงค์',
                                        13: 'ธนาคารทหารไทย',
                                        14: 'ธนาคารยูโอบี',
                                        15: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
                                        16: 'True Wallet',
                                        17: 'พร้อมเพย์ (PromptPay)',
                                        18: 'ธนาคารอาคารสงเคราะห์',
                                        19: 'AirPay (แอร์เพย์)',
                                        20: 'mPay',
                                        21: '123 เซอร์วิส',
                                        22: 'ธ.ไทยเครดิตเพื่อรายย่อย',
                                        23: 'ธนาคารแลนด์แอนด์เฮ้าส์',
                                        24: 'เก็บเงินปลายทาง' 
                                      }

    var lists = [];
    Object.keys(items_merchant_bank_account).forEach(function(i) {
      lists.push({i, label: items_merchant_bank_account[i], value: i, icon: () => <Icon name="flag" size={18}  />, hidden: false})
    });

    console.log(lists)

    return lists;
  }

  // https://stackoverflow.com/questions/45407581/how-to-dynamically-add-a-text-input-in-react-native/45407976
  addItemMerchantBank = (key) => {
    let itemMerchantBank = this.state.itemMerchantBank;

    itemMerchantBank.push(<View key={{key}}>
                            <View style={{ flexDirection:"row", marginTop:10}}>
                              <Text>เลขบัญชี</Text> 
                              <Button style={{backgroundColor:"#FF2400"}} title='-' onPress={()=>this.handleDelete(key)} />
                            </View>
                            <TextInput key={key}  style={{borderWidth: .5, height: 40}}/>
                            <Text>ธนาคาร/ระบบ Wallet</Text>
                            <DropDownPicker
                              items={this.listMerchantBank()}
                              defaultValue={'1'}
                              containerStyle={{height: 50}}
                              style={{backgroundColor: '#fafafa'}}
                              itemStyle={{ justifyContent: 'flex-start' }}
                              dropDownStyle={{backgroundColor: '#fafafa'}}
                              onChangeItem={item => this.setState({
                                find_id: item.value
                              })}
                              labelStyle={{ fontSize: 16, textAlign: 'left', color: '#000'}}/>
                          </View>);
    this.setState({ itemMerchantBank })
  }

  // Upload image
  onPressAddPhotoBtn = () => {
    this.ActionSheetSelectPhoto.show();
  };

  showActionSheet = index => {
    this.setState({
      selectedPhotoIndex: index
    });
    this.ActionSheet.show();
  };

  onDoUploadPress() {
    const { localPhotos } = this.state;
    if (localPhotos && localPhotos.length > 0) {
      /*
      let formData = new FormData();
      localPhotos.forEach((image) => {
        const file = {
          uri: image.path,
          name: image.filename || Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
          type: image.mime || 'image/jpeg'
        };
        formData.append('files', file);
      });

      axios
        .post('https://api.tradingproedu.com/api/v1/fileupload', formData)
        .then(response => {
          this.setState({ logs: JSON.stringify(response.data) });
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
        */

      console.log('onDoUploadPress')
      console.log(localPhotos)
    } else {
      alert('No photo selected');
    }
  }

  onActionDeleteDone = index => {
    if (index === 0) {
      const array = [...this.state.localPhotos];
      array.splice(this.state.selectedPhotoIndex, 1);
      this.setState({ localPhotos: array });
    }
  };

  onActionSelectPhotoDone = index => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({}).then(image => {
          this.setState({
            localPhotos: [...this.state.localPhotos, image]
          });
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: true,
          maxFiles: 10,
          mediaType: 'photo'
        }).then(images => {
          images.forEach((image) => {
            this.setState({
              localPhotos: [...this.state.localPhotos, image]
            });
          });
        }).catch(error => {
          alert(JSON.stringify(error));
        });
        break;
      default:
        break;
    }
  };

  renderListPhotos = localPhotos => {
    const photos = localPhotos.map((photo, index) => (
      <TouchableOpacity key={index}
        onPress={() => {
          this.showActionSheet(index);
        }}
      >
        <Image style={styles.photo} source={{ uri: photo.path }} />
      </TouchableOpacity>
    ));

    return photos;
  };

  renderSelectPhotoControl = localPhotos => {
    return (
      <View style={styles.sectionContainer}>
        
        <ScrollView style={styles.photoList} horizontal={true}>
          {this.renderListPhotos(localPhotos)}
          <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
            <View style={{alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#3399cc',
                          width: 40,
                          height: 40,
                          borderRadius: 5}}>
              <Text style={styles.addButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  // Upload image

  onDateTimePickerChange = (event, selectedDate) => {
    console.log(selectedDate)
    if(event.type == 'set'){
      this.setState({currentDateTimePicker: selectedDate, showDateTimePicker:false})
    }else{
      this.setState({showDateTimePicker:false})
    }
  };

  handleDatepicker = () =>{
    console.log('handleDatepicker');
    this.setState({showDateTimePicker:true})
  }

  handleDelete=(key)=>{
    let itemsMerchantBankAccount = this.state.itemsMerchantBankAccount;

    let newItemsMerchantBankAccount = itemsMerchantBankAccount.filter(function(item){ return item.key !== key;})

    this.setState({ itemsMerchantBankAccount: newItemsMerchantBankAccount  })
  }

  onChangeItemItemsMerchant = (item, key) =>{
    let itemsMerchantBankAccount = [...this.state.itemsMerchantBankAccount];

    let index = itemsMerchantBankAccount.findIndex(obj => obj.key === key);
    let data = itemsMerchantBankAccount[index];
    // console.log(itemsMerchantBankAccount, key)
    itemsMerchantBankAccount[index]  = {...data, bank_wallet: item}

    this.setState({itemsMerchantBankAccount})
  }

  handleChangeItemItemsMerchant = (item, key) =>{
    let itemsMerchantBankAccount = [...this.state.itemsMerchantBankAccount];

    let index = itemsMerchantBankAccount.findIndex(obj => obj.key === key);
    let data = itemsMerchantBankAccount[index];
    itemsMerchantBankAccount[index]  = {...data, bank_account: item}

    this.setState({itemsMerchantBankAccount})
  }

  addItemsMerchantBankAccount = (length) => {
    let itemsMerchantBankAccount = this.state.itemsMerchantBankAccount;
    itemsMerchantBankAccount.push({key:length, bank_account: '', bank_wallet:''});

    this.setState({itemsMerchantBankAccount});
  }
  
  render(){

    // console.log(this.state.currentDateTimePicker)
    return (
      <SafeAreaView >
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>
          <Spinner visible={this.state.spinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle}/>  
          
          <Toast
            ref={(toast) => this.toast = toast}
            position='bottom'
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}/>

          <View style={styles.container}>
          <View style={{flexDirection:'row'}}>
            <Text>Title </Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
          <TextInput
            style={{height: 40,
                    borderWidth: .5,}}
            ref= {(el) => { this.title = el; }}
            onChangeText={(title) => this.setState({title})}
            value={this.state.title}/>
          <View style={{flexDirection:'row'}}>
            <Text>Amount</Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
         
          <TextInput
            style={{height: 40,
                    borderWidth: .5,}}
            ref= {(el) => { this.transfer_amount = el; }}
            onChangeText={(transfer_amount) => this.setState({transfer_amount})}
            value={this.state.transfer_amount}
            numeric
            keyboardType={'numeric'}/>

          <View style={{flexDirection:'row'}}>
            <Text>Name</Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
          <TextInput
            style={{height: 40,
                    borderWidth: .5,}}
            ref= {(el) => { this.name = el; }}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}/>

          <View style={{flexDirection:'row'}}>
            <Text>Subname</Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
          <TextInput
            style={{height: 40, 
                    borderWidth: .5,}}
            ref= {(el) => { this.surname = el; }}
            onChangeText={(surname) => this.setState({surname})}
            value={this.state.surname}/>

          <Text>ID card number</Text>
          <TextInput
            style={{height: 40,
                    borderWidth: .5,}}
            ref= {(el) => { this.id_card_number = el; }}
            onChangeText={(id_card_number) => this.setState({id_card_number})}
            value={this.state.id_card_number}
            numeric
            keyboardType={'numeric'}/>

          <Text>Selling website</Text>
          <TextInput
            style={{borderWidth: .5,
                    height: 80,
                    textAlignVertical: 'top'}}
            multiline numberOfLines={10}
            ref= {(el) => { this.selling_website = el; }}
            onChangeText={(selling_website) => this.setState({selling_website})}
            value={this.state.selling_website}/>

          <View style={{flexDirection:'row'}}>
            <Text>Date tranfer</Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleDatepicker}>
            <Text>Show date picker : {Moment(this.state.currentDateTimePicker).format('DD-MMMM,YYYY')}</Text>
          </TouchableOpacity>
          {this.state.showDateTimePicker && 
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.currentDateTimePicker}
            mode={'date'}
            is24Hour={true}
            display= {Platform.OS === 'ios' ? "inline" : "spinner"}
            onChange={this.onDateTimePickerChange}
          />}
          
        
          <View style={{flexDirection:'row'}}>
            <Text>Detail</Text>
            <Text style={{color:'#ab1111', fontSize:20}}>*</Text>
          </View>
          <TextInput
            style={{borderWidth: .5,
                    height: 150,
                    textAlignVertical: 'top'}}
            // multiline={true}
            multiline numberOfLines={10}
            ref= {(el) => { this.detail = el; }}
            onChangeText={(detail) => this.setState({detail})}
            value={this.state.detail}
            underlineColorAndroid={'transparent'}
            autoCorrect={true} 
            // autoFocus={true}
            autoCapitalize={'sentences'}/>

          <View style={{ flexDirection:"row", alignItems:'center', marginTop:5}}>
            <Text>บัญชีธนาคารคนขาย</Text>
            <TouchableOpacity style={{marginLeft:5, backgroundColor:'#3399cc', borderRadius:5, width: 30, height: 30, justifyContent:'center', alignItems:'center'}} 
              onPress={() => this.addItemsMerchantBankAccount(this.state.itemsMerchantBankAccount.length)} >
              <Text style={{ color:'white' }}>+</Text>
            </TouchableOpacity>
          </View>
          
          {
            this.state.itemsMerchantBankAccount.map((value, key) => {
              key = value.key
              console.log('itemsMerchantBankAccount ', value)
              return(
                <View key={key}>
                  <View style={{ flexDirection:"row", padding: 5}}>
                      <Text>เลขบัญชี</Text> 
                      {/* <Button style={{backgroundColor:"#FF2400", }} title='-' onPress={()=>this.handleDelete(key)} /> */}

                      <TouchableOpacity style={{backgroundColor:'red', borderRadius:20, width: 25, height: 25, alignItems:'center', justifyContent:'center', marginLeft:5}} 
                        onPress={() => this.handleDelete(key)} >
                        <Text style={{ color:'white'}}>-</Text>
                      </TouchableOpacity>
                  </View>
                  <TextInput 
                    key={key}  
                    value={value.bank_account}
                    keyboardType="numeric"
                    style={{borderWidth: .5, height: 40}}
                    onChangeText={e => this.handleChangeItemItemsMerchant(e, key)}/>
                  <Text>ธนาคาร/ระบบ Wallet</Text>
                    <ModalSelector
                      data={this.itemsMerchant()}  
                      onChange={(option)=>{ 
                        // console.log(`${option.label} (${option.key})`, option) 
                        this.onChangeItemItemsMerchant(option.key, key)
                      }}>
                      <View style={{flex:1, flexDirection:'row', borderWidth: .5,  height: 40,}}>
                        <TextInput
                          style={{ flex:9, height: 40, color:'black'}}
                          editable={false}
                          placeholder="Select bank"
                          placeholderTextColor={"black"}
                          value={isEmpty(value.bank_wallet) ? '' : this.getNameMerchant(value.bank_wallet).value } />
                        <View style={{justifyContent:'center', alignItems:'center'}} >
                          <Ionicons name="chevron-down-outline" size={20} color={'gray'} />
                        </View>
                      </View>
                    </ModalSelector>
                  </View>
              )
            })
          }
          
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {/* <Header /> */}
            {/* <Image style={{ width: 143, height: 30 }} source={{ uri: 'https://tuanitpro.com/wp-content/uploads/2015/04/logo.png' }} /> */}
            <View style={styles.body}>
              <Text style={styles.sectionTitle}>รูปภาพประกอบ</Text>
              {this.renderSelectPhotoControl(this.state.localPhotos)}
              {/* <View style={styles.sectionContainer}> */}
                {/* <TouchableOpacity style={styles.button} onPress={this.onDoUploadPress}>
                  <Text>Upload now</Text>
                </TouchableOpacity> */}
              {/* </View> */}
              {/* <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Logs</Text>
                <TextInput multiline numberOfLines={10} style={{ height: 250, borderColor: 'gray', borderWidth: 1 }}
                  value={this.state.logs}
                />
              </View> */}
            </View>
          </ScrollView>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={'Confirm delete photo'}
            options={['Confirm', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={index => {
              this.onActionDeleteDone(index);
            }}/>

          <ActionSheet
            ref={o => (this.ActionSheetSelectPhoto = o)}
            title={'Select photo'}
            options={['Take Photo...', 'Choose from Library...', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={index => {
              this.onActionSelectPhotoDone(index);
            }}/>

          {/* <TouchableOpacity
            style={styles.button}
            onPress={this.handleAdd}>
            <Text>ADD</Text>
          </TouchableOpacity> */}
        </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
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
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: '600',
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
    marginTop: 10,
    padding: 10
  },

  photo: {
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 10
  },

  photoList: {
    height: 70,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 10
  },
  addButtonText: {
    color: Colors.white,
    // fontWeight: 'bold',
    fontSize: 25
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399cc'
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

const mapStateToProps = state => {
  return{
    user: state.user.data,
    // data: state.app.data
  }
}

const mapDispatchToProps = {
  followUp,
  fetchMyApps
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBanlistScreen)
