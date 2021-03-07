import React, {Component, } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
  
import SettingsList from 'react-native-settings-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
  
class SettingsScreen extends Component {
    constructor(){
        super();
    }
    render() {
        return (
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
            {/* <View style={{borderBottomWidth:1, backgroundColor:'#263238',borderColor:'#c8c7cc'}}>
            <Text style={{color:'white',marginTop:15,marginBottom:15, marginLeft:15,fontWeight:'bold',fontSize:20}}>Settings</Text>
            </View> */}

            <View style={{backgroundColor:'#f6f6f6',flex:1}}>
                
            <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
                <SettingsList.Item
                hasNavArrow={false}
                title='My Info'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                itemWidth={70}
                borderHide={'Both'}
                onPress={()=>{
                    console.log('Banlist info')
                }}
                />
                {/* <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Display'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                /> */}
              

                <SettingsList.Header headerStyle={{marginTop:-5}}/>
                <SettingsList.Item
                hasNavArrow={false}
                title='Banlist info'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'bold'}}
                itemWidth={70}
                borderHide={'Both'}
                />
                  <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                        <Ionicons name="bug-outline" size={20} color={'grey'} />
                    </View>
                }
                title='For developer'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                        <Ionicons name="terminal-outline" size={20} color={'grey'} />
                    </View>
                }
                title='Terms of service'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                        <Ionicons name="information-outline" size={20} color={'grey'} />
                    </View>
                }
                hasNavArrow={false}
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                title='About'
                onPress={()=>{
                    console.log('About')
                }}
                />

                {/* สำหรับนักพัฒนา */}
                
                {/* 
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Sound & notification'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Apps'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Storage & USB'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Battery'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />
                <SettingsList.Item
                icon={
                    <View style={styles.imageStyle}>
                    
                    </View>
                }
                title='Memory'
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                hasNavArrow={false}
                />  */}
                {/* <SettingsList.Header headerStyle={{marginTop: -5}}/> */}
            </SettingsList>
            </View>
        </View>
        );
    }
}
  
const styles = StyleSheet.create({
imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:20,
    height:24,
    justifyContent:'center'
}
});

export default SettingsScreen;