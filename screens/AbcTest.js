import React from 'react';
import { Alert, Icon, Text, Dimensions, StyleSheet, View, FlatList, YellowBox} from 'react-native';
import { Header, Tooltip } from 'react-native-elements';
import * as firebase from 'firebase';
import TouchableScale from 'react-native-touchable-scale';
import SwiperFlatList from 'react-native-swiper-flatlist';
YellowBox.ignoreWarnings(['VirtualizedList']);
YellowBox.ignoreWarnings(['Warning:']);
class AbcTest extends React.Component {
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
      edit:true,
      push:[]
    };
  }
  checkResult(arr,T,F){
    T=0;F=0;
    arr.forEach(item=>{
      if(item==="True") T++;
      else F++;
    })
  }
  scrollToIndex = (vocab) => {
    var T=0;
    var F=0;
    var that=this;
    let len = this.state.answer.length;
    dapan = this.state.answer[this.swiperFlatListRef.getCurrentIndex()].dapan;
    var nextVocab = []
    var check = dapan==vocab
    console.log(check)
    var right = '';
    this.state.right.forEach(item=>{
      if(item.indexOf(this.state.answer[this.swiperFlatListRef.getCurrentIndex()]) >-1) right=item;
    })
    if(check==true) 
      {
        this.state.result[this.swiperFlatListRef.getCurrentIndex()]="True";
        this.state.answer[this.swiperFlatListRef.getCurrentIndex()].empty="dung"
      }
    else {
      this.state.result[this.swiperFlatListRef.getCurrentIndex()]="False";
      this.state.answer[this.swiperFlatListRef.getCurrentIndex()].empty="Sai! Bạn chọn "+vocab+" đáp án là "+dapan;
      /*firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.database()
          .ref('/users/'+user.uid+'/exam/Từ vựng chưa thuộc/')
          .once('value',snapshot=>{
            var exist;
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                firebase.database()
                .ref('/users/'+user.uid+'/exam/Từ vựng chưa thuộc/')
                .once('value',snapshot=>{
                  if(!snapshot.exists()) {
                        
                        //if(exist==-1){
                          firebase.database()
                          .ref('/users/'+user.uid+'/exam/Từ vựng chưa thuộc/')
                          .push(that.state.right[that.swiperFlatListRef.getCurrentIndex()]);
                        //}
                  }
                  else {
                    var arr = Object.values(snapshot.val())
                    exist = (arr.indexOf(that.state.right[that.swiperFlatListRef.getCurrentIndex()]))                   
                    if(exist==-1){
                      firebase.database()
                      .ref('/users/'+user.uid+'/exam/Từ vựng chưa thuộc/')
                      .push(that.state.right[that.swiperFlatListRef.getCurrentIndex()]);
                    }
                  }
                })
              }
            });
          })
        }
      });*/
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
  createRD = () =>{
    var exam = [];
    this.props.navigation.state.params.exam.forEach(item=> {
      exam.push(item.key);
    })
    var answer = this.props.navigation.state.params.answer;
    var vocab =[];
    var right = [];
    var temp = [];
    temp = answer;
    answer.forEach(item=>{
      data=item.substr(0,item.indexOf(':'))
      key=item.substr(item.indexOf(':')+1,item.length)
      right.push(data+":"+key)
      right.push(key+":"+data)
      var A="",B="",C="",D="";
      while(A!=data && B!=data && C!=data && D!=data){
        if(Math.random()>0&&Math.random()<=0.25) A=data;
        else if(Math.random()>0.25&&Math.random()<=0.5) B=data;
        else if(Math.random()>0.5&&Math.random()<=0.75) C=data;
        else D=data
      }
      var BCD = [];
      temp.forEach(bcd=>{
        data1=bcd.substr(0,bcd.indexOf(':'))
        key1=bcd.substr(bcd.indexOf(':')+1,bcd.length)
        if(data1!=data) BCD.push(data1)
      })
      var BCD1 = BCD;
      if(A=="") {
        A=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(A),1)
      }
      if(B=="") {
        B=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(B),1)
      }
      if(C=="") {
        C=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(C),1)
      }
      if(D=="") {
        D=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(D),1)
      }
      vocab.push({
        vocab:key,
        dapan:data,
        empty:'',
        A:A,
        B:B,
        C:C,
        D:D
      })
    })
    answer.forEach(item=>{
      data=item.substr(0,item.indexOf(':'))
      key=item.substr(item.indexOf(':')+1,item.length)
      var A="",B="",C="",D="";
      while(A!=key && B!=key && C!=key && D!=key){
        if(Math.random()>0&&Math.random()<=0.25) A=key;
        else if(Math.random()>0.25&&Math.random()<=0.5) B=key;
        else if(Math.random()>0.5&&Math.random()<=0.75) C=key;
        else D=key
      }
      var BCD = [];
      temp.forEach(bcd=>{
        key1=bcd.substr(bcd.indexOf(':')+1,bcd.length)
        if(key1!=key) BCD.push(key1)
      })
      var BCD1 = BCD;
      if(A=="") {
        A=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(A),1)
      }
      if(B=="") {
        B=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(B),1)
      }
      if(C=="") {
        C=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(C),1)
      }
      if(D=="") {
        D=BCD1[(Math.random() * (BCD1.length - 1)).toFixed()];
        BCD1.splice(BCD1.indexOf(D),1)
      }
      vocab.push({
        vocab:data,
        dapan:key,
        empty:'',
        A:A,
        B:B,
        C:C,
        D:D
      })
    })
    this.setState({
      right:right
    })
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
  componentWillMount(){
    this.createRD();
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
    console.log(this.props.navigation.state.params.vocabtest)
    const color = ['white','white'];
    const test = [];
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
               <Text style={{width:'100%',color:'black',fontSize: 40, marginTop:'30%',justifyContent: 'center',alignItems: 'center', textAlign: 'center' }}>{item.vocab}</Text> 
               {item.empty!="dung"?<Text style={{width:'100%',color:'#ee6e73',fontSize: 20, marginTop:'5%',justifyContent: 'center',alignItems: 'center', textAlign: 'center' }}>{item.empty}</Text> :null}
               {item.empty=="dung"?<Text style={{width:'100%',color:'green',fontSize: 40, marginTop:'5%',justifyContent: 'center',alignItems: 'center', textAlign: 'center' }}>✔</Text>:null}
               </View>
               <View  style={{alignItems: 'center', textAlign: 'center'}}>
               <FlatList
              data={[item.A,item.B,item.C,item.D]}
              keyExtractor={(item, index) => index + '.'}
              numColumns={2}
              renderItem={({item,index}) => 
              <TouchableScale style={styles.topicCard} disabled={this.state.selected}
                onPress={() => {this.scrollToIndex(item,item.dapan);}
              }
              >
               <Text style={{color:'black',fontSize: 15, textAlign: 'center', marginTop:25, textShadowColor: 'rgba(0, 0, 0, 0.35)', textShadowOffset: {width: -0.5, height: 0.5},textShadowRadius: 5 }}>{item}</Text>  
              </TouchableScale>
              }
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
});
export default AbcTest;




