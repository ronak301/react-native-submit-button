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
      <SubmitButton />
    );
  }
}

AppRegistry.registerComponent('androidTesting', () => SubmitButtonExample);
