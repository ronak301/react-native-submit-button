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

  render() {
    return (
      <LinearGradient colors={['#F0C27B', '#4B1248']} style={styles.linearGradient}>
        <SubmitButton />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create( {
  linearGradient : {
    flex           : 1,
    justifyContent : 'center',
    alignItems     : 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    justifyContent: 'center'
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
