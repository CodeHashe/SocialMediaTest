import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = 'home-outline';
        if (route.name === 'Home') iconName = 'home-outline';
        if (route.name === 'Search') iconName = 'search-outline';
        if (route.name === 'Camera') iconName = 'camera-outline';
        if (route.name === 'Friends') iconName = 'person-add-outline';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? '#00BFA6' : '#aaa'} />
          </TouchableOpacity>
        );
      })}

      {/* Custom Plus Button Next to Tabs */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00BFA6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  plusText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});
