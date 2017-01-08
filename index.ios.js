
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
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
const { width, height } = Dimensions.get('window');
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class DribbleTest extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      animatedWidth: new Animated.Value(0),
      fill: 0,
      canShowAnimatedCircle: false
    }
  }

  render() {
    const buttonWidth = this.state.animatedWidth.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [180, 54, 180]
    });
    const textOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [1, 0 , 0, 0, 1],
    });
    const borderColor = this.state.isLoading ? '#bbbbbb' : 'rgb(30, 205, 151)';
    const borderWidth = this.state.isLoading ? 4 : 4;
    // const submitText = this.state.isLoading ? '' : 'Submit';
    const backgroundColor = this.state.isLoading ? 'transparent' : 'white';
    return (
      <LinearGradient colors={['white', 'white']} style={styles.linearGradient}>
        <Animated.View style={[styles.buttonContainer, {width: buttonWidth }]}>
          <TouchableOpacity style={[styles.button, {borderWidth: borderWidth, borderColor: borderColor, backgroundColor: backgroundColor}]} onPress={this.onPressSubmitButton}>
            <Animated.Text style={[styles.text, {opacity: textOpacity}]}>Submit</Animated.Text>
          </TouchableOpacity>
          {this.renderAnimatedCircle()}
        </Animated.View>
      </LinearGradient>
    );
  }

  renderAnimatedCircle = () => {
    const opacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 0.99, 1],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    return (
        <AnimatedCircularProgress
          ref='circularProgress'
          size={54}
          width={4}
          fill={this.state.fill}
          tintColor="rgb(30, 205, 151)"
          backgroundColor="#bbbbbb"
          rotation={0}
          tension={20}
          style={{backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0, opacity: opacity}}
        />
    );
  }

  onPressSubmitButton = () => {
    if (this.state.isLoading) {
      setTimeout(() => {this.animateWidth(); this.setState({isLoading: false})} , 2000);
    };
    this.setState({isLoading: true}, () => setTimeout(() => { this.refs.circularProgress.performLinearAnimation(100, 1000); this.setState({canShowAnimatedCircle: true}) }, 200 ) );
    Animated.timing(this.state.animatedWidth, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();

  }

  animateWidth = () => {
    Animated.timing(this.state.animatedWidth, {
      toValue: 2,
      duration: 200,
      easing: Easing.linear
    }).start();
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    justifyContent: 'center'
  },
  button: {
    height: 54,
    borderRadius: 35,
    alignItems: 'center',
		justifyContent: 'center',
    backgroundColor: 'white'
  },
  text: {
    fontSize: 22,
    fontFamily: 'proximanova-regular',
    color: 'rgb(30, 205, 151)',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('twitterui', () => DribbleTest);
