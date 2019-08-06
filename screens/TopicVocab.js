import React from 'react';
import { Modal, Text, Alert, View, TextInput, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { LinearGradient  } from 'expo';
import Auth from '../component/getAuth';
import Ipa from '../component/getIPA';
import GetImage from '../component/getImage';
import TouchableScale from 'react-native-touchable-scale';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { Speech } from 'expo';
class TopicVocab extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        data: this.props.navigation.state.params.topicid,
        auth: '',
        author: false,
        selected: true,
        vocabtest: [],
        auth: false,
        loading: false,      
        data1: [],      
        error: null,    
        arrayholder : [],
        state: { isLoading: true, text: '' },
        modalVisible: false,
        addModalVisible:false,
        opacity:1,
        backgroundColor:'#F0F0F0',
        item: [],
        elevation:3,
        topic:'',
        topic1: '' ,
        tuVung: [],
        yNghia: [],
        goiY: [],
        height:100,
        num: [1],
        temp1:[],
        wiki:''
      }
   };
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }
  setAddModalVisible(visible) {
    this.setState({
      addModalVisible: visible,
    });
  }
  addColum(){
    let numLen = this.state.num.length+1;
    let numAdd = this.state.num;
    numAdd.push(numLen);
    this.setState({
      num: numAdd,
    })
  }
  searchFilterFunction1 = text => {    
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.name.title.toUpperCase()}   
      ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });    
    this.setState({ data: newData });  
  };
    SearchFilterFunction(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
 
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      dataSource: newData,
      text: text,
    });
  }
  close = () => {
    if(this.props.navigation.state.params.from=="exam") this.props.navigation.navigate('ExamScreen')
    else if(this.props.navigation.state.params.from=="profile") this.props.navigation.navigate('ProfileScreen')
    else this.props.navigation.navigate('VocabScreen');
  }
  _close = () => {
    this.props.navigation.navigate('VocabScreen');
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
  }
  checkAuth(topicid) {
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('topic/'+topicid)
        .once('value').then(function(dataSnapshot,error) {
          try{
            if(error||!dataSnapshot) return ;
            else if(dataSnapshot.val().uid===user.uid){
              that.setState({author:true})
            }
          }
          catch(exception){
          }
        })  
      } else {
      }
  });
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
        this.props.navigation.navigate('VocabScreen');
      }},
      ],
      { cancelable: false }
    )
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
  addVocabToExam(cmd,temp){
    var exam = [];
    let exam1 = [];
    let dapan = [];
    var that = this
    if(this.props.navigation.state.params.vocab.length<=3) {
      Alert.alert(
        'Chú ý',
        'Bạn đã thuộc hơn số từ vựng cần thiết để kiểm tra!',
        [
          {text: 'Đã hiểu', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      )
    }
    else{
    firebase.database()
    .ref('/topic/'+this.props.navigation.state.params.topicid+'/exam').once('value',snapShot=>{
        var test= [];
        this.props.navigation.state.params.vocab.forEach(element => {
          let n=0;
          let answer=element.key+":"+element.data;
          dapan.push(answer);
          while(n<4){
              this.props.navigation.state.params.vocab.forEach(data=>{
                  if(Math.random(1)<=0.4 && n<10 && data.data!==element.data) {
                      let exam=element.key+":"+data.data;                      
                      test.push(exam);
                      n++;
                  }
              }) 
          }  
          
        });
        this.deduplicate(test,exam);
        let topic = this.props.navigation.state.params.topicid;
        exam.forEach(ex => {
          exam1.push({key:ex})
        })
        dapan.push({selected:true})
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            firebase.database()
            .ref('/users/'+user.uid+'/exam/'+topic+'/')
            .once('value',snapshot=>{
              if(snapshot.exists()){ }
              if(cmd==="add")
                {
                  firebase.database()
                  .ref('/users/'+user.uid+'/exam/'+topic+'/')
                  .set(dapan);
                  if(that.state.temp1.length>0) {
                    var test = []
                    firebase.database()
                  .ref('/users/'+user.uid+'/exam/'+topic+'/')
                  .once('value',snapshot=>{
                    snapshot.forEach(item=>{
                      test.push(item.val())
                    })
                  })
                  firebase.database()
                  .ref('/users/'+user.uid+'/exam/'+topic+'/')
                  .set(test.concat(that.state.temp1));
                  }
                  Alert.alert(
                    'Chú ý',
                    'Bạn đã thêm thành công!',
                    [
                      {text: 'Đã hiểu', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: false }
                  )
                  that.props.navigation.navigate('TopicVocab', { topicid: that.props.navigation.state.params.topicid , vocab: that.props.navigation.state.params.vocab, exam: exam1, answer:dapan })
                }
              if(cmd==="remove")
                {
                  firebase.database()
                  .ref('/users/'+user.uid+'/exam/'+topic+'/')
                  .remove();
                  Alert.alert(
                    'Chú ý',
                    'Bạn đã xóa thành công!',
                    [
                      {text: 'Đã hiểu', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    ],
                    { cancelable: false }
                  )
                }
            })
          }
        });
    });
    if(cmd==="none") {
      dapan.splice(dapan.length-1,1);
      this.props.navigation.navigate('AddVocabToExam', { topicid: this.props.navigation.state.params.topicid , vocab: this.props.navigation.state.params.vocab, exam: exam1, answer:dapan }); }
    else if(cmd==="write"){
        dapan.splice(dapan.length-1,1);
        this.props.navigation.navigate('WriteTest', { topicid: this.props.navigation.state.params.topicid , vocab: this.state.vocabtest, exam: exam1, answer:dapan }); 
      }
    else if(cmd==="abc"){
        dapan.splice(dapan.length-1,1);
        this.props.navigation.navigate('AbcTest', { topicid: this.props.navigation.state.params.topicid ,vocabtest: this.state.vocabtest, vocab: this.state.vocabtest, exam: exam1, answer:dapan }); 
      }  
    }
  }
  checkSelected = () =>{
    var abc=true;
    var topic = this.props.navigation.state.params.topicid;
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('/users/'+user.uid+'/exam/'+topic)
        .once('value',snapshotItem=>{
          
        })        
        firebase.database()
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
        })
      }
    });
  }
  getTopic = async function() {
    var topic = this.props.navigation.state.params.topicid
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) { 
        var ipa = request.responseText.substr(request.responseText.indexOf('- <span class="nobr">'),100);
        item =ipa.substr(ipa.indexOf('>')+1,ipa.indexOf('</span>')-21);
        this.setState({topic:item})
      } 
    };

    request.open('GET', 'https://www.google.com/search?q='+topic+'to+english');
    request.send();
  }
  componentWillMount(){
    this.getTopic();
    this.checkSelected();
    this.checkAuth(this.props.navigation.state.params.topicid);
    this.setState({
      vocabtest: this.props.navigation.state.params.vocab
    })
  }
  componentWillUnmount () {
    this._mounted = false;
 }
  render() {
    const color = ['white','white'];
    var sumVocab = this.props.navigation.state.params.vocab.length;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database()
        .ref('/users/'+user.uid+'/exam/').once('value',snapShot=>{})
      } else {
        console.log("Loi");
      }
      });
      const vocabtest = [];
      this.state.vocabtest.forEach(item=>{
        vocabtest.push({
          key:item.key,
          data:item.data,
        })
      })
      const column1Data = vocabtest.filter((item, i) => i%2 === 0);
      const column2Data = vocabtest.filter((item, i) => i%2 === 1);
    return (
      <View style={{ flex: 1, backgroundColor:this.state.backgroundColor,opacity:this.state.opacity,overflow: 'hidden' }}>
      <Header
      containerStyle={{
      backgroundColor: '#FF4E50',
      height: 60,
      justifyContent: 'space-around',
      }}
      placement="left"
      leftComponent={{ icon: 'arrow-back', color: '#F8F8FF', onPress: () => this.close()}}
      rightComponent={this.state.author?{ icon: 'delete', color: '#F8F8FF', onPress: () => this.delete(this.state.data)}:null}
      />
       <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
            this.setState({
              opacity:1,
              elevation:3
            });
          }}>
              <SwiperFlatList
              data={vocabtest}
              keyExtractor={(item, index) => index + '.'}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              renderItem={({item,index}) => 
              <TouchableScale onPress={()=>{
                var temp =[];
                temp[index] = item.data;
                this.setState({
                  item:temp
                })
                Speech.speak(item.key, {language:'en'})
              }}>
              <LinearGradient 
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                style={[styles.child,{backgroundColor:'black'}]} colors={['rgba(0,0,0,0.1)','rgba(0,0,0,0.8)']}>
               <Text style={{color:'white',fontSize: 30,marginTop:-60 }}>{item.key}</Text> 
               <Ipa style={{color:'white',fontSize:16}} data={item.key}/>
               <Text style={{color:'white',fontSize: 25, textAlign: 'center' }}>{this.state.item[index]}</Text> 
               <GetImage style={{color:'white',fontSize:16}} data={item.key+" "+this.state.topic} />
                <Icon
                type='feather'
                name='volume-2'
                size={25}
                color='#B40022'
                underlayColor='white'
                onPress={()=> {Speech.speak(item.key, {language:'en'})}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"10%", right:10}}
                />
              </LinearGradient>
              </TouchableScale>
              }
            />
            <Icon
                type='feather'
                name='x-circle'
                size={40}
                color='black'
                underlayColor='white'
                onPress={()=> {this.setModalVisible(false);this.setState({
              opacity:1,
              elevation:3
            });}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"83%", right:'45%'}}
                />
       </Modal>
       <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.addModalVisible}
          onRequestClose={() => {
            this.setAddModalVisible(false);
            this.setState({
              opacity:1,
              elevation:3
            });
          }}>
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
              <Icon
                type='feather'
                name='x-circle'
                size={40}
                color='black'
                underlayColor='white'
                onPress={()=> {this.setAddModalVisible(false);this.setState({
              opacity:1,
              elevation:3
            });}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"83%", right:'45%'}}
                />
                <Icon
                type='feather'
                name='check-circle'
                size={40}
                color='green'
                underlayColor='white'
                onPress={()=> {
                  var temp=[],end=[],temp1=[];
                  for(i=0;i<this.state.tuVung.length;i++){
                    temp.push({
                        key:this.state.tuVung[i],
                        data:this.state.yNghia[i],
                      })
                    vocab=this.state.tuVung[i]+":"+this.state.yNghia[i]
                    console.log("vocab: "+vocab)
                    temp1.push(vocab)
                  }
                  end = temp.concat(this.state.vocabtest);
                  this.setState({
                    vocabtest:end
                  })
                  this.setAddModalVisible(false);
                  this.setState({
                  opacity:1,
                  elevation:3,
                  tuVung:[],
                  yNghia:[],
                  temp1:temp1
                });
                this.addVocabToExam("add");
                  }}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"53%", right:'45%'}}
                />
          </Modal>
      <View style={ styles.profile } >
      <View style={{flexDirection:'row',marginBottom:0,paddingBottom:0}}>
      <Text style={{fontSize:26, margin:5,marginTop:8, fontWeight:'bold'}}> {this.props.navigation.state.params.topicid}</Text>
      {this.state.selected ?<Icon
        type='feather'
        name='plus-circle'
        size={20}
        color='rgba(4, 81, 47,0.8)'
        underlayColor='rgba(4, 81, 47,0.8)'
        containerStyle={{marginTop:17}}
        onPress={()=> {this.setState({selected:false});this.addVocabToExam("add")}}
      />:<Icon
        type='feather'
        name='minus-circle'
        size={20}
        color='rgba(255, 81, 47,0.8)'
        underlayColor='rgba(255, 81, 47,0.8)'
        containerStyle={{marginTop:17}}
        onPress={()=> {this.setState({selected:true});this.addVocabToExam("remove")}}
      />}
      </View>
      <View style={{marginBottom:5,flex:1,flexDirection:'column'}}><Text>   Có {sumVocab} từ vựng </Text>
      <Auth topicid={this.props.navigation.state.params.topicid} /></View>
      <Text></Text>
      </View>
      <View style={styles.rowflex}>
      <View style={ styles.columnflex }>
      <TouchableScale style={ [styles.panelL,{elevation:this.state.elevation}] } onPress={()=> {this.setState({selected:false});this.addVocabToExam("none")}}>
      <Icon
        type='feather'
        name='circle'
        size={22}
        color='rgba(255, 81, 47,0.8)'
        underlayColor='rgba(255, 81, 47,0.8)'
        containerStyle={{margin:10}}
      />
      <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:18, fontWeight:'bold'}}>Đúng sai</Text>
      </TouchableScale>
      </View>
      <View style={ styles.columnflex }>
      <TouchableScale style={ [styles.panelR,{elevation:this.state.elevation}] } onPress={()=> {this.setState({selected:false});this.addVocabToExam("write")}}>
      <Icon
        size={22}
        type='feather'
        name='edit-3'
        color='rgba(255, 81, 47,0.8)'
        underlayColor='rgba(255, 81, 47,0.8)'
        containerStyle={{margin:10}}
      />
      <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:18, fontWeight:'bold'}}>Thi viết</Text>
      </TouchableScale>
      </View>
      </View>
      <View style={styles.rowflex1}>
      <View style={ styles.columnflex }>
      <TouchableScale style={ [styles.panelL,{elevation:this.state.elevation}] } onPress={()=> {this.setState({selected:false});this.addVocabToExam("abc")}}>
      <Icon
        type='feather'
        name='check-square'
        size={22}
        color='rgba(255, 81, 47,0.8)'
        underlayColor='rgba(255, 81, 47,0.8)'
        containerStyle={{margin:10}}
      />
      <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:18, fontWeight:'bold'}}>Trắc nghiệm</Text>
      </TouchableScale>
      </View>
      <View style={ styles.columnflex }>
      <TouchableScale style={ [styles.panelR,{elevation:this.state.elevation}] } onPress={() => {
            this.setState({opacity:0.1,backgroundColor:'rgba(0, 0, 0, 0.1)',elevation:0})
            this.setModalVisible(true);
            
          }}>
      <Icon
        size={22}
        type='feather'
        name='book'
        color='rgba(255, 81, 47,0.8)'
        underlayColor='rgba(255, 81, 47,0.8)'
        containerStyle={{margin:10}}
      />
      <Text style={{color:'rgba(255, 81, 47,0.8)', fontSize:18, fontWeight:'bold'}}>Flatcard</Text>
      </TouchableScale>
      </View>
      </View>
      <View style={styles.containerflex}>
      <View style={ [styles.columnflexitem, {marginLeft:20}] }>
      <FlatList
              data={column1Data}
              keyExtractor={(item, index) => index + '.'}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              renderItem={({item,index}) => 
              <TouchableScale onPress={()=> {Speech.speak(item.key, {language:'en'})}}>
              <LinearGradient 
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                style={[styles.card,{elevation:this.state.elevation}]} colors={color}>
               <Text style={{color:'black',fontSize: 15, textAlign: 'center', marginTop:10 }}>{item.key}</Text> 
               <Text style={{color:'black',fontSize: 15, textAlign: 'center' }}>{item.data}</Text> 
               <Ipa data={item.key}/>
               <Icon
                type='feather'
                name='delete'
                size={18}
                color='rgba(255, 81, 47,0.6)'
                underlayColor='white'
                onPress={()=> {
                  this.props.navigation.state.params.vocab.splice(this.props.navigation.state.params.vocab.indexOf(item),1);
                  this.setState({vocabtest: vocabtest.filter(function(ele){return ele != item})});
                  if(this.props.navigation.state.params.from=='exam'){
                    
                  }
                  }}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"40%", right:10}}
                />
                <Icon
                type='feather'
                name='volume-2'
                size={18}
                color='#B40022'
                underlayColor='white'
                onPress={()=> {Speech.speak(item.key, {language:'en'})}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"10%", right:10}}
                />
              </LinearGradient>
              </TouchableScale>
              }
         />
         </View>
         <View style={ [styles.columnflexitem, {marginRight:20}] }>
        <FlatList
              data={column2Data}
              keyExtractor={(item, index) => index + '.'}
              numColumns={1}
              showsHorizontalScrollIndicator={false}
              renderItem={({item,index}) => 
              <TouchableScale onPress={()=> {Speech.speak(item.key, {language:'en'})}}>
              <LinearGradient 
                start={{ x: 0.5, y: 1.0 }} end={{ x: 0.0, y: 0.25 }}
                style={[styles.card,{elevation:this.state.elevation}]} colors={color}>
               <Text style={{color:'black',fontSize: 15, textAlign: 'center', marginTop:10}}>{item.key}</Text> 
               <Text style={{color:'black',fontSize: 15, textAlign: 'center' }}>{item.data}</Text> 
               <Ipa data={item.key}/>
               <Icon
                type='feather'
                name='delete'
                size={18}
                color='rgba(255, 81, 47,0.6)'
                underlayColor='white'
                onPress={()=> {
                  this.props.navigation.state.params.vocab.filter(function(ele){return ele != item});
                  this.setState({vocabtest: vocabtest.filter(function(ele){return ele != item})})
                  var that = this
                  }}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"40%", right:10}}
                />
                <Icon
                type='feather'
                name='volume-2'
                size={18}
                color='#B40022'
                underlayColor='white'
                onPress={()=> {Speech.speak(item.key, {language:'en'})}}
                containerStyle={{size:5, fontSize:5, position: 'absolute',top:"10%", right:10}}
                />
              </LinearGradient>
              </TouchableScale>
              }
         />
         <Icon
         type='feather'
         name='plus-circle'
         color='#B40022'
         underlayColor='grey'
         onPress={() => {
            this.setState({opacity:0.1,backgroundColor:'rgba(0, 0, 0, 0.1)',elevation:0})
            this.setAddModalVisible(true);
          }}
         size={24}
         containerStyle={{bottom:10, right: "95%", position:'absolute',elevation:0}}
         />
         </View>
        </View>
      </View>
    );
  }
}
export const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  child: {
    height: height * 0.5,
    width: width * 0.8,
    marginTop: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    fontSize: 50,
    marginLeft:width * 0.1,
    marginRight:width * 0.1,
  },
  profile:{
    top:0,
    height: '23%',
    width: '100%',   
    backgroundColor: 'white',
  },
  panelL:{
    height: 90,
    width: 170,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 81, 47,0.8)',
    marginLeft:0,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    position: 'absolute',bottom:-100, left:2
  },
  panelR:{
    height: 90,
    width: 170,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 81, 47,0.8)',
    marginRight:0,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    marginTop: 10,
    position: 'absolute',bottom:-100, right:2
  },
  itemList: {
  },
  item: {
    height: 150,
    width: 330,
    borderRadius: 5,
    paddingTop: '20%',
  },
  content:{
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    borderRadius: 2,
    margin: 5,
    width: 167,
    height: 90,
    
    
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  containerflex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnflex: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnflexitem: {
    marginTop:'33%',
    marginLeft:10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowflex: {
    flexDirection: 'row',
    position: 'absolute',
    bottom:'78%',
    width:'89%', 
    right:'5%'
  },
  rowflex1: {
    flexDirection: 'row',
    position: 'absolute',
    bottom:'66%',
    width:'89%', 
    right:'5%'
  },
  itemflex: {
    flex: 1
  },
  label: {
    lineHeight: 400,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
},
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
  marginTop:'30%',
  width: '45%',
  backgroundColor: 'white',
  borderRadius:3,
  padding:10,
  elevation:3,
  height:'30%'
},
box2: {
  paddingRight: 10,
  paddingLeft: 5,
  marginLeft:15,
  padding:10,
  width: '45%',
  marginTop:'30%',
  backgroundColor: 'white',
  borderRadius:3,
  padding:10,
  elevation:3,
  height:'30%'
},
})

export default TopicVocab;
