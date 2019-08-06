
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, Button, Image, ImageBackground, Wrapper, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
class Loading extends Component {
  componentDidMount(){
    this.checkIfLogged();
  }
  checkIfLogged = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
      if(user){
        this.props.navigation.navigate
        ('DashboardScreen');
      } else {
        this.props.navigation.navigate
        ('Profile');
      }
    }.bind(this)
  );
};
  render(){
    return(
      <View style={styles.container}><ActivityIndicator size="large" color="rgba(255, 81, 47,0.8)"/></View>
    )
  }
}
export default Loading;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
