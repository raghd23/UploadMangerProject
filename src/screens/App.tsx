/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, LogBox, TouchableOpacity } from 'react-native'; 
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import HomeScreen from './homeScreen';
import DisplayScreen from './DisplayScreen';
import { getStorage } from '@react-native-firebase/storage';



interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId:   
 string;
  appId: string;   

}

interface DocumentData {
  name?: string;
}

interface DocWithId extends DocumentData {
  id: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDej_ifBKGjyczAGtpXe32JqvGrqVskv9M",
  authDomain: "awesomeproject-1c000.firebaseapp.com",
  projectId: "awesomeproject-1c000",
  storageBucket: "awesomeproject-1c000.appspot.com",
  messagingSenderId: "906492283572",
  appId: "1:906492283572:android:bc0171efc651e5d7df65e1",
};


function Upload() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FD',}}>
      <HomeScreen/>
    </View>
  );

}

function Display() {
  return (
    <View style={{ flex: 1}}>
    <DisplayScreen/>
  </View>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      
      headerShown: true,
      tabBarShowLabel: false,
      headerStyle:{height:56, backgroundColor: '#F5F6FD', },
      headerTitleStyle:{fontSize:24, color:'#5966BB', marginTop:8 , fontWeight: 'bold', },
      //tabBarLabelStyle: { fontSize:10 , marginBottom:8, },
      tabBarItemStyle: {  },
      tabBarStyle: {  
        position: 'absolute' ,
        backgroundColor:'#8F9BE0',
        height: 48, 
        borderRadius:32, 
        marginHorizontal: 24,
        marginBottom:8, 
        elevation:6,
       },

      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        let Iconcolor = '#D6DAF5';
        let iconsize = 24;

        if (route.name === 'Upload') {
          iconName = focused
            ? 'cloud-upload'
            : 'cloud-upload-outline';
            Iconcolor = focused ? 'white' : '#D6DAF5';
            iconsize = focused ? 26 : 24;
         } 
         else if (route.name === 'Display') {
          iconName = focused ? 'images' : 'images-outline';
          Iconcolor = focused ? 'white' : '#D6DAF5';
          iconsize = focused ? 26 : 24;
        }

        return <Icon name={iconName} size={iconsize} color={Iconcolor} > </Icon>;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#D6DAF5',
    })
    } >
      <Tab.Screen name="Upload" component={Upload} options={{}} />
      {/* <Tab.Screen name="upload" component={UploadingScreen} /> */}
      <Tab.Screen name="Display" component={Display} />
    </Tab.Navigator>
  );
}

export default function App() {
  const app = initializeApp(firebaseConfig);
  return (
    <NavigationContainer>
    <MyTabs />
  </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})



// const App = () => {
//   const [data, setData] = useState<DocWithId[]>([]); // State to store fetched data

//   const writeDataToFirestore = async (collection: string, data: { [x: string]: any; }) => {
//     try {
//       const ref = firebase.firestore().collection(collection).doc()
//       const response = await ref.set(data)
//       return response
//     } catch (error) {
//       return error
//     }
//   }

//   const Data = {
//     title: 'My first todo item',
//     description: 'This is my first todo item',
//     completed: false
//   }

//   writeDataToFirestore('todos', Data)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const app = initializeApp(firebaseConfig);
//         const db = getFirestore(app);

//         const querySnapshot = await getDocs(collection(db, 'collection'));
//         const fetchedData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
//           ...doc.data(),
//           id: doc.id,
//         }));

//         setData(fetchedData);
//       } catch (error) {
//         console.error( error);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array ensures data fetch only happens once

//   const renderItem = ({ item }: { item: DocWithId }) => (
//     <View style={styles.item}>
//       <Text style={styles.text}>Name: {item.name}</Text> 
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {data.length > 0 ? (
//         <FlatList
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={item => item.id}   // Key extractor for unique item identification
//         />
//       ) : (
//         <Text>Loading data...</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   item: {
//     padding: 10,
//     margin: 5,
//     backgroundColor: '#ddd',
//   },
//   text: {
//     fontSize: 16,
//   },
// });

//export default App;

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// firestore()
//   .collection('Users')
//   .add({
//     name: 'Ada Lovelace',
//     age: 30,
//   })
//   .then(() => {
//     console.log('User added!');
//   });

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Steeeep 1">
//             Edit <Text style={styles.highlight}>app.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
