import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LocalStorageScreen from "./LocalStorageScreen";
import CloudStorageScreen from './CloudStorageScreen';



function CloudStorage() {
  return (
    <View style={styles.container}>
      <CloudStorageScreen/>
    </View>
  );
}

function LocalStorage() {
  return (
    <View style={styles.container}>
      <LocalStorageScreen/>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
export default function DisplayScreen() {
 // const [value, setValue] = useState<string | null>(null); 


  return (
    <Tab.Navigator
    initialRouteName="Cloud"
    
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#5966BB',
      tabBarLabelStyle: { fontSize: 12,  fontWeight: '400' },
      tabBarStyle: { 
      backgroundColor: 'white', elevation: 0, height: 40 },
      tabBarIndicatorStyle: {
        backgroundColor: '#5966BB', 
       // height:4, 
        // borderTopRightRadius: 8,
        // borderTopLeftRadius: 8,
        borderRadius:8,
      }, 
      tabBarIndicatorContainerStyle: {
        // height:48, 
        borderRadius: 8,
        backgroundColor: 'rgba(245, 246, 253, 1)', 
      }


    })}>
      <Tab.Screen name="Cloud " component={CloudStorage} />
      <Tab.Screen name="Backups" component={LocalStorage} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:4,
    backgroundColor: '#F5F6FD'
  },
 
})


