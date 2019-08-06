import React from 'react';
import { Alert, Text, View, Image, StyleSheet, FlatList } from 'react-native';
import * as firebase from 'firebase';
import TouchableScale from 'react-native-touchable-scale';
import { Icon } from 'react-native-elements';
class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Hồ sơ',
  };
  _signOut(){
    firebase.auth().signOut();
  }
  constructor(props) {
      super(props)
      this.State = {
        name: '',
        email: '',
        photoURL: '',
        emailVerified: '',
        uid: '',
        ownTopic: '',
        temp: [],
      }
   }
   updateState = () => {
     const user = firebase.auth().currentUser;
     if (user) {
       this.setState({
       name: user.displayName,
       email : user.email,
       photoUrl : user.photoURL,
       uid : user.uid
     })
     var that=this;
     firebase.database()
        .ref('/topic')
        .once('value',snapshotItem=>{
          var topic=[];
          Object.keys(snapshotItem.val()).forEach(item=>{
            firebase.database()
            .ref('/topic/'+item+'/')
            .once('value',snapTopic=>{
              if(snapTopic.val().uid==user.uid){
                topic.push(item);
              }
            })
          })
          that.setState({
            ownTopic:topic,
          })
        }) 
     } else {

     }
   }
    delete(topicid){
      Alert.alert(
        'Chú ý',
        'Chủ đề sẽ không thể phục hồi sau khi xóa!',
        [
          {text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Xóa', onPress: () => 
        {
          this.deleteTopic(topicid);
          this.props.navigation.navigate('ProfileScreen');
        }},
        ],
        { cancelable: false }
      )
    }
    deleteTopic(topicid){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database()
          .ref('topic/'+topicid)
          .once('value').then(function(dataSnapshot,error) {
            try{
              if(error||!dataSnapshot) return ;
              else if(dataSnapshot.val().uid===user.uid){
                firebase.database().ref('topic/'+topicid).remove().then(()=> {return;})
              }
            }
            catch(exception){
            }
          })  
        } else {
        }
        });
        this.setState({
          ownTopic: this.state.ownTopic.filter(function(ele){
            return ele != topicid;
        })
        })
    }
    showVocab(topicid, vocab){
      this.props.navigation.navigate('TopicVocab', { topicid: topicid , vocab: vocab, from : "profile" });
    }
   componentWillMount(){
    this.updateState();
   }
  render() {
    //this.updateState();
    const avatar = this.state.photoUrl+'?type=large';
    return (
      <View style={{flex:1,backgroundColor:'#F0F0F0', paddingTop:10, alignItems: 'center',
      textAlign: 'center',}}>
        <View style={styles.card}>
        <Image
          style={{borderWidth:2,borderColor:'rgba(255, 81, 47,0.5)',width: 100, height: 100, borderRadius: 50, marginBottom:10}}
          source={{uri: avatar}}
        />
        <Text style={{fontWeight:'bold',color:'rgba(255, 81, 47,0.8)', fontSize:16, textAlign: 'center'}}>{this.state.name}</Text>
      </View>
        <View style={styles.item}>
          <Text style={{fontWeight:'bold',color:'rgba(255, 81, 47,0.8)'}}>UID: </Text>
          <Text>{this.state.uid}</Text>
        </View>
        <View style={styles.item}>
          <Text style={{fontWeight:'bold',color:'rgba(255, 81, 47,0.8)'}}>Email: </Text>
          <Text>{this.state.email}</Text>
        </View>
        <View style={styles.item}>
        <View style={{flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center', textAlign: 'center'}}>
          <Text style={{flexDirection:'row',fontWeight:'bold',color:'rgba(255, 81, 47,0.8)', fontSize:16,marginLeft:0,marginRight:4, textAlign: 'center'}} onPress={() => this._signOut()}>Đăng xuất</Text>
          <Icon
                type='feather'
                name='log-out'
                size={14}
                color='rgba(255, 81, 47,0.6)'
                underlayColor='white'
                />
          <Text style={{flexDirection:'row',fontWeight:'bold',color:'rgba(255, 81, 47,0.8)', fontSize:16,marginLeft:'30%',marginRight:4, textAlign: 'center'}} onPress={() => alert("Daka 1.0 - Huỳnh Đăng Khoa")}> Thông tin</Text>  
          <Icon
                type='feather'
                name='info'
                size={14}
                color='rgba(255, 81, 47,0.6)'
                underlayColor='white'
                />
        </View>
        </View>
        <View style={styles.panel}>
          <Text style={{fontWeight:'bold',color:'white', fontSize:16, textAlign: 'center', paddingTop:'2%'}}>Các chủ đề của bạn</Text>
        </View>
        <FlatList
              data={this.state.ownTopic}
              keyExtractor={(item, index) => index + '.'}
              numColumns={2}
              renderItem={({item,index}) => 
              <TouchableScale style={styles.topicCard}
                onPress={() => {
                  firebase.database()
                  .ref('topic/'+item)
                  .on('value', dataSnapshot => {
                    let vocab = [];
                    dataSnapshot.forEach(data => {
                      vocab.push({
                        key: data.key,
                        data: data.val().mean
                      });
                      this.setState({
                        vocab: vocab,
                        topicid: item,
                      });
                      this.showVocab(item,vocab);
                    }); 
                    vocab.forEach(item=>{
                      if(item.key=="uid") vocab.splice(vocab.indexOf(item),1);
                    })
                  });
                }
              }
              >
               <Text style={{color:'black',fontSize: 15, textAlign: 'center', marginTop:25, textShadowColor: 'rgba(0, 0, 0, 0.35)', textShadowOffset: {width: -0.5, height: 0.5},textShadowRadius: 5 }}>{item}</Text>  
               <Icon
                type='feather'
                name='x-circle'
                size={16}
                color='rgba(255, 81, 47,0.6)'
                underlayColor='white'
                onPress={()=> {this.delete(item)}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"6%", right:"2%"}}
                />
              </TouchableScale>
              }
         />
      </View>
    );
  }
}
const styles =  StyleSheet.create({
  card:{
    justifyContent: 'center', alignItems: 'center',
    textAlign: 'center',
    backgroundColor:'white',
    flexDirection:'column',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
    width: '90%',
    height: '25%',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    
    
  },
  topicCard:{
    borderRadius: 2,
    backgroundColor:'white',
    shadowRadius: 6,
    elevation: 3,
    margin: 5,
    width: 170,
    height: 80,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    
    
  },
  item:{
    marginBottom: 2,
    paddingLeft:'4%',
    backgroundColor:'white',
    flexDirection:'column',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    paddingTop: '3%',
    width: '90%',
    height: '10%',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    borderLeftWidth: 2,
    borderColor:'rgba(255, 81, 47,0.8)',
    
  },
  panel:{
    backgroundColor:'rgba(255, 81, 47,0.9)',
    marginTop: 10,
    paddingLeft:'4%',
    flexDirection:'column',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    paddingTop: '1%',
    width: '90%',
    height: '8%',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    
  },
})
export default ProfileScreen;
