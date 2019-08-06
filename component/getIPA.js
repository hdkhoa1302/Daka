import React from 'react';
import * as firebase from 'firebase';
import { Text, View} from 'react-native';
export default class Ipa extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          data: this.props.data,
          ipa: '',
          style: this.props.style
        }
     };
     getIPA = async function() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }
    
          if (request.status === 200) { 
            var ipa = request.responseText.substr(request.responseText.lastIndexOf('<span class="phoneticspelling">'),100);
            item =ipa.substr(ipa.indexOf('>')+1,ipa.indexOf('</span>')-31);
            this.setState({
                ipa:item,
            })
          } else {
          }
        };
    
        request.open('GET', 'https://en.oxforddictionaries.com/definition/'+this.state.data);
        request.send();
      }
    componentWillMount(){
        this.getIPA();
      }
    render() {
        return (
            <View style={{justifyContent: 'center',
            alignItems: 'center',textAlign:'center',opacity:0.8}}><Text style={this.state.style}> {this.state.ipa}</Text></View>
        )
    }
}