import React from 'react';
import { Alert, TextInput, Text, Dimensions, StyleSheet, View, FlatList, YellowBox, AsyncStorage} from 'react-native';
import { Header, Tooltip } from 'react-native-elements';
import * as firebase from 'firebase';
import { LinearGradient  } from 'expo';
import SwiperFlatList from 'react-native-swiper-flatlist';
YellowBox.ignoreWarnings(['VirtualizedList']);
YellowBox.ignoreWarnings(['Warning:']);
class WriteTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      topic: '' ,
      tuVung: [],
      yNghia: [],
      num: [1,2,3],
      vocab: [],
      exam: [],
      test: [],
      currentIndex: 0,
      True: 0,
      False: 0,
      result: [],
      right: [],
      selected: false,
      tuvung: [],
      edit:true
    };
  }
  checkResult(arr,T,F){
    T=0;F=0;
    arr.forEach(item=>{
      if(item==="True") T++;
      else F++;
    })
  }
  scrollToIndex = () => {
    var T=0;
    var F=0;
    let len = this.state.answer.length;
    var dapan = [];
    this.state.right.forEach(item=>{
      dapan.push(item.toUpperCase())
    })
    var nextVocab = []
    var vocabSubmit = this.state.answer[this.swiperFlatListRef.getCurrentIndex()]+":"+this.state.tuvung[this.swiperFlatListRef.getCurrentIndex()];
    var check = dapan.indexOf(vocabSubmit.toUpperCase())
    var right = '';
    this.state.right.forEach(item=>{
      if(item.indexOf(this.state.answer[this.swiperFlatListRef.getCurrentIndex()]) >-1) right=item;
    })
    console.log(right)
    if(check>-1) 
      {
        this.state.result[this.swiperFlatListRef.getCurrentIndex()]="True";
      }
    else {
      this.state.result[this.swiperFlatListRef.getCurrentIndex()]="False";
      this.state.tuvung[this.swiperFlatListRef.getCurrentIndex()]="Sai! bạn ghi "+this.state.tuvung[this.swiperFlatListRef.getCurrentIndex()]+" Đáp án: "+right;
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
          {text: 'Ok', onPress: () => {this.swiperFlatListRef.scrollToIndex(0);this.setState({selected:true,edit:false})}, style: 'cancel'},
        ],
        { cancelable: false }
      )
    }
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
    var answer = this.props.navigation.state.params.answer;
    var vocab =[];
    var right = [];
    answer.forEach(item=>{
      data=item.substr(0,item.indexOf(':'))
      key=item.substr(item.indexOf(':')+1,item.length)
      right.push(data+":"+key)
      right.push(key+":"+data)
      vocab.push(data,key)
    })
    this.setState({
      right:right
    })
    console.log("right: "+right)
    /*answer = this.props.navigation.state.params.answer.concat(exam,this.props.navigation.state.params.answer);
    var merge = [];
    answer.sort(function() {  
      return Math.random() - 0.3
    });
    this.deduplicate(answer, merge);
    answer = merge;
    merge = this.props.navigation.state.params.answer.concat(exam,this.props.navigation.state.params.answer);
    merge.sort(function() {  
      return Math.random() - 0.3
    });*/
    vocab.sort(function() {  
      return Math.random() - 0.3
    });
    var temp = []
    vocab.forEach(item=>{
      temp.push("")
    })
    this.setState({
      exam: this.props.navigation.state.params.exam,
      vocab: this.props.navigation.state.params.vocab,
      answer: vocab,
      result: temp,
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
    console.log(this.state.text)
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
              scrollEnabled={this.state.selected}
              showPagination='true'
              paginationDefaultColor='#ee6e73'
              paginationActiveColor='#ffb88c'
              paginationStyleItem={{flex:2,borderRadius:0,marginRight:0,marginLeft:0,paddingRight:0,height:'10%',width:'5%'}}
              paginationStyle={{flex:2,justifyContent: 'center',alignItems: 'center',width:'100%',left:5,top:10,height:'5%',marginRight:0,padding:0}}
              renderItem={({item,index}) => 
              <View>
              <View
                style={[styles.child]}>
               <Text style={{width:'100%',color:'black',fontSize: 40, marginTop:'30%',justifyContent: 'center',alignItems: 'center', textAlign: 'center' }}>{item}</Text> 
               </View>
               <View  style={{alignItems: 'center', textAlign: 'center'}}>
               <TextInput
                style={{height: '30%',
                        width:'80%',
                        backgroundColor:'#F0F0F0', 
                        shadowRadius: 6,
                        elevation: 5,
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOffset: {
                          width: 0,
                          height: 1
                        },
                        shadowOpacity:0.5,
                        borderRadius:4,
                        justifyContent: 'center',
                        alignItems: 'center'}}
                editable={this.state.edit}
                onChangeText={text => {
                    let { tuvung } = this.state;
                    tuvung[index] = text;
                    if(this._mounted) {  
                      this.setState({
                        tuvung,
                      });
                    }
                  }}
                  value={this.state.tuvung[index]}
                onSubmitEditing={()=>this.scrollToIndex()}
              />
               </View>
              </View>
              }
         />
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
export default WriteTest;




