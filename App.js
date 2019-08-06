import { createAppContainer, createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, Button, Image, ImageBackground, Wrapper, ActivityIndicator } from 'react-native';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import VocabScreen from './screens/VocabScreen';
import ExamScreen from './screens/ExamScreen';
import ProfileScreen from './screens/ProfileScreen';
import Loading from './screens/Loading';
import Profile from './screens/Profile';
import TopicVocab from './screens/TopicVocab';
import AddVocab from './screens/AddVocab';
import WriteTest from './screens/WriteTest';
import AbcTest from './screens/AbcTest';
import AddVocabToExam from './screens/AddVocabToExam';
import * as firebase from 'firebase';
var name, email, photoUrl, uid, emailVerified;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
  } else {
  }
});

import { Feather, Entypo} from 'react-native-vector-icons';
class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Feather name={name} size={size} color={color} />
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
  let IconComponent = Feather;
  let iconName;
  if (routeName === 'VocabScreen') {
    iconName = `home`;
    IconComponent = Feather;
  } else if (routeName === 'ExamScreen') {
    iconName = `book-open`;
  }
  else if (routeName === 'ProfileScreen') {
    IconComponent = Feather;
    iconName = `user`;
  }
  return <IconComponent name={iconName} size={20} color={tintColor} />;
};


YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
class Welcome extends React.Component {
  render() {
    return (
      <View>
      <Button
        title="Dashboard"
        onPress={()=> this.props.navigation.navigate('DashboardScreen')}
      />
      </View>
    )
  }
}
class Dashboard extends React.Component {
  render() {
    return (
      <View>
      <Button
        title="Welcome"
        onPress={()=> this.props.navigation.navigate('WelcomeScreen')}
      />
      </View>
    )
  }
}
const DashboardTabNavigator = createBottomTabNavigator({
  VocabScreen,
  ExamScreen ,
  ProfileScreen,
},
{
  navigationOptions: ({navigation}) => {
    let {routeName} = navigation.state.routes
    [navigation.state.index];
    if(routeName==="VocabScreen") routeName = 'Từ vựng';
    else if(routeName==="ExamScreen") routeName = 'Kiểm tra';
    else if(routeName==="ProfileScreen") routeName = 'Hồ sơ';
    return {
      headerTitle: routeName
    };
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) =>
      getTabBarIcon(navigation, focused, tintColor),
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
    labelStyle: {
      marginTop: 0
    },
  },
}
)
const DashboardStackNavigator = createStackNavigator({
  DashboardTabNavigator: DashboardTabNavigator,
})
const AppSwitchNavigator = createSwitchNavigator({
  Loading: {screen: Loading},
  Profile: {screen: Profile},
  WelcomeScreen: {screen: Welcome},
  DashboardScreen: {screen: DashboardStackNavigator},
  TopicVocab: {screen: TopicVocab},
  AddVocab: {screen: AddVocab},
  AddVocabToExam: {screen: AddVocabToExam},
  WriteTest: {screen: WriteTest},
  AbcTest: {screen: AbcTest},
});

const AppContainer = createAppContainer(
  AppSwitchNavigator
);
