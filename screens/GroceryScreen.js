import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';

import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base';

import * as firebase from 'firebase';


import { createStackNavigator } from 'react-navigation';



var data = []


export default class Grocery extends React.Component {

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2})

    this.state = {
      listViewData: data,
      newContact: ""
    }
  }


  componentDidMount(){

    var that = this

    firebase.database().ref('/Grocery').on('child_added', function(data){

      var newData = [... that.state.listViewData]
      newData.push(data)
      that.setState({listViewData : newData})
    })

  }

  addRow(data){
    var key = firebase.database().ref('/Grocery').push().key
    console.log(key)
    firebase.database().ref('/Grocery').child(key).set({item:data})
  }

  deleteRow(){


  }

  showInformation() {

  }

  render() {
    return(
      <Container style={styles.container}>
        <Header>
          <Content>
            <Item>
              <Input
                placeholder='add item'
                style={styles.input}
                onChangeText = {(newContact) => this.setState({newContact})}

              />
              <Button onPress={ () => this.addRow(this.state.newContact)}>
                <Icon name='add'/>
              </Button>
            </Item>
          </Content>
        </Header>

        <Content>
          <List
          enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}

            renderRow={ data =>
              <ListItem>
                <Text>{data.val().item}</Text>
              </ListItem>
            }

            renderLeftHiddenRow={data =>
              <Button full  onPress={ () => this.addRow(data)}>
                <Icon name='information-circle'/>
              </Button>
                }

            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger  onPress={ () => this.deleteRow(secId,rowId,rowMap,data)}>
                <Icon name='trash'/>
              </Button>
                }

              leftOpenValue={-75}
              rightOpenValue={-75}
          />

        </Content>

      </Container>


        );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input:{
    backgroundColor: '#fff',
  }
})
