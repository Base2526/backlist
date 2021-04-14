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
// const mapStateToProps = state = {
//     return {
//         user: state.user.data 
//     }
// }

const mapStateToProps = state => {
    return{
      user: state.user.data,
      tests: state.app.tests
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

class MyListItem extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {   
    //   console.log('nextProps -> item : ', nextProps.items.item)
    //   console.log('nextState : ', nextState)
    //   console.log('this.props.items -> item : ', this.props.items.item)
    //   return true;
      const newValue = nextProps.items.item.value
      const oldValue = this.props.items.item.value

      return newValue !== oldValue
    }
  
    render() {
        let _menu = null

        let {index, item} = this.props.items
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
                            onPress={() => { _menu.hide(); }} 
                            style={{flex:1, justifyContent:'center'}}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                              <Ionicons style={{justifyContent:'center', alignItems: 'center', marginRight:5}}  name="people-outline" size={25} color={'gray'} />
                              <Text style={{ textAlign: 'center' }}>--</Text>
                            </View>
                          </MenuItem>
                          <MenuItem 
                            onPress={() => { _menu.hide(); }} 
                            style={{flex:1, justifyContent:'center'}}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                              <Text style={{ textAlign: 'center' }}>Share</Text>
                            </View>
                          </MenuItem>
                          <MenuItem 
                            onPress={() => {_menu.hide();}} 
                            style={{flex:1, justifyContent:'center'}}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="edit" size={25} color={'grey'}  />
                              <Text style={{ textAlign: 'center' }}>Edite</Text>
                            </View>
                          </MenuItem>
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
                        <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                        <Text style={{color:'gray'}}>{index} - {item.value}</Text>
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                        <Text style={{color:'gray'}}>--</Text>
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                        <Text style={{color:'gray'}}>--</Text>
                      </View>
                      {/* transfer_date */}
                      <View style={{flexDirection:'row'}}>
                        <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                        <Text style={{color:'gray'}}>--</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{flexDirection:'column'}}>
                    <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
                    
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
        props.navigation.setOptions({
            title: headerTitle,
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
                            const shareOptions = {
                                title: 'Share Banlist',
                                url: item.link,
                                failOnCancel: false,
                            };

                            Share.open(shareOptions)
                            .then((res) => {
                                // console.log(res);
                            })
                            .catch((err) => {
                                err && console.log(err);
                            });
                            }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                            <Text style={{ textAlign: 'center' }}>Share</Text>
                        </View>
                    </MenuItem>

                    <MenuItem onPress={ async () => {
                            _menu.hide();
                            
                            let cL = this.props.user
                            if(isEmpty(cL)){
                                this.setState({ bottomModalAndTitle: true })
                            }else{
                                navigation.navigate('report', {data:item})
                            }
                            }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="report" size={25} color={'grey'}  />
                            <Text style={{ textAlign: 'center' }}>Report</Text>
                        </View>
                    </MenuItem>
                    </Menu>
                  </View>
            )
        });

        // console.log("props.tests > ", props)
    }, [headerTitle, props.navigation]);

    // console.log("props.tests > ", props.tests)
    if (props.tests !== listItems) setListItems(props.tests);
    // setListItems(props.tests)

    const ItemView = (items) => {

        console.log('items : ', items)

        return <MyListItem items={items}/>

        // console.log(`-${index}-`)
        let _menu = null
        return (<TouchableOpacity style={{
                    margin:5,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingLeft:10,
                    backgroundColor:"#FFF",
                    borderRadius:5
                }}
                onPress={()=>{
                    console.log('--Y--')
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
                      <MenuItem onPress={() => {
                            // _menu.hide();

                            // if(isEmpty(fp)){
                            //   _this.toast.show('Empty follow up');
                            // }else{
                            //   navigation.navigate('follow_up', {data:item})
                            // }
                            
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Ionicons style={{justifyContent:'center', alignItems: 'center', marginRight:5}}  name="people-outline" size={25} color={'gray'} />
                          <Text style={{ textAlign: 'center' }}>--</Text>
                        </View>
                      </MenuItem>
                      <MenuItem onPress={() => {
                            // _menu.hide();
                            // const shareOptions = {
                            //   title: 'Share Banlist',
                            //   url:  API_URL + '/node/24443',
                            //   failOnCancel: false,
                            // };

                            // // console.log(route.params.data.id)

                            // Share.open(shareOptions)
                            // .then((res) => {
                            //     console.log(res);
                            // })
                            // .catch((err) => {
                            //     err && console.log(err);
                            // });
                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          {/* <Ionicons style={{justifyContent:'center', alignItems: 'center', marginRight:5}}  name="share" size={25} color={'gray'} /> */}
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="share" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Share</Text>
                        </View>
                      </MenuItem>
                      <MenuItem onPress={() => {
                            // _menu.hide();

                            // navigation.navigate('add_banlist', {data: item});

                          }} style={{flex:1, justifyContent:'center'}}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialIcons style={{justifyContent:'center', alignItems: 'center', marginRight:5}} name="edit" size={25} color={'grey'}  />
                          <Text style={{ textAlign: 'center' }}>Edite</Text>
                        </View>
                      </MenuItem>
                      <MenuItem onPress={() => {
                            // _menu.hide();

                            // Alert.alert(
                            //   "Comfirm",
                            //   "Are you sure delete?",
                            //   [
                            //       {
                            //       text: "Cancel",
                            //       onPress: () => console.log("Cancel Pressed"),
                            //       style: "cancel"
                            //       },
                            //       { text: "Delete", onPress: () => {

                            //         let {deleteMyApp, user} = _this.props
                            //         deleteMyApp(user.basic_auth, item.id)
                            //       } }
                            //   ]
                            //   );
                            // navigation.navigate('report', {data:item})
                          }} style={{flex:1, justifyContent:'center'}}>
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
                    <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                    {/* <TouchableOpacity 
                      style={{ }}
                      onPress={()=>{
                        navigation.navigate('filter', {data:item})
                      }}> */}
                      <Text style={{color:'gray'}}>{index} - {item.value}</Text>
                    {/* </TouchableOpacity> */}
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                    <Text style={{color:'gray'}}>--</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                    <Text style={{color:'gray'}}>--</Text>
                  </View>
                  {/* transfer_date */}
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text style={{color:'gray'}}>--</Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
                
              </View>
            </View>
        
                </TouchableOpacity>);
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
            extraData={listItems}
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

export default connect(mapStateToProps, null)(React.memo(Notification, areEqual))
// export default connect(mapStateToProps, null)(Notification)