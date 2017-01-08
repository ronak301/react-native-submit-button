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

const { width, height } = Dimensions.get('window');

console.disableYellowBox = true;

export default class SubmitButton extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
      animatedWidth: new Animated.Value(0),
      fill: 0,
      canShowAnimatedCircle: false,
      isReady: false
    }
  }

  static PropTypes = {
    width: PropTypes.number
  }

  static defaultProps = {
    width: 180
  }

  render() {
    const { width } = this.props;
    const buttonWidth = this.state.animatedWidth.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [width, 54, width]
    });
    const borderColor = this.state.isLoading ? '#bbbbbb' : 'rgb(30, 205, 151)';
    const borderWidth = this.state.isLoading ? 4 : 4;
    const backgroundColor = this.state.isLoading ? 'transparent'  :  !this.state.isReady ? 'white' : 'rgb(30, 205, 151)';
    const buttonBackgroundColor = this.state.isReady ? 'rgb(30, 205, 151)' : 'transparent';

    return (
      <LinearGradient colors={['#F0C27B', '#4B1248']} style={styles.linearGradient}>
        <Animated.View style={[styles.buttonContainer, {width: buttonWidth }]}>
          <TouchableOpacity style={[styles.button, {borderWidth: borderWidth, borderColor: borderColor, backgroundColor: backgroundColor}]} onPress={this.onPressSubmitButton}>
            {this.renderBody()}
          </TouchableOpacity>
          {this.renderAnimatedCircle()}
        </Animated.View>
      </LinearGradient>
    );
  }

  renderBody = () => {
    const textColor = this.state.isReady ? 'white' : 'rgb(30, 205, 151)';
    const textOpacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [1, 0 , 0, 0, 1],
    });
    if (this.state.isReady) {
      return (
        <Icon name="check" size={26} color={'white'} />
      );
    }
    return (
      <Animated.Text style={[styles.text, {opacity: textOpacity, color: textColor}]}>Submit</Animated.Text>
    );
  }

  renderAnimatedCircle = () => {
    const opacity = this.state.animatedWidth.interpolate({
      inputRange: [0, 0.99, 1, 1.1, 2],
      outputRange: [0, 0, 1, 0, 0],
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
    if (this.state.isLoading || this.state.isReady) return ;
    this.setState({isLoading: true}, () => setTimeout(() => { this.setState({fill: 100, canShowAnimatedCircle: true}) }, 200 ) );
    Animated.timing(this.state.animatedWidth, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear
    }).start();
    setTimeout(() => {this.setState({isLoading: false, isReady: true}, this.animateWidth)} , 2000);
    setTimeout(() => {this.setState({isLoading: false, isReady: false, fill: 0}, this.animateWidth)} , 4000);
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

AppRegistry.registerComponent('androidTesting', () => SubmitButton);
