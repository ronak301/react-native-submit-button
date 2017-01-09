import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubmitButton from 'react-native-submit-button';

const { width, height } = Dimensions.get('window');

console.disableYellowBox = true;

class SubmitButtonExample extends Component {

  constructor() {
    super();
    this.state = {
     buttonState1: 'normal',
      buttonState2: 'normal'
    }
  }

  render() {
    return (
      <LinearGradient colors={['#F0C27B', '#4B1248']} style={styles.linearGradient}>
        <View style={styles.seperator}><SubmitButton onSubmit={this.onSubmit1} buttonState={this.state.buttonState1} onSuccess={this.onSuccess} buttonText="Login"/></View>
        <View style={styles.seperator}><SubmitButton onSubmit={this.onSubmit2} buttonState={this.state.buttonState2} onSuccess={this.onSuccess} /></View>
      </LinearGradient>
    );
  }

  onSubmit1 = () => {
    // api call
    setTimeout( () => {this.setState({ buttonState1: 'success' })}, 2000); // if success, else this.setState({ buttonState: 'error' })
  }

  onSubmit2 = () => {
    // api call
    setTimeout( () => {this.setState({ buttonState2: 'error' })}, 2000); // if success, else this.setState({ buttonState: 'error' })
  };

  onSuccess = () => {
    // route to next page - may be
  }
}

const styles = StyleSheet.create( {
  linearGradient : {
    flex           : 1,
    alignItems : 'center',
    justifyContent: 'center',
    paddingTop: 30,
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    justifyContent: 'center'
  },
  seperator: {
    marginBottom: 30
  },
  button         : {
    height         : 54,
    borderRadius   : 35,
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: 'white'
  },
  text           : {
    fontSize       : 22,
    fontFamily     : 'proximanova-regular',
    color          : 'rgb(30, 205, 151)',
    fontWeight     : 'bold',
    backgroundColor: 'transparent'
  }
} );

AppRegistry.registerComponent('androidTesting', () => SubmitButtonExample);
