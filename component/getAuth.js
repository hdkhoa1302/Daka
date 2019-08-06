import React from 'react';
import * as firebase from 'firebase';
import { Text, View} from 'react-native';
export default class Auth extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          data: this.props.topicid,
          auth: '',
        }
     };
    getAuth = () =>{
        firebase.database()
        .ref('topic/'+this.props.topicid)
        .on('value', dataSnapshot => {
            try 
            {   
                 firebase.database()
                .ref('users/'+dataSnapshot.val().uid)
                .on('value', authSnapshot => {
                    this.setState({
                        auth : authSnapshot.val().name
                    })
                })
            }
            catch(error){
                
            };
        })
    }
    componentWillMount(){
        this.getAuth();
      }
    render() {
        return (
            <View style={{textAlign:'center'}}><Text>   Tác giả: {this.state.auth}</Text></View>
        )
    }
}