import React from 'react';
import * as firebase from 'firebase';
import { Text, View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient  } from 'expo';
import { Icon, SearchBar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
class ExamScreen extends React.Component {
  static navigationOptions = {
    title: 'Kiểm tra',
  };
  constructor(props) {
      super(props)
      this.state = {
        tuvung : [],
        textInputs: '',
        temp : [],
        vocab:[],
      }
      this.database = firebase.database();
      this.Vocab = this.database.ref('vocab');
   };
   updateState = () => {
     var that=this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('/users/'+user.uid+'/exam/')
        .once('value',snapshotItem=>{
          var vocab=[];
          snapshotItem.forEach(item=>{
            vocab.push(item.key)
          })
          that.setState({tuvung:vocab})
          //console.log(Object.values(snapshotItem.val()).values().next().value);
        })        
        /*firebase.database()
        .ref('/users/'+user.uid+'/exam/'+topic+'/')
        .once('value').then(function(snapshot){
          if(snapshot.exists()) {
            snapshot.forEach(item=>{
             if(Object.values(item.val()).values().next().value==true) {
              that.setState({selected:false})
             }
            })
          }
          //return (selected);
        })*/
      }
    });

   }
   searchText = Text => {
    let newData = this.state.tuvung.filter(item => {      
      const itemData = `${item.toUpperCase()}`;
      const textData = Text.toUpperCase();
      return itemData.indexOf(textData) > -1;    
    });    
    this.setState({ tuvung: newData }); 
    var temp=this.state.temp;
    if (Text=="") this.setState({ tuvung: temp }); 
  }
  cancelSearch(){
    var temp=this.state.temp;
    this.setState({ tuvung: temp });  
  }
  makeVocab(item){
    var that=this;
    var temp =[];
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('/users/'+user.uid+'/exam/'+item)
        .once('value',snapshotItem=>{
          var vocab=[];
          snapshotItem.forEach(item=>{
            if(Object.values(item.val()).values().next().value!=true)
            vocab.push(item.val())
            //vocab.push(Object.values(item.val()).values().next().value)
          })
          vocab.forEach(item=>{
            var data,key;
            data=item.substr(0,item.indexOf(':'))
            key=item.substr(item.indexOf(':')+1,item.length)
            temp.push({
              data:key,
              key:data
            })
          })
          console.log(temp)
          that.setState({vocab:temp})
        }) 
      }
    });
    this.props.navigation.navigate('TopicVocab', { topicid: item , vocab: temp, from: 'exam'});
  }
  /*
  makeVocab(item){
    var that=this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('/users/'+user.uid+'/exam/'+item)
        .once('value',snapshotItem=>{
          var vocab=[];
          snapshotItem.forEach(item=>{
            vocab.push(Object.values(item.val()).values().next().value)
          })
          var temp =[];
          vocab.splice(vocab.indexOf('true',1));
          vocab.forEach(item=>{
            var data,key;
            data=item.substr(0,item.indexOf(':'))
            key=item.substr(item.indexOf(':')+1,item.length)
            temp.push({
              data:data,
              key:key
            })
            console.log(data+key)
          })
          that.setState({vocab:vocab})
        }) 
      }
    });
  }
  */ 
  componentWillMount(){
     this.updateState();
   }
  render() {
    
    const color = ['rgba(255, 81, 47,0.8)','rgba(221, 36, 118,0.8)'];
    return (
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>  
        <View style={{width:350, margin: 0, padding:0}}>
        <SearchBar      
        lightTheme        
        round        
        onChangeText={(text) => { 
          let textInputs = text;
                    this.setState({
                      textInputs,
                    });
          this.searchText(textInputs)}
        } 
        value={this.state.textInputs}
        onClear={()=>this.cancelSearch()}
        containerStyle={{backgroundColor: 'white', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
        />
        </View>
          <FlatList
              data={this.state.tuvung}
              keyExtractor={(item, index) => index + '.'}
              numColumns={2}
              renderItem={({item}) => <View><TouchableScale style={styles.itemList} onPress={() => {this.makeVocab(item)}}><LinearGradient start={{ x: 1.0, y: 0.0 }} end={{ x: 0.2, y: 0 }}
                            style={styles.item} colors={color}><Text style={{color:'white', fontSize: 18, textAlign: 'center', textShadowColor: 'black'}}>{item}</Text></LinearGradient ></TouchableScale></View>}
         />
        </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  itemList: {
    margin: 10,
  },
  item: {
    height: 100,
    width: 150,
    borderRadius: 5,
    paddingTop: '20%',
    opacity: 1,
  },
})
export default ExamScreen;
