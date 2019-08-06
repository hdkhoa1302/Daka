import React from 'react';
import * as firebase from 'firebase';
import { Image, View} from 'react-native';
export default class GetImage extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          data: this.props.data,
          image: '',
          style: this.props.style
        }
     };
     getImage = async function() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }
    
          if (request.status === 200) { 
            var ipa = request.responseText.substr(request.responseText.indexOf('https://encrypted'),200);
            item =ipa.substr(ipa.indexOf('https://encrypted'),ipa.indexOf('" width'));
            this.setState({
                ipa:item,
            })
          } else {
            
          }
        };
    
        request.open('GET', 'https://www.google.com.vn/search?tbm=isch&q='+this.state.data);
        request.send();
      }
    componentWillMount(){
        this.getImage();
      }
    render() {
        return (
            <View style={{justifyContent: 'center',
            alignItems: 'center',textAlign:'center',opacity:0.8}}>
            <Image
                style={{width: 250, height: 170, marginTop:'5%',marginBottom:'5%'}}
                source={{uri: this.state.ipa}}
              />
            </View>
        )
    }
}