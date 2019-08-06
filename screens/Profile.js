import React from 'react';
import * as firebase from 'firebase';
import { Alert, StyleSheet, Text, View, Button, Image, ImageBackground, Wrapper } from 'react-native';
import LoginFB from '../component/loginWithFacebook';
class Profile extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <ImageBackground source={require('../assets/bg.jpg')} style={{width:'100%', height: '100%'}}>
        <Text style={styles.header_text}>Daka</Text>
        <Text style={styles.description}>Ứng dụng giúp học từ vựng 1 cách hiệu quả!</Text>
        <LoginFB
        />
        </ImageBackground>
      </View>

    );
  }
}
export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 5,
    backgroundColor: '#f3f3f3',
  },
  header_text: {
    fontWeight: 'bold',
    fontSize: 67,
    textAlign: 'center',
    color: '#34495E',
    paddingTop: 30,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 0,
    opacity: 0.5,
  },
});
