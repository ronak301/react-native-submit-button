import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './main.style';

const { width, height } = Dimensions.get('window');

const AnimatingCicleBackgroundColor = '#bbbbbb';

class SubmitButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      animatedValue: new Animated.Value(0),
      fill: 0,
      canShowAnimatedCircle: false,
      isReady: false
    };
  }

  static defaultProps = {
    width: 180,
    height: 54,
    primaryColor: 'rgb(30, 205, 151)',
    secondaryColor: 'white',
    buttonText: 'Submit',
    iconName: 'check',
    onSubmit: () => {},
    onSuccess: () => {},
    onError: () => {},
    buttonState: 'normal',
    animationDuration: 200,
    errorColor: '#ff6666'
  };

  componentWillReceiveProps(nextProps) {
    const buttonState = nextProps.buttonState;
    if (buttonState === 'success' || buttonState === 'error') {
      this.setState(
        { isLoading: false, isReady: true, canShowAnimatedCircle: false },
        this.animateBackToOriginal
      );
    }
  }

  render() {
    const {
      width,
      height,
      primaryColor,
      secondaryColor,
      buttonStyle,
      errorColor,
      buttonState
    } = this.props;
    const {
      animatedValue,
      isLoading,
      isReady,
      canShowAnimatedCircle,
      fill
    } = this.state;
    const buttonWidth = animatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [width, height, width]
    });
    const buttonHeight = height;
    const readyStateBorderColor =
      buttonState === 'success'
        ? primaryColor
        : buttonState === 'error' ? errorColor : primaryColor;
    let borderColor = primaryColor;
    borderColor = isLoading
      ? AnimatingCicleBackgroundColor
      : readyStateBorderColor;
    const readyStateBgColor =
      buttonState === 'success' ? primaryColor : errorColor;
    const backgroundColor = isLoading
      ? 'transparent'
      : !isReady ? secondaryColor : readyStateBgColor;
    const buttonOpacity = canShowAnimatedCircle ? 0 : 1;

    return (
      <Animated.View style={[styles.buttonContainer, { width: buttonWidth }]}>
        <TouchableOpacity
          style={[
            styles.button,
            buttonStyle,
            {
              height: buttonHeight,
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              opacity: buttonOpacity
            }
          ]}
          onPress={this.onSubmitButtonClick}
        >
          {this.renderBody()}
        </TouchableOpacity>
        {this.renderAnimatedCircle(animatedValue, fill, height, primaryColor)}
      </Animated.View>
    );
  }

  renderBody = () => {
    const {
      buttonTextWhenReady,
      iconName,
      textStyle,
      buttonText,
      secondaryColor,
      buttonState,
      primaryColor
    } = this.props;
    const { animatedValue, isReady } = this.state;
    const successIconName = buttonState === 'success' ? iconName : 'times';
    const textColor = isReady ? secondaryColor : primaryColor;
    const textOpacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: [1, 0, 0, 0, 1]
    });

    if (!isReady) {
      return (
        <Animated.Text
          style={[
            styles.text,
            textStyle,
            { opacity: textOpacity, color: textColor }
          ]}
        >
          {buttonText}
        </Animated.Text>
      );
    }
    if (buttonTextWhenReady) {
      return (
        <Animated.Text
          style={[
            styles.text,
            textStyle,
            { opacity: textOpacity, color: textColor }
          ]}
        >
          {buttonTextWhenReady}
        </Animated.Text>
      );
    }
    return <Icon name={successIconName} size={26} color={secondaryColor} />;
  };

  renderAnimatedCircle = (animatedValue, fill, height, primaryColor) => {
    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.99, 1, 1.1, 2],
      outputRange: [0, 0, 1, 0, 0],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View
        style={{
          opacity: opacity,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <AnimatedCircularProgress
          ref="circularProgress"
          size={height}
          width={4}
          fill={fill}
          tintColor={primaryColor}
          backgroundColor={AnimatingCicleBackgroundColor}
          rotation={0}
          tension={20}
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </Animated.View>
    );
  };

  onSubmitButtonClick = () => {
    const { isLoading, isReady, animatedValue } = this.state;
    const { onSubmit, animationDuration } = this.props;

    if (isLoading || isReady) return;
    onSubmit();
    this.setState({ isLoading: true }, () =>
      setTimeout(() => {
        this.setState({ fill: 100, canShowAnimatedCircle: true });
      }, animationDuration)
    );
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animationDuration,
      easing: Easing.linear
    }).start();
  };

  animateBackToOriginal = () => {
    const { animatedValue } = this.state;
    const { buttonState, onSuccess, onError, animationDuration } = this.props;
    const cb = buttonState === 'success' ? onSuccess : onError;

    Animated.timing(animatedValue, {
      toValue: 2,
      duration: animationDuration,
      easing: Easing.linear
    }).start(cb());
  };
}

SubmitButton.propTypes = {
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,

  buttonState: PropTypes.oneOf(['normal', 'success', 'error']),

  width: PropTypes.number, // button width
  height: PropTypes.number, // button height
  buttonText: PropTypes.string, // button text. eg: Submit
  buttonTextWhenReady: PropTypes.string, // to show when success.Either pass this or pass icon name (any name from fontawesome lib)
  iconName: PropTypes.string, // any name from font awesome lib
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]), // button text style
  buttonStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]), // button style
  animationDuration: PropTypes.number,
  errorColor: PropTypes.string,

  onSubmit: PropTypes.func, // function to be executed on button press.
  onSuccess: PropTypes.func, // on success callback
  onError: PropTypes.func // on error callback
};

module.exports = SubmitButton;
