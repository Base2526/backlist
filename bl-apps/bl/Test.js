import * as React from 'react';
import { Text, View, StyleSheet, Modal} from 'react-native';
// import Constants from 'expo-constants';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

// import Progress from 'react-native-progress';
// import ProgressBar from 'react-native-progress/Pie';

import * as Progress from 'react-native-progress';
import ImageViewer from 'react-native-image-zoom-viewer';

const Image = createImageProgress(FastImage);

const images = [{
                  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
                },
                {
                  url: 'http://banlist.info/sites/default/files/blacklist_seller/73559_9ecf53d6-3f55-4b58-b18e-db0960d6ce41.png',
                },
                {
                  url: 'http://banlist.info/sites/default/files/blacklist_seller/73559_c6bb296f-1b1c-478f-bf41-9235dabd8d76.jpeg',
                },
                { url: "http://banlist.info/sites/default/files/styles/large/public/blacklist_seller/73559_b99a6095-2966-4925-abc6-225b0342ffd4.png?itok=c25-kxzF" },
                { url: "http://banlist.info/sites/default/files/styles/large/public/blacklist_seller/73559_070369fc-fd54-44af-be27-867a025654b3.jpeg?itok=KmKvMIiI" }]

export default function Test() {
  let [visible, setVisible] = React.useState(true);

  FastImage.preload([{ uri: "https://unsplash.it/400/400?image=1" },
                     { uri: "https://unsplash.it/400/400?image=2" }])
  return (
    <View style={styles.container}>
      <Modal 
      visible={true} 
      transparent={true}>
        <ImageViewer 
            imageUrls={images}
            visible={visible}
            enableSwipeDown={true}
            onSwipeDown={() => {
                setVisible(false)
                console.log('visible : ', visible)
            }}
            renderImage={(props)=>{
                return(
                    <Image {...props}

                        indicator={Progress.Circle}
                        indicatorProps={{
                            size: 80,
                            borderWidth: 5,
                            color: '#ffffff',
                            // unfilledColor: 'rgba(60,14,101, 0.2)',
                        }}

                        // source={{
                        //     uri: 'https://unsplash.it/400/400?image=1',
                        //     headers: { Authorization: 'someAuthToken' },
                        //     priority: FastImage.priority.normal,
                        // }}
                        onLoadStart={e => console.log('Loading Start >>> ')}
                        onProgress={e =>
                            console.log(
                            'Loading Progress ' +
                                e.nativeEvent.loaded / e.nativeEvent.total
                            )
                        }
                        onLoad={e =>
                            console.log(
                            'Loading Loaded ' + e.nativeEvent.width,
                            e.nativeEvent.height
                            )
                        }
                        onLoadEnd={e => console.log('Loading Ended')}
                        />
                    )
                }}
                />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
