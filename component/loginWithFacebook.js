import React from 'react';
import * as firebase from 'firebase';
import { Button, ThemeProvider, SocialIcon } from 'react-native-elements';
import { Alert, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
const firebaseConfig = {
  apiKey: "AIzaSyAMrJXLEPTlkQWkLg5xkOcZWLnGPee4rd4",
  authDomain: "daka-89e89.firebaseapp.com",
  databaseURL: "https://daka-89e89.firebaseio.com",
  projectId: "daka-89e89",
  storageBucket: "daka-89e89.appspot.com",
  messagingSenderId: "772953289424"
};

firebase.initializeApp(firebaseConfig);

const _loginWithGoogle = async function() {
  try {

    const result = await Expo.Google.logInAsync({
      //772953289424-1rvn950erp42vls9v1ki22245eh8g6i3.apps.googleusercontent.com
      webClientId:"772953289424-blsnfafl37i124imkf2oqlelkvckuoo7.apps.googleusercontent.com",
      androidClientId:"772953289424-p66s1uoi62hf01bc62idbv3j8b1rr0nh.apps.googleusercontent.com",
      iosClientId:"772953289424-p66s1uoi62hf01bc62idbv3j8b1rr0nh.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
    });

    if (result.type === "success") {
      const { idToken, accessToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(res => {
        })
        .catch(error => {
          console.log("firebase cred err:", error);
        });
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database()
          .ref('/users/'+user.uid)
          .once('value',snapshot=>{
            if(snapshot.exists()){ console.log("Da ton tai!")}
            else {
              firebase.database()
              .ref('/users/'+user.uid)
              .set({
                name: user.displayName,
                gmail: user.email,
              })
            }
          })
        } else {
          // No user is signed in.
        }
      });
    } else {
      return { cancelled: true };
    }
  } catch (err) {
    console.log("err:", err);
  }
};
async function loginWithFacebook() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '393441398097951',
    { permissions: ['public_profile'] }
  );

  if (type === 'success') {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(res => {
        })
        .catch(error => {
          console.log("firebase cred err:", error);
        });
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database()
          .ref('/users/'+user.uid)
          .once('value',snapshot=>{
            if(snapshot.exists()){ console.log("Da ton tai!")}
            else {
              firebase.database()
              .ref('/users/'+user.uid)
              .set({
                name: user.displayName,
                gmail: user.email,
              })
            }
          })
        } else {
          // No user is signed in.
        }
      });
  }
}
export default class LoginFB extends React.Component {
  _loginWithFacebook() {
    loginWithFacebook();
  }
  render() {
    return (
      <View style={styles.header}>
        <SocialIcon
          style={styles.loginfb}
          title='Sign In With Facebook'
          button type='facebook'
          onPress={()=>this._loginWithFacebook()}
        />
        <SocialIcon
          style={styles.logingg}
          title='Sign In With Google'
          button type='google'
          onPress={()=>_loginWithGoogle()}
        />
        </View>

    );
  }
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: '75%',
  },
  loginfb: {
    borderRadius: 5,
    backgroundColor: '#2574A9',
  },
  logingg: {
    borderRadius: 5,
    backgroundColor: 'orange',
  },
  fbtext: {
    textShadowColor: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    color: 'white',
    fontSize: 15,
  },
});
