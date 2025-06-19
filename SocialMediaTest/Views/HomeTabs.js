import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomePageScreen from './HomePageScreen';
import CustomTabBar from "./CustomTabBar";
import SearchPageScreen from './SearchPageScreen';

const Tab = createBottomTabNavigator();

function SearchScreen() {
  return <View style={styles.center}><Text>Search</Text></View>;
}
function CameraScreen() {
  return <View style={styles.center}><Text>Camera</Text></View>;
}
function FriendsScreen() {
  return <View style={styles.center}><Text>Friend Requests</Text></View>;
}
function CreatePostScreen() {
  return <View style={styles.center}><Text>Create Post</Text></View>;
}

export default function HomeTabs() {
  return (
   <Tab.Navigator
  screenOptions={{
    headerShown: false,
  }}
  tabBar={(props) => <CustomTabBar {...props} />}
>
  <Tab.Screen name="Home" component={HomePageScreen} />
  <Tab.Screen name="Search" component={SearchPageScreen} />
  <Tab.Screen name="Camera" component={CameraScreen} />
  <Tab.Screen name="Friends" component={FriendsScreen} />
  </Tab.Navigator>

  );
}


const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabWrapper: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
  },
  tabBarStyle: {
    backgroundColor: '#fff',
    height: 55,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
  sidePlusButton: {
    marginLeft: 10,
    backgroundColor: '#00BFA6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  plusText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: -1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
