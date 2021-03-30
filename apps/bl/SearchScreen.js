import React from 'react';
import {
  SectionList,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  SafeAreaView,
  AsyncStorage,
  Platform,
  StatusBar 
} from 'react-native';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { connect } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// import * as historys from './utils/historys';

import { addHistory, deleteHistory } from './actions/user';

// https://aboutreact.com/react-native-sectionlist/
class MyListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    isSelected: false,
    };
  }

  _onPress = (changeSelected) => {
    this.setState((previousState) => ({
      isSelected: !previousState.isSelected,
    }));
    changeSelected();
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          let { id, section } = this.props;
          console.log(id, section);
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            {this.props.section == 0 && (
              <Ionicons name="time-outline" size={20} color="black" />
            )}
            {this.props.section == 1 && (
              <AntDesign name="plussquareo" size={20} color="black" />
            )}
          </View>
          <Text style={{ flex: 8, fontSize: 15, paddingTop: 2 }}>
            {this.props.title} - {this.props.id} - {this.props.section}
          </Text>
          <View style={{ flex: 1 }}>
            {this.props.section == 0 && (
              <TouchableOpacity
                onPress={() => {
                  this.insertSearch(this.props.title);
                }}
                style={{ padding: 5, borderRadius: 20 }}>
                <Ionicons name="close-outline" size={20} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

class SearchScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSelected: false,
      search: '',

      searchHistory: [], // search history array

      searchText: null,
      isFocused: false
    };
  }

  // static navigationOptions = {
  //   header: null,
  // };

  // state = {
  //   searchText: null,
  // };

  _handleQueryChange = searchText => {
    this.setState({ searchText });
  };

  _executeSearch = () => {
    alert('do search!');
  };

  componentDidMount(){
    const { route, navigation, historys } = this.props;
    // navigation.setOptions({
    //   // headerShown: false
    //   // headerLeft: () => (
    //   //   <TouchableOpacity
    //   //     onPress={() => console.log('Button is Pressed!') }>
    //   //     <Text>Home</Text>
    //   //   </TouchableOpacity>
    //   // ),
    //   // headerRight: () => (
    //   //   <TouchableOpacity
    //   //     onPress={() => console.log('Button is Pressed!') }>
    //   //     <Text>Home</Text>
    //   //   </TouchableOpacity>
    //   // )
    // })

    console.log('historys :', historys)
  }

  changeSelected = () => {
    this.setState((previousState) => ({
      hasSelected: !previousState.hasSelected,
    }));
  };

  _keyExtractor = (item, index) => item.id;

  _ItemSeparatorComponent = () => <View />;

  _renderSectionListItem = ({ item }) => (
    <FlatList
      data={item}
      // numColumns={3}
      renderItem={this._renderItem}
      keyExtractor={this._keyExtractor}
      // ItemSeparatorComponent={this._ItemSeparatorComponent}
    />
  );

  // _renderItem = ({item}) => (
  //   console.log(item)
  //   <MyListItem
  //     id={item.id}
  //     title={item.title}
  //     changeSelected={this.changeSelected}
  //     hasSelected={this.state.hasSelected}
  //   />
  // )

  // item = (title, id, section) => {
  //   const { route, navigation } = this.props;
  //   return (
      
  //   );
  // };

  _renderItem = ({ item }) => {
    const { route, navigation, deleteHistory } = this.props;

    let {title, id, section, ex} = item

    console.log("title, id, section, ex : ", title, id, section, ex)

    switch(section){
      case '0':{
        return (<TouchableOpacity onPress={() => {
                  // console.log(this.props)
                  this.insertSearch(title);
                  navigation.navigate('result_search', {key_search:title})
                }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                    <Ionicons name="time-outline" size={20} color="gray" /> 
                    </View>
                    <Text style={{ flex: 8, fontSize: 15, paddingTop: 2, color: 'gray' }}>
                      {title}
                    </Text>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                      {section == 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            // this.insertSearch(title);

                            /*
                            let index = this.state.searchHistory.indexOf(title);

                            // let tempArr = historys.arrDelete(this.state.searchHistory, index);
                            // tempArr.unshift(title);
                            // historys.setItem('searchHistory', tempArr);

                            // local history none search content
                            // let tempArr = this.state.searchHistory;
                            // tempArr.unshift(title);
                            // historys.setItem("searchHistory", tempArr);

                            var tempArr = [...this.state.searchHistory]; // make a separate copy of the array
                            // var index = array.indexOf(e.target.value)
                            if (index !== -1) {
                              tempArr.splice(index, 1);
                              historys.setItem("searchHistory", tempArr);

                              this.getHistory()
                            }
                            // console.log(this.state.searchHistory)
                            // console.log(tempArr)
                            */
                            
                            deleteHistory(title)
                          }}
                          style={{ padding: 5, borderRadius: 20 }}>
                          <Ionicons name="close-outline" size={25} color="gray" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )
      }

      case '1':{
         return (<TouchableOpacity onPress={() => {

                    let text = '';
                    switch(id){
                      case '0':{
                        text = 'ti:';
                        break;
                      }

                      case '1':{
                        text = 'ns:';
                        break;
                      }

                      case '2':{
                        text = 'in:';
                        break;
                      }
                    }
                    this.updateSearch(text)

                    console.log(text)

                    this.searchBarInput.focus();
                  }}>
                  <View
                  style={{
                      backgroundColor: 'white',
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{ flex: 1 }}>
                      <AntDesign name="plussquareo" size={20} color="gray" />
                    </View>
                    <Text style={{ flex: 4, fontSize: 15, paddingTop: 2, color: 'gray' }}>
                      {title}
                    </Text>
                    <View style={{ flex: 4}}>
                     <Text style={{ flex: 4, fontSize: 15, paddingTop: 2, color: 'gray', textAlign: 'right'  }}>
                      {ex}
                    </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
      }

      default:{
        return <View />
      }

    }

    // return (
    //   //   <MyListItem
    //   //   section={item.section}
    //   //   id={item.id}
    //   //   title={item.title}
    //   //   changeSelected={this.changeSelected}
    //   //   hasSelected={this.state.hasSelected}
    //   // />
    //   <TouchableOpacity onPress={() => {
    //     console.log(this.props)
    //   }}>
    //     <View
    //       style={{
    //         backgroundColor: 'white',
    //         padding: 10,
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         flex: 1,
    //       }}>
    //       <View style={{ alignItems: 'center', flex: 1 }}>
    //         {section == 0 && (
    //           <Ionicons name="time-outline" size={20} color="gray" />
    //         )}
    //         {section == 1 && (
    //           <AntDesign name="plussquareo" size={20} color="gray" />
    //         )}
    //       </View>
    //       <Text style={{ flex: 8, fontSize: 15, paddingTop: 2, color: 'gray' }}>
    //         {title}
    //       </Text>
    //       <View style={{ alignItems: 'center', flex: 1 }}>
    //         {section == 0 && (
    //           <TouchableOpacity
    //             onPress={() => {
    //               // this.insertSearch(title);

    //               let index = this.state.searchHistory.indexOf(title);

    //               // let tempArr = historys.arrDelete(this.state.searchHistory, index);
    //               // tempArr.unshift(title);
    //               // historys.setItem('searchHistory', tempArr);

    //               // local history none search content
    //               // let tempArr = this.state.searchHistory;
    //               // tempArr.unshift(title);
    //               // historys.setItem("searchHistory", tempArr);

    //               var tempArr = [...this.state.searchHistory]; // make a separate copy of the array
    //               // var index = array.indexOf(e.target.value)
    //               if (index !== -1) {
    //                 tempArr.splice(index, 1);
    //                 historys.setItem("searchHistory", tempArr);

    //                 this.getHistory()
    //               }

                 
    //               // console.log(this.state.searchHistory)
    //               // console.log(tempArr)
                  
    //             }}
    //             style={{ padding: 5, borderRadius: 20 }}>
    //             <Ionicons name="close-outline" size={25} color="gray" />
    //           </TouchableOpacity>
    //         )}
    //       </View>
    //     </View>
    //   </TouchableOpacity>
    // );
  };

  _renderSectionHeader = ({ section }) => (
    <Text
      style={{ fontSize: 15, fontWeight: 'bold', color: 'black', margin: 10 }}>
      {section.title}
    </Text>
  );

  updateSearch = (search) => {
    this.setState({ search });
  };

  // Get history
  // getHistory() {
  //   // Query local history
  //   historys.getItem('searchHistory').then((data) => {
  //     if (data == null) {
  //       this.setState({
  //         searchHistory: [],
  //       });
  //     } else {
  //       this.setState({
  //         searchHistory: data,
  //       });
  //     }
  //   });
  // }

  // save the search tag
  insertSearch(text) {
    // if (this.state.searchHistory.indexOf(text) != -1) {
    //   // local history already searched
    //   let index = this.state.searchHistory.indexOf(text);
    //   let tempArr = historys.arrDelete(this.state.searchHistory, index);
    //   tempArr.unshift(text);
    //   historys.setItem('searchHistory', tempArr);
    // } else {
    //   // local history none search content
    //   let tempArr = this.state.searchHistory;
    //   tempArr.unshift(text);
    //   historys.setItem('searchHistory', tempArr);
    // }

    // this.setState({ search:'' });

    // this.getHistory() 

    this.props.addHistory(text)
  }

  render() {
    let { search, searchHistory, isFocused } = this.state;

    const { navigation, historys } = this.props;

    console.log('historys >>> : ',historys);

    let _historys = [...historys]
    _historys = _historys.slice(0, 5); 

    const sections = [
      {
        title: 'Recent searches',
        data: [
          // [
          // {section : '0', id:'0', title: 'overall'},
          // {section : '0', id:'1', title: 'Management Information Department'},
          // {section : '0', id:'2', title: 'High Performance Department'},
          // {section : '0', id:'3', title: 'Tech Cloud'},
          // {section : '0', id:'4', title: 'Big Data Department'},
          // {section : '0', id:'5', title: 'New Media Department'},
          // {section : '0', id:'6', title: 'Internet of Things Center'},
          // {section : '0', id:'7', title: 'Scientific Research and Information Department'},
          // {section : '0', id:'8', title: 'Amazon Cloud'},
          // {section : '0', id:'9', title: 'Ministry Secondary School'},
          // {section : '0', id:'10', title: 'Manage Cloud'},
          // {section : '0', id:'11', title: 'Ningbo Materials Institute'},  
          // ]
          _historys.map((title, id) => {return {section : '0', id, title}})
        ],
      },
      {
        title: 'Narrow your search',
        data: [
          [
            // {section : '1', id:'0', title: 'machine distribution'},
            // {section : '1', id:'1', title: 'User distribution'},
            // {section : '1', id:'2', title: 'Storage distribution'},
            // {section : '1', id:'3', title: 'Bone Flow Chart'},
            { section: '1', id: '0', title: 'ti:', ex: 'Ex. title' },
            { section: '1', id: '1', title: 'ns:', ex: 'Ex. name subname' },
            { section: '1', id: '2', title: 'in:', ex: 'Ex. 33209xxxxxx72' },
          ],
        ],
      },
    ];
    
    return (
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 0 : 0, backgroundColor:'white' }}>
        <View style={{ flex: 1, backgroundColor:'white' }}>
          <View style={{flexDirection:'row'}}>       
            {!isFocused && <View  style={{flex:1, justifyContent:'center', alignItems:"center"}}>
                              <TouchableOpacity  
                              style={{borderRadius:30, padding:5 }} 
                              onPress={()=>{
                                navigation.goBack()
                              }}>
                                <Feather name="arrow-left" size={25} color="gray" />
                              </TouchableOpacity>
                            </View>}     
            <SearchBar
              // lightTheme
              ref={(input) => { this.searchBarInput = input; }}
              onClear={() => {
                console.log('onClear');
              }}

              placeholder="Input key word search"
              onChangeText={this.updateSearch}
              // onClear={(text) => searchFilterFunction('')}
              value={search}
              // icon = {{type: 'material-community', color: '#86939e', name: 'share' }}
              // clearIcon = {{type: 'material-community', color: '#86939e', name: 'share' }}
              // clearIcon={{
              //   iconStyle: { margin: 10 },
              //   containerStyle: { margin: -10 },
              // }}
              clearIcon={ search == '' ? false : true}
              searchIcon={{ size: 24 }}
              // searchIcon={false}
              onSubmitEditing={() => {
                // search

                console.log('search : ', search)
                if(search.trim() == ""){
                  alert('กรุณากรอกคำค้น.');
                }else if(search.trim().length < 4){
                  alert('ต้องมากกว่า 3 ตัวอักษร');
                }else{
                  this.insertSearch(search);
                  navigation.navigate('result_search', {key_search:search})
                }
                
              }}
              // autoFocus={true}
              // containerStyle={{flex:8, backgroundColor:'white'}}

              // inputStyle={{backgroundColor: 'white'}}
              // containerStyle={{flex:8,  /*borderWidth: 1, borderRadius: 5, backgroundColor: 'green'*/}}
              // placeholderTextColor={'#g5g5g5'}

              inputContainerStyle={{backgroundColor: 'white'}}
              leftIconContainerStyle={{backgroundColor: 'white'}}
              inputStyle={{backgroundColor: 'white'}}
              containerStyle={{
                backgroundColor: 'white',
                justifyContent: 'space-around',
                borderTopWidth:0,
                borderBottomWidth:0,
                flex:8,
              }}

              // lightTheme
              onFocus={() =>{
                this.setState({isFocused: true})
              } }
              onBlur={() => {
                this.setState({isFocused: false})
              }}

              leftIcon={
                <Feather name="arrow-left" size={25} color="gray" />
                // <Icon
                //   name={focus ? "arrow-right" : "magnify"}
                //   type="material-community"
                //   color="rgba(0, 0, 0, 0.54)"
                //   onPress={focus && this.searchbar && this.searchbar.cancel}
                // />
              }
            />
          </View>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderSectionListItem}
            renderSectionHeader={this._renderSectionHeader}
            // numColumns={3}
            columnWrapperStyle={{ borderWidth: 3, borderColor: '#f4f4f4' }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return{
    user: state.user.data,
    historys: state.user.historys,
  }
}

const mapDispatchToProps = {
  addHistory, 
  deleteHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)
