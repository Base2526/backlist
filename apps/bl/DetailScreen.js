import React from 'react';
import {SafeAreaView,
        StyleSheet, 
        Text, 
        View, 
        FlatList, 
        Dimensions, 
        Modal,
        Image,
        TouchableOpacity} from 'react-native';
        
import ImageViewer from 'react-native-image-zoom-viewer';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import Toast, {DURATION} from 'react-native-easy-toast'

import Share from 'react-native-share';

import FastImage from 'react-native-fast-image'

import { NumberFormat } from './Utils'

// https://reactnativecode.com/popup-menu-overflow-menu-in-react-navigation/
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return data;
};
// headerRight
const numColumns = 3;
export default class DetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  data:null, 
                        modalVisible: false,
                        init_index: 0,
                        images:[]}
    }

    componentDidMount(){
        const { route, navigation } = this.props;

        let _this = this
        let _menu = null;
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity 
                        style={{  }}
                        onPress={()=>{
                            _this.toast.show('favorite');
                        }}>
                        <Ionicons name="shield-checkmark-outline" size={25} color={'grey'} />
                    </TouchableOpacity>
                        <View style={{marginRight: 5}}>
                            <Menu
                            ref={(ref) => (_menu = ref)}
                            button={
                                <TouchableOpacity 
                                    style={{ marginHorizontal: 10 }}
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
                                    url: route.params.data.link,
                                    failOnCancel: false,
                                };

                                Share.open(shareOptions)
                                .then((res) => {
                                    console.log(res);
                                })
                                .catch((err) => {
                                    err && console.log(err);
                                });
                            }}>
                                <View style={{flexDirection:'row', alignItems: 'center',}}>
                                    <MaterialIcons style={{paddingRight:10}} name="share" size={20} color={'grey'}  />
                                    <Text>Share</Text>
                                </View>
                            </MenuItem>
                            <MenuItem onPress={() => {
                                _menu.hide();
                                _this.toast.show('report');
                            }}>
                                
                                <View style={{flexDirection:'row', alignItems: 'center',}}>
                                    <MaterialIcons style={{paddingRight:10}} name="report" size={20} color={'grey'}  />
                                    <Text>Report</Text>
                                </View>
                            </MenuItem>
                            </Menu>
                        </View>
                </View>
              )
        })

        let images = []
        if (route.params.data.images){
            route.params.data.images.map(function(url){
                images.push({url});
            })
        }
        
        this.setState({data: route.params.data, images})
        this.renderFooterImageViewer = this.renderFooterImageViewer.bind(this)
    }

    onLayout = () => { 
        const {width} = Dimensions.get('window')
        const itemWidth = 100
        const numColumns = Math.floor(width/itemWidth)
        this.setState({ numColumns })
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }

        return (
            <View
                style={styles.item}>
                {/* <Text style={styles.itemText}>{item.key}</Text> */}
                <TouchableOpacity 
                    onPress={()=>{
                        this.setState({modalVisible: true, init_index: index})
                    }}>
                    {/* <Image
                        style={{width:80, height:80, resizeMode: 'cover', borderRadius: 15,}}
                        source={{
                            uri: item.url,
                        }}/> */}
                    <FastImage
                        // style={{ StyleSheet.absoluteFill }}
                        style={{ width:80, height:80, borderRadius: 15, borderWidth:.3, borderColor:'gray' }}
                        source={{
                            uri: item.url,
                            headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />
                </TouchableOpacity>
            </View>
        );
    };

    renderHeader = () =>{
        let {data} = this.state
        if(!data){
            return <View />
        }
        
        let transfer_amount = data.transfer_amount
        if(typeof(data.transfer_amount) === 'string'){
            transfer_amount =parseFloat(data.transfer_amount.replace(/,/g, ''))
        }

        return(
            <View style={{flex:1, padding:10}} >
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>ชื่อ-นามสกุล :</Text>
                    <Text>{data.name} {data.surname}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>สินค้า/ประเภท :</Text>
                    <Text>{data.title}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>ยอดเงิน :</Text>
                    <Text>{NumberFormat(Number(transfer_amount))}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:"bold"}}>วันโอนเงิน :</Text>
                    <Text>{data.transfer_date ==='' ? '-' : data.transfer_date}</Text>
                </View>
                <View style={{flexDirection:'column'}}>
                    <Text style={{fontWeight:"bold"}}>รายละเอียดเพิ่มเติม :</Text>
                    <Text>{data.detail}</Text>
                </View>
            </View>
        )
    }

    renderHeaderImageViewer = () =>{
        return <View style={{backgroundColor:'#fff'}}>
                    <Text>HeaderImageViewer</Text>
                </View>
    }

    renderFooterImageViewer = () =>{

        return (<View />)
        let {images, init_index} = this.state
        return <Text style={styles.footerText}>{init_index + 1} / {images.length}</Text>
    }
        
    render() {
        let {images, init_index} = this.state

        return (<SafeAreaView style={styles.container} onLayout={this.onLayout}>
                    <Modal 
                        visible={this.state.modalVisible}
                        transparent={true}
                        onRequestClose={() => this.setState({ modalVisible: false })}>
                        <ImageViewer 
                            imageUrls={images.filter(function(item){return item.empty !== true;})}
                            index={init_index}
                            // renderHeader={this.renderHeaderImageViewer}
                            // renderFooter={this.renderFooterImageViewer}
                            onSwipeDown={() => {
                                this.setState({modalVisible: false})
                            }}
                            onMove={data => console.log(data)}
                            enableSwipeDown={true}/>
                        {this.renderFooterImageViewer()}
                    </Modal>
                    <Toast
                        ref={(toast) => this.toast = toast}
                        // style={{backgroundColor:'red'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        // textStyle={{color:'red'}}
                        />
                    <FlatList
                        ListHeaderComponent={this.renderHeader()}
                        data={formatData(images, numColumns)}
                        style={styles.container}
                        renderItem={this.renderItem}
                        numColumns={numColumns}
                        keyExtractor={(item, index) => String(index)}/>
                </SafeAreaView>)
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: 20,

    backgroundColor: "#fff"
  },
  item: {
    // backgroundColor: '#4D243D',
    
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
  footer: {
    width: '100%',
    // backgroundColor: '#000'
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    margin: 10
  }
});