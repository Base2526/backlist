import React, { useEffect,useState,useRef } from 'react';
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
    Alert
} from 'react-native';
import {connect} from "react-redux";
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const Image = createImageProgress(FastImage);

import { onFormatDate } from './Utils'
// const mapStateToProps = state = {
//     return {
//         user: state.user.data 
//     }
// }

const mapStateToProps = state => {
    return{
      user: state.user.data,
      tests: state.app.tests,

      notifications: state.user.notifications
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         // same effect
//         firstAction : () => dispatch(action1()),
//         secondAction : bindActionCreators(action2, dispatch)
//     }
// };

const dummyArray = [
    { id: '1', value: 'A' },
    { id: '2', value: 'B' },
    { id: '3', value: 'C' },
    { id: '4', value: 'D' },
    { id: '5', value: 'E' },
    { id: '6', value: 'F' },
    { id: '7', value: 'G' },
    { id: '8', value: 'H' },
    { id: '9', value: 'I' },
    { id: '10', value: 'J' },
    { id: '11', value: 'K' },
    { id: '12', value: 'L' },
    { id: '13', value: 'M' },
    { id: '14', value: 'N' },
    { id: '15', value: 'O' },
    { id: '16', value: 'P' },
    { id: '17', value: 'Q' },
    { id: '18', value: 'R' },
    { id: '19', value: 'S' },
    { id: '20', value: 'T' },
    { id: '21', value: 'U' },
    { id: '22', value: 'V' },
    { id: '23', value: 'W' },
    { id: '24', value: 'X' },
    { id: '25', value: 'Y' },
    { id: '26', value: 'Z' }
];

class NotificationItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {   
    //   console.log('nextProps -> item : ', nextProps.items.item)
    //   console.log('nextState : ', nextState)
    //   console.log('this.props.items -> item : ', this.props.items.item)
    //   return true;
    // const newValue = nextProps.items.item.value
    // const oldValue = this.props.items.item.value

    // return newValue !== oldValue

    return true;
  }
  
  render() {
      let _menu = null

      let {index, item} = this.props.item
      console.log('index : ', index, ', item', item)
      return (
          <TouchableOpacity style={{
                      margin:5,
                      paddingTop:10,
                      paddingBottom:10,
                      paddingLeft:10,
                      backgroundColor:"#FFF",
                      borderRadius:5
                  }}
                  onPress={()=>{
                      // console.log('--Y--')
                  }}>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{position:'absolute', right: 0, flexDirection:'row'}}>
                    <View style={{justifyContent:'center'}}>
                      <Menu
                        ref={(ref) => (_menu = ref)}
                        button={
                          <TouchableOpacity 
                            style={{ paddingLeft:3, }}
                            onPress={()=>{
                              _menu.show()
                            }}>
                          <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                          </TouchableOpacity>
                        }>
                        <MenuItem 
                          onPress={() => { _menu.hide() }} 
                          style={{flex:1, justifyContent:'center'}}>
                          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5, color:'red'}} name="delete" size={25} color={'grey'}  />
                            <Text style={{ textAlign: 'center', color:'red' }}>Delete</Text>
                          </View>
                        </MenuItem>
                      </Menu>
                    </View>
                  </View>
                  <View>
                  <View style={{flexDirection:'row'}}>
                    <View style={{}}>
                      <FastImage
                        style={{ borderWidth:.3, borderColor:'gray', height: 50, width: 50, borderRadius:25 }}
                        // containerStyle={{ ...StyleSheet.absoluteFillObject }}
                        // style={{ height: 50, width: 50, }}
                        source={{
                            uri: 'http://banlist.info/sites/default/files/styles/thumbnail/public/102889044862407437181_04-14-2021_1158am.png?itok=UqxY0huh',
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover} />
                    </View>
                    <View style={{backgroundColor:'yellow', marginLeft:10}}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                        <Text style={{color:'gray'}}>{index} - {item.id}</Text>
                      </View>
                      
                      <View style={{flexDirection:'row'}}>
                        <Text style={{color:'gray'}}>{onFormatDate("MMM dd, yyyy", new Date(item.date))}</Text>
                      </View>
                    </View>
                  </View>
                  </View>
                </View>
              </View>
          </TouchableOpacity>);
  }
}

const Notification = (props) => {
    const flatListRef = React.useRef()
    const [listItems, setListItems] = useState([]);

    const [headerTitle, setHeaderTitle] = useState('Notifications');
    // Rerender after headerTitle change
    useEffect(() => {
      const {notifications} = props
      navigationSetOptions(props)

      // console.log('--> notifications : ', notifications)
      setListItems(notifications)
    }, []);

    const navigationSetOptions = (props) =>{
      const {navigation, notifications} = props
      navigation.setOptions({
        title: headerTitle + "(" +notifications.length+")",
        headerRight: () => (
              <View style={{ marginRight:5 }}>
                <Menu
                ref={(ref) => (_menu = ref)}
                button={
                    <TouchableOpacity 
                    style={{ paddingLeft:3,  }}
                    onPress={()=>{
                        _menu.show()
                    }}>
                    <MaterialIcons name="more-vert" size={25} color={'grey'}  />
                    </TouchableOpacity>
                }>
                <MenuItem onPress={() => {
                        _menu.hide();
                        console.log("Clear all")
                        }} style={{flex:1, justifyContent:'center'}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="delete-outline" size={25} color={'grey'}  />
                        <Text style={{ textAlign: 'center' }}>Clear all</Text>
                    </View>
                </MenuItem>
                </Menu>
              </View>
        )
      });
    }

    const ItemView = (item) => {
      // console.log('ItemView: ', item)
      return <NotificationItem {...props} item={item}/>
    }
        
    return (
        <SafeAreaView style={{flex:1}}>
           <FlatList
            ref={flatListRef}
            data={listItems}
            //data defined in constructor
            // ItemSeparatorComponent={ItemSeparatorView}
            //Item Separator View
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
            // extraData={listItems}
            />
        </SafeAreaView>
    );
};

// export default connect(mapStateToProps, null)(Notification);
const areEqual=(prevProps,nextProps)=>{
    // return false prevProps.text & nextProps.text are not equal.
    // return prevProps.text===nextProps.text
    // else all are equal, no re-render


    // console.log('prevProps > nextProps : ', prevProps.tests.length, nextProps.tests.length)

    // console.log('-areEqual-')

    // if(prevProps.tests.length == nextProps.tests.length){
    //     return true
    // }
    return false
}

export default connect(mapStateToProps, null)(Notification)
// export default connect(mapStateToProps, null)(Notification)