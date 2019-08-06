import React from 'react';
import * as firebase from 'firebase';
import { Text, View, Button, FlatList, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient  } from 'expo';
import { Icon, SearchBar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
class VocabScreen extends React.Component {
  static navigationOptions = {
    title: 'Từ vựng',

  };
  constructor(props) {
      super(props)
      this.state = {
        tuvung : [],
        temp : [],
        textInputs: '',
        tienganh: 'abc',
        data : '',
        topicid: '',
        vocab: [],
        uid: '',
        color: '',
        topicList: [],
        bgColor: [
          "['#de6262','#ffb88c']",
          "['#06beb6','#48b1bf']",
          "['#d66d75','#e29587']",
        ],
        selectedColor: '',
      }
      this.database = firebase.database();
      this.Vocab = this.database.ref('vocab');
      
   };
   updateState = () => {
     firebase.database()
      .ref('topic')
      .on('value', dataSnapshot => {
        let items = [];
        dataSnapshot.forEach(data => {
          items.push({
            key: data.key,
            data: data.val()
          });
        });
        this.setState({
          tuvung: items,
          temp: items
        });
      });
      
   }
   componentWillMount(){
     this.updateState();
     this._getRandomColor();
     const color = ['#ff512f','#dd2476'];
   }
   _getRandomColor(){
      var item = this.state.bgColor[Math.floor(Math.random()*this.state.bgColor.length)];
      this.setState({
        selectedColor: item,
      })
    }

   showVocab(topicid, vocab){
     this.props.navigation.navigate('TopicVocab', { topicid: topicid , vocab: vocab, uid : this.state.uid });
   }
   addVocab = () => {
     this.props.navigation.navigate('AddVocab');
   }
   searchText = Text => {
    let newData = this.state.tuvung.filter(item => {      
      const itemData = `${item.key.toUpperCase()}`;
      const textData = Text.toUpperCase();
      return itemData.indexOf(textData) > -1;    
    });    
    this.setState({ tuvung: newData, textInputs:Text }); 
    var temp=this.state.temp;
    if (Text=="") this.setState({ tuvung: temp }); 
  }
  cancelSearch(){
    var temp=this.state.temp;
    this.setState({ tuvung: temp });  
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
              renderItem={({item}) => <View><TouchableScale style={styles.itemList} onPress={() => {
                firebase.database()
                 .ref('topic/'+item.key)
                 .on('value', dataSnapshot => {
                   let vocab = [];
                   dataSnapshot.forEach(data => {
                     vocab.push({
                       key: data.key,
                       data: data.val().mean
                     });
                     this.setState({
                       vocab: vocab,
                       topicid: item.key,
                       uid: item.uid,
                     });
                     this.showVocab(item.key,vocab);
                   }); 
                   vocab.forEach(item=>{
                     if(item.key=="uid") vocab.splice(vocab.indexOf(item),1);
                   })
                 });
              }
            }><LinearGradient start={{ x: 1.0, y: 0.0 }} end={{ x: 0.2, y: 0 }}
                            style={styles.item} colors={color}><Text style={{color:'white', fontSize: 18, textAlign: 'center', textShadowColor: 'black'}}>{item.key}</Text></LinearGradient ></TouchableScale></View>}
         />
        <Icon
         name='add'
         color='tomato'
         underlayColor='grey'
         onPress={()=> {this.addVocab()}}
         raised
         reverse
         containerStyle={{bottom:10, right: 10, position:'absolute'}}
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
export default VocabScreen;
