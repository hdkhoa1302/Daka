import React from 'react';
import * as firebase from 'firebase';
import {View, FlatList, Text, Button} from 'react-native';

export default class GetData extends React.Component {
    async function getData = (data: string) => {
     const result = await DocumentPicker.getDocumentAsync({
       type: '*/*',
     });
     if (result.type === 'cancel') return;
     console.log('uri', result.uri);
     try {
       const info = await FileSystem.getInfoAsync(result.uri);
       this.setState({ data: info });
       const content = await FileSystem.readAsStringAsync(result.uri);
       this.setState({ data: content });
     } catch (e) {
       this.setState({ data: e.message })
     }
   }
   render(){
     return(
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Button
          title="import"
          onPress={this.getData()}
        />
        <Text>{JSON.stringify(this.state.data)}</Text>
       </View>
     );
   }
}
