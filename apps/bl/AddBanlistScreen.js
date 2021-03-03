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

import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

import Spinner from 'react-native-loading-spinner-overlay';

import Toast, {DURATION} from 'react-native-easy-toast'

const axios = require('axios');
var Buffer = require('buffer/').Buffer
import {API_URL, API_TOKEN} from "@env"

// toTimestamp

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
                  spinner: false};  
  
    // const [date, setDate] = useState(new Date(1598051730000));
    // const [mode, setMode] = useState('date');
    // const [show, setShow] = useState(false);

    // this.state = {
    //   logs: 'ahihi',
    //   selectedPhotoIndex: 0,
    //   localPhotos: []
    // };
    this.onDoUploadPress = this.onDoUploadPress.bind(this);

  }

  componentDidMount() {
    Moment.locale('en');

    const { route, navigation } = this.props;
    let _this = this
    navigation.setOptions({
      headerRight: () => (
          <View style={{flexDirection:'row'}}>
              <TouchableOpacity 
                  style={{ marginHorizontal: 10 }}
                  onPress={()=>{
                    _this.handleAdd()
                  }}>
                  <Text style={{ fontSize:18 }}>ADD</Text>
              </TouchableOpacity>
          </View>
        )
    })
  }

  getNavigationParams() {
    return this.props.navigation.state.params || {}
  }

  handleAdd= () => {
    // console.log(this.state.name);
    // console.log(this.state.surname);
    // console.log(this.state.bank_account);

    /*
    $product_type   = trim( $content['product_type'] );       // สินค้า/ประเภท
    $transfer_amount= trim( $content['transfer_amount'] );    // ยอดเงิน
    $person_name    = trim( $content['person_name'] );        // ชื่อบัญชี ผู้รับเงินโอน
    $person_surname = trim( $content['person_surname'] );     // นามสกุล ผู้รับเงินโอน
    $id_card_number = trim( $content['id_card_number'] );     // เลขบัตรประชาชนคนขาย
    $selling_website= trim( $content['selling_website'] );    // เว็บไซด์ประกาศขายของ
    $transfer_date  = trim( $content['transfer_date'] );      // วันโอนเงิน
    $details        = trim( $content['details'] );            // รายละเอียดเพิ่มเติม
    $merchant_bank_account   = $content['merchant_bank_account']; // บัญชีธนาคารคนขาย
    $images         = $content['images'];            // รูปภาพประกอบ
    */

    let { title, 
          transfer_amount, 
          name, 
          surname, 
          id_card_number, 
          selling_website,
          currentDateTimePicker,
          detail,

          itemsMerchantBankAccount,
          localPhotos} = this.state


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

    const data = new FormData();

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

    // console.log(data)

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
        'Authorization': `Basic ${API_TOKEN}`,
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



        _this.toast.show('เพิ่มรายงานเรียบร้อย');

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

  getItemsMerchant = () =>{
    let items_merchant_bank_account =  {
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

    var tifOptions = [];

    Object.keys(items_merchant_bank_account).forEach(function(key) {
      tifOptions.push({key, label: items_merchant_bank_account[key], value: key, icon: () => <Icon name="flag" size={18}  />, hidden: false})
    });
    return tifOptions;
  }

  // https://stackoverflow.com/questions/45407581/how-to-dynamically-add-a-text-input-in-react-native/45407976
  addItemsMerchantBankAccount = (id) => {
    let itemsMerchantBankAccount = this.state.itemsMerchantBankAccount;

    itemsMerchantBankAccount.push({key:Math.floor(Math.random() * 100000), bank_account: '',  bank_wallet: 0 })
    
    console.log(itemsMerchantBankAccount)
    this.setState({ itemsMerchantBankAccount })
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
    itemsMerchantBankAccount[index]  = {...data, bank_wallet: item.value}

    this.setState({itemsMerchantBankAccount})
  }

  handleChangeItemItemsMerchant = (item, key) =>{
    let itemsMerchantBankAccount = [...this.state.itemsMerchantBankAccount];

    let index = itemsMerchantBankAccount.findIndex(obj => obj.key === key);
    let data = itemsMerchantBankAccount[index];
    itemsMerchantBankAccount[index]  = {...data, bank_account: item}

    this.setState({itemsMerchantBankAccount})
  }
  
  render(){

    console.log(this.state.currentDateTimePicker)
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

          <View style={{ flexDirection:"row", marginTop:10}}>
            <Text>บัญชีธนาคารคนขาย</Text>
            <Button style={{height:5}} title='+' onPress={() => this.addItemsMerchantBankAccount(this.state.itemsMerchantBankAccount.length)} />
          </View>
          
          {
          this.state.itemsMerchantBankAccount.map((value, key) => {
            key = value.key
            return(
              <View key={key}>
                <View style={{ flexDirection:"row", marginTop:10}}>
                    <Text>เลขบัญชี</Text> 
                    <Button style={{backgroundColor:"#FF2400", }} title='-' onPress={()=>this.handleDelete(key)} />
                </View>
                <TextInput 
                  key={key}  
                  keyboardType="numeric"
                  style={{borderWidth: .5, height: 40}}
                  onChangeText={e => this.handleChangeItemItemsMerchant(e, key)}/>
                <Text>ธนาคาร/ระบบ Wallet</Text>
                
                <DropDownPicker
                  items={this.getItemsMerchant()}
                  defaultValue={'1'}
                  containerStyle={{height: 50}}
                  style={{backgroundColor: '#fafafa', }}
                  itemStyle={{justifyContent: 'flex-start'}}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={item => this.onChangeItemItemsMerchant(item, key)}
                  labelStyle={{
                      fontSize: 16,
                      textAlign: 'left',
                      color: '#000'
                  }}/>
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
    fontWeight: 'bold',
    fontSize: 30
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

export default AddBanlistScreen;
