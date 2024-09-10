import * as React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import * as ImagePicker from 'react-native-image-picker';
import { DemoButton } from './DemoButton';


/* toggle includeExtra */
const includeExtra = true;

export default function UploadScreen() {
  const [response, setResponse] = React.useState<any>(null);

  const onButtonPress = React.useCallback((type: string, options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.buttonContainer}>
          {actions.map(({title, type, options}) => {
            return (
              <DemoButton
                key={title}
                onPress={() => onButtonPress(type, options)}>
                {title}
              </DemoButton>
            );
          })}
        </View>
        {/* <DemoResponse>{response}</DemoResponse> */}

        {response?.assets &&
          response?.assets.map(({uri}: {uri: string}) => (
            <View key={uri} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{uri: uri}}
              />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginVertical: 8,
    alignSelf: 'center'
    
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      formatAsMp4: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      formatAsMp4: true,
      includeExtra,
    },
  },
];

// if (Platform.OS === 'ios') {
//   actions.push({
//     title: 'Take Image or Video\n(mixed)',
//     type: 'capture',
//     options: {
//       saveToPhotos: true,
//       mediaType: 'mixed',
//       includeExtra,
//       presentationStyle: 'fullScreen',
//     },
//   });
// }

// import React, { useState } from 'react';
// import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, Alert, Button } from 'react-native';
// import { firebase } from '@react-native-firebase/firestore';
// import ImagePicker from 'react-native-image-picker';   


// const UploadScreen = () => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const openImagePicker = () => {
//     ImagePicker.launchImageLibrary({
//       mediaType: 'photo', 
//       includeBase64: false,
//       maxHeight: 2000,
//       maxWidth: 2000,
//     }, handleResponse);
//   };

//   const handleCameraLaunch = () => {
//     ImagePicker.launchCamera({
//       mediaType: 'photo', 
//       includeBase64: false,
//       maxHeight: 2000,
//       maxWidth: 2000,
//     }, handleResponse);
//   };

//   const handleResponse = (response: ImagePicker.ImagePickerResponse) => {
//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.errorCode) {
//       console.log('Image picker error: ', response.errorMessage);
//     } else {
//       let imageUri = response.uri || response.assets?.[0]?.uri;
//       setSelectedImage(imageUri);
//     }
//   };


//   return (
//     <View style={{   
//  flex: 1, justifyContent: 'center' }}>
//       {selectedImage && (
//         <Image
//           source={{ uri: selectedImage }}
//           style={{ flex: 1 }}
//           resizeMode="contain"
//         />
//       )}
//       <View style={{ marginTop: 20 }}>
//         <Button title="Choose from Device" onPress={openImagePicker} />
//       </View>
//       <View style={{ marginTop:   
//  20, marginBottom: 50 }}>
//         <Button title="Open Camera" onPress={handleCameraLaunch} />
//       </View>
//     </View>   

//   );
// };

// export default UploadScreen;