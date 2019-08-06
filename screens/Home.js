/*import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Alert, StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { TabNavigator, createStackNavigator } from 'react-navigation';*/
/*firebase.auth().onAuthStateChanged(function(user) {
if (user) {
  let userName = user.displayName;
}
});*/

/*class Home extends Component {
  render(){
    return(
      <View>
      <Text>HOME SREEN </Text>
      <Button title='Sign out' onPress={() => firebase.auth().signOut()} / >
      </View>
    )
  }
}
export default Home;*/
import * as firebase from 'firebase';
import React from 'react';
import { Text, View, Button } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo } from 'react-native-vector-icons'; // 6.2.2
import { createBottomTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import ProfileScreen from './ProfileScreen';
import VocabScreen from './VocabScreen';
import ExamScreen from './ExamScreen';
class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  return <IconWithBadge {...props} badgeCount={0} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Vocab') {
    iconName = `ios-home`;
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Exam') {
    iconName = `ios-options`;
  }
  else if (routeName === 'Profile') {
    IconComponent = Entypo;
    iconName = `user`;
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

createAppContainer(
  createBottomTabNavigator(
    {
      Profile: { screen: ProfileScreen },
      Vocab: { screen: VocabScreen },
      Exam: { screen: ExamScreen },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    }
  )
);

export default createAppContainer(
      createBottomTabNavigator(
        {
          Vocab: { screen: VocabScreen },
          Exam: { screen: ExamScreen },
          Profile: { screen: ProfileScreen },
        },
        {
          defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) =>
              getTabBarIcon(navigation, focused, tintColor),
          }),
          tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
        }
      )
    );
