import React from 'react';
import { Alert, TextInput, Text, StyleSheet, View, Dimensions, YellowBox, } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { LinearGradient  } from 'expo';
import SwiperFlatList from 'react-native-swiper-flatlist';
YellowBox.ignoreWarnings(['VirtualizedList']);
YellowBox.ignoreWarnings(['Warning:']);
class AddVocabToExam extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      topic: '' ,
      tuVung: [],
      yNghia: [],
      num: [1,2,3],
      vocab: [],
      exam: [],
      merge: [],
      currentIndex: 0,
      True: 0,
      False: 0,
      result: [],
      selected:true,
    };
  }
  checkResult(arr,T,F){
    T=0;F=0;
    arr.forEach(item=>{
      if(item==="True") T++;
      else F++;
    })
  }
  scrollToIndex = (press) => {
    var T=0; 
    var F=0;
    let len = this.state.answer.length;
    var check = this.props.navigation.state.params.answer.indexOf(this.state.answer[this.swiperFlatListRef.getCurrentIndex()]);
    var itemIndex = this.state.answer[this.swiperFlatListRef.getCurrentIndex()];
    var itemIndexTemp = itemIndex.substr(0,itemIndex.indexOf(':'));
    var itemFalse='';
    this.props.navigation.state.params.answer.forEach(item =>{
      if(item.indexOf(itemIndexTemp)>-1) itemFalse=item;
    })
    if(press==="True"&&check>-1) 
      this.state.result[this.swiperFlatListRef.getCurrentIndex()]="True";
    else if(press==="False"&&check==-1) 
      this.state.result[this.swiperFlatListRef.getCurrentIndex()]="True";
    else {
      var temp = this.state.result[this.swiperFlatListRef.getCurrentIndex()];
      this.state.result[this.swiperFlatListRef.getCurrentIndex()]="False ("+itemFalse+")";
    }
    if(this.swiperFlatListRef.getCurrentIndex()>=0&&this.swiperFlatListRef.getCurrentIndex()<len-1){
      try{
        this.swiperFlatListRef.scrollToIndex(this.swiperFlatListRef.getCurrentIndex()+1);
      }
      catch(ex){
        console.log(ex)
      }
    }
    else if(this.swiperFlatListRef.getCurrentIndex()==len-1){
      this.state.result.forEach(item=>{
        if(item==="True") T++;
        else F++;
      })
      Alert.alert(
        'Hoàn thành',
        "So cau dung: "+T+" So cau sai: "+F,
        [
          {text: 'Ok', onPress: () => {this.swiperFlatListRef.scrollToIndex(0); this.setState({selected:false})}, style: 'cancel'},
        ],
        { cancelable: false }
      )
    }
    /*var string='';
    string += this.state.True;
    console.log(string);
    console.log("So cau dung: "+this.state.True);
    console.log("So cau sai: "+this.state.False);*/
  }
  sumExam = () => {
    let len = this.state.answer.length;
    var sum=(this.swiperFlatListRef.getCurrentIndex()+"/"+len);
    return sum;
  }
  close = () => {
    this.props.navigation.navigate('TopicVocab',{ topicid: this.props.navigation.state.params.topicid , vocab: this.props.navigation.state.params.vocab });
  }
  componentWillMount(){
    var exam = [];
    this.props.navigation.state.params.exam.forEach(item=> {
      exam.push(item.key);
    })
    var answer = [];
    answer = this.props.navigation.state.params.answer.concat(exam,this.props.navigation.state.params.answer);
    var merge = [];
    answer.sort(function() {  
      return Math.random() - 0.3
    });
    this.deduplicate(answer, merge);
    answer = merge;
    merge = this.props.navigation.state.params.answer.concat(exam,this.props.navigation.state.params.answer);
    merge.sort(function() {  
      return Math.random() - 0.3
    });
    console.log(merge)
    this.setState({
      exam: this.props.navigation.state.params.exam,
      vocab: this.props.navigation.state.params.vocab,
      answer: merge,
      result: merge
    })
  }
 
  deduplicate(test, exam) {
    let isExist = (arr, x) => {
      for(let i = 0; i < arr.length; i++) {
        if (arr[i] === x) return true;
      }
      return false;
    }
    test.forEach(data=>{
      if(isExist(exam,data)){
        return;
      }
      else (exam.push(data))
    })
  }
  render() {
    const color = ['white','white'];
    return (
      <View style={{height:'100%',width:'100%',flex:1}}> 
        <Header
        containerStyle={{
        backgroundColor: 'white',
        justifyContent: 'space-around',
        height: 50,
        }}
        placement="left"
        leftComponent={{ icon: 'arrow-back', color: '#ee6e73', onPress: () => this.close()}}
        centerComponent={{ text: 'Exam' }}
        />
        <View>
      <SwiperFlatList
              data={this.state.answer}
              ref={(ref) => { this.swiperFlatListRef = ref; }}
              keyExtractor={(item, index) => index + '.'}
              showPagination='true'
              paginationDefaultColor='#ee6e73'
              paginationActiveColor='#ffb88c'
              paginationStyleItem={{flex:2,borderRadius:0,marginRight:0,marginLeft:0,paddingRight:0,height:'10%',width:'5%'}}
              paginationStyle={{flex:2,justifyContent: 'center',alignItems: 'center',width:'100%',left:5,top:10,height:'5%',marginRight:0,padding:0,textAlign: 'center'}}
              renderItem={({item,index}) => 
              <View>
              <View
                style={[styles.child]}>
               <Text style={{width:'100%',color:'black',fontSize: 40, marginTop:'40%',justifyContent: 'center',alignItems: 'center', textAlign: 'center' }}>{item}</Text> 
              </View>
              </View>
              }
         />
              {this.state.selected? <Icon
                type='feather'
                name='x'
                color='#B40022'
                size={100}
                onPress={()=> {this.scrollToIndex('False')}}
                containerStyle={{position: 'absolute',bottom:-300, right:'4%'}}
              />:null}
               {this.state.selected ?<Icon
                type='feather'
                name='check'
                color='#7fff00'
                size={90}
                onPress={()=> {this.scrollToIndex('True')}}
                containerStyle={{position: 'absolute',bottom:-300, left:'4%'}}
              />:null}
        </View> 
      </View>  
    )
  }
}
export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center',
    borderRadius:2,
    fontSize: 30,
  },
});
export default AddVocabToExam;



