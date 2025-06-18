import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomePageScreen from './HomePageScreen';

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

export default function HomeTabs({ navigation }) {
  return (
    <View style={styles.navContainer}>
      <View style={styles.tabWrapper}>
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomePageScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons name="home-outline" size={20} color={focused ? '#00BFA6' : '#ccc'} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons name="search-outline" size={20} color={focused ? '#00BFA6' : '#ccc'} />
              ),
            }}
          />
          <Tab.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons name="camera-outline" size={20} color={focused ? '#00BFA6' : '#ccc'} />
              ),
            }}
          />
          <Tab.Screen
            name="Friends"
            component={FriendsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons name="person-add-outline" size={20} color={focused ? '#00BFA6' : '#ccc'} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
      
      <TouchableOpacity
        style={styles.sidePlusButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
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
