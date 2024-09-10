import * as React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ActionButton from 'react-native-action-button';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NetInfo, { addEventListener, NetInfoState, useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar, MD3Colors} from 'react-native-paper';
import { TouchableOpacity } from 'react-native';




const includeExtra = true;
const enum pickerType{
  capture = 'capture',
  gallery = 'gallery'
}

const queue = [{
 // id: 0, 
  imgUri: 'https://community.atlassian.com/t5/image/serverpage/image-id/281168iB53C11E900C1A434/image-size/large?v=v2&px=999', 
  fileName: '', 
  progress: 110, 
  color: 'blue', 
  intermediate:false
}]

let index = 1
export default function HomeScreen() {
  const [response, setResponse] = useState<ImagePicker.ImagePickerResponse | null>(null);
  const [UploadTask, setUploadTask] = useState<FirebaseStorageTypes.Task>();
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [IsOnline, setIsOnline] = useState(false);
  const [ImageUri , setImageUri] = useState('');
  const [uploadingQueue , setUploadingQueue] = useState(queue);
  const [keys, setKeys] = useState('');
  const [IsCanceled, setIsCanceled] = useState(false);



//check network connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      //console.log('useEffect connection: ',state.isConnected);
      setConnectionStatus(state.isConnected);
      console.log('useEffect connectionStatus: ', connectionStatus);
      if (state.isConnected)
        {setIsOnline(true)
        }
      else {
        setIsOnline(false)
      }
    });
    return () => unsubscribe();   
  }, [connectionStatus, ]);


// check storage
  useEffect(() => {
    const AsyncToFirebase = async () => { 
      console.log('fetchAsyncStorage: ', connectionStatus, IsOnline);
     if(IsOnline)
      { try {
      const allKeys = await AsyncStorage.getAllKeys();
     // setKeys(allKeys);
      console.log('keys length', allKeys.length)
      if(allKeys.length !== 0){
        await Promise.all(
          allKeys.map(async (key) => {
            const item = await AsyncStorage.getItem(key);
            if(item != null){
              try {
                console.log('onWork')
                await uploadToFirebase(item, key)// storage().ref(key).putFile(item);
                await AsyncStorage.removeItem(key);
               // removeFromQueue(key)
              } catch (error) {
                console.error('Upload failed24:', error);
                Alert.alert('Upload Failed24', 'Sorry, something went wrong.2');
              }} else{
                console.error('Upload failed2:'+ item+ '<<');
                Alert.alert('Upload Failed', 'Sorry, something went wrong.2');
              }
          })
        );   
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }}
  }
  AsyncToFirebase();
  },[IsOnline, keys])

// Delete
  const removeFromQueue = (FileName: string) => {
    setUploadingQueue((prev) =>
      prev.filter(a => a.fileName !== FileName ))
  }

  //failed
  const cancelToFirebase = async () => {
    // const reference = storage().ref(fileName);
    //   const task = reference.putFile(uri);
    if(UploadTask !== undefined)
     { 
      console.log('Cancelling my task!');
        UploadTask.cancel();
    //   UploadTask.on('state_changed',
    //   snapshot => {
    //     console.log('Cancelling my task!');
    //     UploadTask.cancel();
    //   })
     }
  }

  //Firebase
  const uploadToFirebase = async (uri: string, fileName: string,) => {
    handleProgressBarChange(fileName, '#5966BB', 0 , false)
    try {
      const reference = storage().ref('images/'+fileName);
      const task = reference.putFile(uri);
      setUploadTask(task)
      task.on('state_changed',
         async (snapshot) => {
          if(snapshot.state ==='running')
            { const progressPrecentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
              console.log( fileName + ' Upload is ' + progressPrecentage + '% ');
              setUploadingQueue((prev) =>
              prev.map((item) => (  (item.fileName === fileName) ? 
              { ...item, progress: progressPrecentage, } : item)));
  
             }
              if(snapshot.state ==='success'){
                removeFromQueue(fileName)
              }

              if(snapshot.state ==='cancelled'){
                console.log('uploadToFirebase Cancelling my task!');
              }

              if(snapshot.state ==='error'){
                console.error('Upload to server failed:',);
                Alert.alert('Upload to server Failed', 'Sorry, something went wrong');
                uploadToAsyncStorage(uri, fileName,);
              }
              
            },

        // (error) => {
        //   console.error('Upload to server failed:', error);
        //   Alert.alert('Upload to server Failed', 'Sorry, something went wrong');
        //   uploadToAsyncStorage(uri, fileName,);
        // },
      );
    } catch (error) {
      console.error('Upload failed2:', error);
      Alert.alert('Upload Failed', 'Sorry, something went wrong.2');
    }
  };


   const handleProgressBarChange = (fileName: string, barColor: string, progressBar: number, Intermediate: boolean ) => {
    setUploadingQueue((prev) =>
      prev.map((item) => ((  (item.fileName === fileName)) ? 
        { ...item, color: barColor, ptogress:progressBar, intermediate:Intermediate } : item ))); 
   }
  
  // Local Storage
  const uploadToAsyncStorage = async (uri: string, fileName: string, ) => {
    handleProgressBarChange(fileName, '#CA426E', 10 , true)
    try {
      await AsyncStorage.setItem(fileName, uri, );
      console.log('AsyncStorage Upload successfully ');
      setKeys(fileName);
    } catch (error) {
      console.error('AsyncStorage Upload failed: ', error);
    }
  };

  const handleImagePickerResponse = (res: ImagePicker.ImagePickerResponse, IsOnline: boolean) => {
    setResponse(res);
    if (res?.assets && res.assets.length > 0) {
      const { uri, fileName } = res.assets[0];
      if (uri && fileName) {
         //setImageUri(uri)
         //setIsUploading(true)
         
         index++
         let date = new Date().toDateString()
         let name = `${ Date.parse(date)+fileName}`
         const value = {  fileName: name, imgUri: uri, progress: 10, color: 'transparent', intermediate: true};
         setUploadingQueue(uploadingQueue => [...uploadingQueue, value])
         console.log('index is ' + uploadingQueue.length  );
        if (IsOnline) {
          uploadToFirebase(uri, name, );
          // uploadToFirebase(uri, name, index, IsOnline);
          //.log('index is ' + index  );
        } else {
          uploadToAsyncStorage(uri, name,);
          // Alert.alert(
          //   'Offline',
          // );  
      }      
    }
  };
}
 
  const onButtonPress = useCallback((type: string, options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions, IsOnline: boolean) => {
    if (type === pickerType.capture) {
      ImagePicker.launchCamera(options, (response) => handleImagePickerResponse(response, IsOnline));
    } else {
      ImagePicker.launchImageLibrary(options, (response) => handleImagePickerResponse(response, IsOnline));
    }
  }, []);

  return ( 
    <View style={styles.container}>
      {/* <View style={styles.headerContainer} ><Text style={styles.header}> Upload </Text></View> */}
        {(uploadingQueue.length===1) ? 
        <View style={{justifyContent: 'center', flex:1}}>
        <Text style={{color: '#5966BB' ,  textAlign: 'center'}}><Icon name="cloud-upload-outline" size={80} ></Icon></Text>
        <Text style={{color: '#5966BB' , fontSize: 16, textAlign: 'center'}}>Upload a file</Text>
        </View>
        : <ScrollView >
          {uploadingQueue.map((Item) => {
          return ( 
            (Item.progress !== 110)&&
           <View key={Item.fileName} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{ uri: Item.imgUri }}
              />
              <View style= {styles.imageInfo}>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">{Item.fileName} </Text>
              <ProgressBar progress={Item.progress/100} color={Item.color} style={styles.progress} indeterminate= {Item.intermediate} />
              </View>
                            {/* <Icon name='refresh-outline' color="grey"/> */}
              <TouchableOpacity style={styles.cancel} 
              onPress={() =>  {
                removeFromQueue(Item.fileName)
                if(!IsOnline){
                   AsyncStorage.removeItem(Item.fileName);
                } else{
                  cancelToFirebase()
                  // cancelToFirebase(Item.imgUri, Item.fileName)
                }
                 }}>
               <Icon name='close-circle-outline' color="#BE2354" size={24} />
              </TouchableOpacity>
              
            </View>
          );
        })}
        </ScrollView>
      }
      
      <ActionButton buttonColor="#E67599"  style={styles.actionbutton} >
        <ActionButton.Item buttonColor='#9b59b6' title="gallery" 
          onPress={() => onButtonPress(pickerType.gallery, {
            selectionLimit: 1,
            mediaType: 'mixed',
            includeBase64: false,
            includeExtra,
          }, IsOnline)}
        >
          <Icon name="albums-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        
        <ActionButton.Item buttonColor='#3498db' title="take photo" 
          onPress={() => onButtonPress(pickerType.capture, {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
          },IsOnline)
        }
        >
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>

        <ActionButton.Item buttonColor='#1abc9c' title="Record Video" 
          onPress={() => onButtonPress(pickerType.capture, {
            saveToPhotos: true,
            formatAsMp4: true,
            mediaType: 'video',
            includeExtra,
          }, IsOnline)}
        >
          <Icon name="videocam-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
      {/* {response?.assets &&
        response.assets.map(({ uri }) => (
          <View key={uri} style={styles.imageContainer}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={styles.image}
              source={{ uri: uri }}
            />
          </View>
        ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     justifyContent: 'center',
    // alignItems: 'center',
   // backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop:16,
    //paddingTop:16
  },
  headerContainer: {
  
  },
  header: {
    textAlign: 'left',
    fontSize: 24,
    margin: 16,
    color: '#1B2574',
    fontWeight: 'bold',
  
  },
  containerList: {
    flex: 1,
     //justifyContent: 'flex-start',
    // alignItems: 'center',
    
  },
  actionbutton: {
    position:'absolute',
    bottom: 40,
  },
  actionButtonIcon: {
    fontSize: 24,
    color: 'white',
  },
  progress: {
    height: 8,
    width: 224,
    borderRadius: 8,
    //alignSelf: 'center',
    marginVertical: 8
   // alignItems:  'center',
    
  },
  text: {
    fontSize: 12,
    color: '#1E2448',
    margin: 0,
    alignSelf: 'flex-start'
  },
  imageContainer: {
    backgroundColor: 'white',
    //alignItems: 'flex-start',
    //flex: 1,
    padding: 8,
    marginTop: 16,
    marginHorizontal:16,
    flexDirection: 'row',
    borderRadius: 16,
    elevation: 16,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: 'lightgrey'
  },
  imageInfo: { 
    flex: 1,
    flexDirection: 'column',  
    justifyContent: 'flex-start',
    marginHorizontal: 8,
    //backgroundColor: 'lightgrey',
    alignItems: 'center',
  },
  cancel: {
    marginHorizontal: 8,
    alignSelf: 'center',
    //backgroundColor: 'lightgrey',
    
  },
});
