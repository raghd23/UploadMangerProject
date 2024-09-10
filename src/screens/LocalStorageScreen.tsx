import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';




export default function LocalStorageScreen() {
  const STORAGE_KEY = '@my_key';
  const [keys, setKeys] = useState<readonly string[]>([]);
  const [values, setValues] = useState<{ key: string; value: string | null; }[]>([]);

  useEffect(() => {
    const fetchAsyncStorage = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        setKeys(allKeys);

        const allItems = await Promise.all(
          allKeys.map(async (key) => {
            const item = await AsyncStorage.getItem(key);
            //console.log(key)
            return { key, value: item };
           //await AsyncStorage.removeItem(key)
           
          })
        );
        setValues(allItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchAsyncStorage();
  }, [values]);

    return (
       (values.length===0)? 
        <View style={styles.Container}>
            <Text style={{color: '#5966BB' ,  textAlign: 'center'}}>
                <Icon name="cloud-offline-outline" size={80} ></Icon>
            </Text>
            <Text style={{color: '#5966BB' , fontSize: 16, textAlign: 'center'}}>No files stored</Text>
        </View>
        :<View style={styles.Container}>
             <FlatList 
             data={values}
             numColumns={2}
             style={styles.imageList}
             renderItem={({item}) => ((item.value !== null) ? 
              (<View style={styles.imageContainer}>
                <Image 
                style={styles.image}
                source={{uri: item.value}} />
                <Text style={styles.imageCaption} numberOfLines={1} ellipsizeMode="middle">{item.key}</Text>
                </View>) 
             :(<Text>No value stored yet.</Text>)
             )} 
             keyExtractor={item => item.key} />
        </View> 
         );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center'
      },
      imageList: {
        flex: 1,
        padding: 4,
       // flexDirection: 'row',
       // alignSelf: 'center',
      },
    imageContainer: {
       backgroundColor: 'white',
      // paddingBottom: 8,
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
      margin:4,
      fontSize:12,
      textAlign: 'center',
      color: '#1E2448',
    }

});