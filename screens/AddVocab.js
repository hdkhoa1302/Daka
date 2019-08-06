import React from 'react';
import { ScrollView, TextInput, Text, TouchableOpacity, StyleSheet, View, FlatList, YellowBox} from 'react-native';
import { Header, Icon, Divider } from 'react-native-elements';
import * as firebase from 'firebase';
YellowBox.ignoreWarnings(['VirtualizedList']);
YellowBox.ignoreWarnings(['Warning:']);
import TouchableScale from 'react-native-touchable-scale';
class AddVocab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      topic: '' ,
      tuVung: [],
      yNghia: [],
      goiY: [],
      height:100,
      num: [1],
      temp:[],
      wiki:''

    };
    this.addColum = this.addColum.bind(this);
  }
  close = () => {
    this.props.navigation.navigate('VocabScreen');
  }
  addColum(){
    let numLen = this.state.num.length+1;
    let numAdd = this.state.num;
    numAdd.push(numLen);
    this.setState({
      num: numAdd,
    })
  }
  getTopic = async function(text,index) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) { 
        var ipa = request.responseText.substr(request.responseText.indexOf('green bold margin25 m-top15">'),100);
        item =ipa.substr(ipa.indexOf('green bold margin25 m-top15">')+29,ipa.indexOf('</div>')-29);
        console.log(item)
        let { goiY } = this.state;
                    goiY[index] = item;
                    if(this._mounted) {  
                      this.setState({
                        goiY,
                      });
                    }
      } else {
      }
    };

    request.open('GET', 'https://dict.laban.vn/find?type=1&query='+text);
    request.send();
  }
  getGoiY= async function(text,index) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) { 
        var ipa = request.responseText.substr(request.responseText.indexOf('Showing results for '),200);
        var keyWord = ';search=';
        var start = ipa.indexOf(keyWord)+keyWord.length;
        var cut = ipa.substr(start,ipa.length);
        var end = cut.indexOf('&amp;fulltext');
        item =ipa.substr(start,end);
        let { temp } = this.state;
          temp[index] = item;
                    if(this._mounted) {  
                      this.setState({
                        temp
                      });
                    }
      } else {
        console.error()
      }
    };

    request.open('GET', 'https://en.wikipedia.org/w/index.php?search='+text+'&ns0=1');
    request.send();
  }
  _mounted = false;
  componentWillMount(){
    this._mounted = true;
  }
  componentWillUnmount () {
    this._mounted = false;
    
 }
 componentDidMount() {
  this.setState({})
 }
 
  render() {
    const listData=[{text:'',selected:null}];
    var temp = [];
    return (
      <ScrollView style={{backgroundColor:'#F0F0F0',height:this.state.height+"%"}}> 
        <Header
        containerStyle={{
        backgroundColor: '#FF4E50',
        height: 60,
        justifyContent: 'space-around',
        color:'white'
        }}
        placement="left"
        leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.close()}}
        rightComponent={{ icon: 'done', color: '#fff', onPress: () => 
        {
            let dataT=this.state.tuVung;
            let dataY=this.state.yNghia;
            let topic=this.state.topic;
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  firebase.database()
                  .ref('/topic/'+topic)
                  .set({
                    uid: user.uid,
                  })
                  for(let i=0; i<dataY.length; i++){
                    firebase.database()
                      .ref('/topic/'+topic+'/'+dataT[i])
                        .set({
                              mean: dataY[i],
                            })    
                  }
                } else {
                }
            });
            alert("Done!");
            this.props.navigation.navigate('VocabScreen');
          }
        }}
        />
        
        <View style={{backgroundColor: '#F0F0F0',marginTop:40,alignItems: 'center',justifyContent: 'center'}}>
        
         <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:18, fontWeight:'bold'}}>Chủ đề</Text>
        <TextInput
          clearButtonMode="always" 
          style={{elevation:3,borderWidth:4,borderColor:'white',backgroundColor: 'white',marginTop:5,textAlign: 'left',borderRadius:3,width:'70%', height: 40}}
          onChangeText={(text) => {if(this._mounted) {this.setState({topic: text})}}}
        />
        </View>
         <View style={[styles.container,{marginTop:50}]}>
         <View style={styles.box1}>
         <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:16, fontWeight:'bold'}}>Từ vựng</Text>
         <FlatList
          style={{ flex: 1}}
          data={this.state.num}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  height: 30,
                  backgroundColor: '#F0F0F0',
                  width: "100%",
                  alignSelf: 'center',
                  margin: 10,
                }}
              >
                <TextInput
                  onChangeText={text => {
                    if(index==this.state.num.length-1) this.addColum(text,index)
                    this.getTopic(text,index)
                    this.getGoiY(text,index)
                    let {tuVung} = this.state;
                    tuVung[index] = text;
                    this.setState({
                        tuVung: tuVung,
                        yNghia:this.state.goiY
                      });
                  }}
                  value={this.state.tuVung[index]}
                />
                <View style={{alignItems: 'center',justifyContent: 'center',backgroundColor:'white',position:'absolute',top:3,right:10,height:20, borderColor:'white',opacity:0.8,borderWidth:2,borderRadius:3}}>
                <TouchableScale onPress={()=>{
                  let {tuVung} = this.state;
                    tuVung[index] = this.state.temp[index];
                    this.setState({
                        tuVung: tuVung,
                      })
                      
                      let {goiY} = this.state;
                      console.log("arr: "+this.state.goiY)
                      this.getTopic(this.state.temp[index],index)
                    goiY[index] = this.state.goiY[index];
                    console.log("temp :"+this.state.temp[index])
                    console.log("goiY :"+this.state.goiY[index])
                    this.setState({
                        yNghia:goiY
                      })
                      let {temp} = this.state;
                    temp[index] = "";
                    this.setState({
                        temp: temp,
                      })
                      }}
                >
                <Text style={{fontSize:16,color:'red'}}>
                {this.state.temp[index]}
                </Text>
              </TouchableScale>
              </View> 
              </View>
            );
          }}
        />
        </View>
        <View style={styles.box2}>
        <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:16, fontWeight:'bold'}}>Nghĩa</Text>
        <FlatList
          style={{ flex: 1}}
          data={this.state.num}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  height: 30,
                  backgroundColor: '#F0F0F0',
                  width: "100%",
                  alignSelf: 'center',
                  margin: 10,
                }}
              >
                <TextInput
                  onChangeText={text => {
                    let {yNghia} = this.state;
                    yNghia[index] = text;
                    this.setState({
                      yNghia,
                    });
                  }}
                  value={this.state.yNghia[index]}
                />
              </View>
            );
          }}
        />
        </View>
      </View>
      <TouchableOpacity onPress={()=>{
        this.addColum();
      }}><Icon
         name='add'
         color='tomato'
         underlayColor='grey'
         raised
         reverse
         containerStyle={{paddingBottom: 330, paddingLeft: 270}}
         /></TouchableOpacity>
      </ScrollView>  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  box: {
    borderRadius: 10,
    backgroundColor: 'red'
  },
  box1: {
    paddingLeft: 10,
    paddingRight: 5,
    marginLeft:10,
    width: '45%',
    backgroundColor: 'white',
    borderRadius:3,
    padding:10,
    elevation:3,
  },
  box2: {
    paddingRight: 10,
    paddingLeft: 5,
    marginLeft:15,
    padding:10,
    width: '45%',
    backgroundColor: 'white',
    borderRadius:3,
    padding:10,
    elevation:3,
  },
});
export default AddVocab;
