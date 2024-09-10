import storage, { firebase, getStorage } from '@react-native-firebase/storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CloudStorageScreen() {
  const [values, setValues] = useState<{ filename: string; url: string }[]>([]);

  useEffect(() => {
    const fetchStorage = async () => {
      try {       
       const reference = await storage().ref('images/').list() 
       
       const AllFiles = await Promise.all(
        reference.items.map(async (ref) => {
          const url = await ref.getDownloadURL();
          return { filename: ref.name, url };
        })
      );
      setValues(AllFiles);
        
      } catch (error) {
        console.error('Error fetching images:', error);
        throw new Error('Failed to fetch images');
      }
    };

    fetchStorage();
  }, [values]);

  return (
    values.length!==0?<SafeAreaView style={styles.Container}>
      <FlatList
        data={values}
        numColumns={2}
        style={styles.imageList}
        //keyExtractor={(item, index) => index.toString()} // Provide unique key for each item
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item.url }} />
            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.imageCaption}>{item.filename}</Text>
          </View>
        )}
        keyExtractor={(item )=> item.filename}
      />
    </SafeAreaView>
    :<View style={styles.Container}>
        <Text style={{color: '#5966BB' ,  textAlign: 'center'}}><Icon name="cloud-outline" size={80} ></Icon></Text>
        <Text style={{color: '#5966BB' , fontSize: 16, textAlign: 'center'}}>No files stored</Text>
    </View>
  );
}

const styles = StyleSheet.create({  
  Container: {
  //backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  imageList: {
    flex: 1,
    padding: 4,
  },
  imageContainer: {
    backgroundColor: 'white',
    maxWidth: '45%',
    elevation:16,
    flex:1,
    margin: 8,
    borderRadius: 8,
  },
  image: {
    width: 168,
    height: 168,
    borderTopRightRadius:8,
    borderTopLeftRadius:8,
    alignSelf: 'center',
    backgroundColor: 'lightgrey'
    },
  imageCaption: {
      //flex:1,
    margin:4,
    fontSize:12,
    textAlign: 'center',
    color: '#1E2448',
    }
  });