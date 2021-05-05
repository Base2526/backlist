import React from 'react';
import {
  SectionList,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';

import { SearchBar, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { addHistory, deleteHistory } from './actions/user';

class SearchScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSelected: false,
      search: '',
      searchCategory: ["title"],
      searchText: null,
      isFocused: false
    };
  }

  _handleQueryChange = searchText => {
    this.setState({ searchText });
  };

  _executeSearch = () => {
    alert('do search!');
  };

  componentDidMount(){
    // const { route, navigation, historys } = this.props;
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
      renderItem={this._renderItem}
      keyExtractor={this._keyExtractor}
      keyExtractor={(item, index) => String(index)}
    />
  );

  _renderItem = ({ item }) => {
    const { navigation, historys, deleteHistory } = this.props;

    let {searchCategory} = this.state

    let {title, id, section, ex} = item
    switch(section){
      case '0':{
        return (<TouchableOpacity onPress={() => {
                  let history = historys.find((itm)=>itm.search_text === title)
                  this.insertSearch(title, history.search_category);

                  navigation.navigate('result_search', {search_text:title, search_category: history.search_category})
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
         return (<View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <CheckBox 
                        title={title} 
                        checked={searchCategory.includes(id) ? true : false} 
                        onPress={()=>{
                          let search_category  = [...searchCategory]
                          if(search_category.includes(id)){
                            var index = search_category.indexOf(id);
                            if (index !== -1) {
                              search_category.splice(index, 1);
                            }
                          }else{
                            search_category.push(id);
                          }
                          this.setState({searchCategory:search_category})
                        }}
                      />
                    </View>
                  </View>);
      }

      default:{
        return <View />
      }
    }
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

  insertSearch(search_text, search_category) {
    this.setState({search:search_text, searchCategory: search_category})

    this.props.addHistory({ search_text, search_category })
  }

  render() {
    let { search, isFocused, searchCategory } = this.state;
    const { navigation, historys } = this.props;
    let _historys = [...historys].slice(0, 5); 

    const sections = [
      {
        title: 'Recent searches',
        data: [_historys.map((item, id) => {return {section : '0', id, title : item.search_text}})],
      },
      {
        title: 'Category searches',
        data: [
          [
            { section: '1', id: 'title', title: 'สินค้า/ประเภท', ex: 'Ex. title' },
            // { section: '1', id: 'field_sales_person_name', title: 'ชื่อบัญชีผู้รับเงินโอน', ex: 'Ex. name subname' },
            // { section: '1', id: 'field_sales_person_surname', title: 'นามสกุลบัญชีผู้รับเงินโอน', ex: 'Ex. 33209xxxxxx72' },
            { section: '1', id: 'banlist_name_surname_field', title: 'ชื่อ-นามสกุล บัญชีผู้รับเงินโอน', ex: 'Ex. 33209xxxxxx72' },
            { section: '1', id: 'field_id_card_number', title: 'เลขบัตรประชาชนคนขาย', ex: 'Ex. 33209xxxxxx72' },
            { section: '1', id: 'body', title: 'รายละเอียด', ex: 'Ex. 33209xxxxxx72' },
            { section: '1', id: 'banlist_book_bank_field', title: 'บัญชีธนาคาร', ex: 'Ex. 33209xxxxxx72' },
          ],
        ],
      },
    ];

    /*
        $options["title"] = "สินค้า/ประเภท";
        $options["field_sales_person_name"] = "ชื่อบัญชีผู้รับเงินโอน";
        $options["field_sales_person_surname"] = "นามสกุลบัญชีผู้รับเงินโอน";
        $options["field_id_card_number"] = "เลขบัตรประชาชนคนขาย";
        $options["body"] = "รายละเอียด";
        $options["banlist_book_bank_field"] = "บัญชีธนาคาร";
    */
    
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
                // let {searchCategory} = this.state

                console.log('search : ', search, searchCategory)
                if(search.trim() == ""){
                  alert('กรุณากรอกคำค้น.');
                }else if(search.trim().length < 4){
                  alert('ต้องมากกว่า 3 ตัวอักษร');
                }else if(searchCategory.length <= 0){
                  alert('ยังไม่ได้เลือกหมวดหมู่การค้นหา');
                }else{
                  this.insertSearch(search, searchCategory);
                  // navigation.navigate('result_search', {key_search:search})

                  navigation.navigate('result_search', {search_text:search, search_category: searchCategory})
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
