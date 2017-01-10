# react-native-submit-button

An Animated Submit Button. Works on both android and IOS. 
- folds when in progress
- expands back when its ready


![Alt text](/example/images/out.gif?raw=true "Animated Submit Button")

## Inspiration
https://dribbble.com/shots/1426764-Submit-Button


## Running Example

 - git clone `https://github.com/ronak301/react-native-submit-button.git` 
 - cd example
 - npm install
 - rnpm link
 - react-native run-ios

## Installation

 - npm install --save react-native-submit-button
 - if RN > 0.29 `react-native link` else `rnpm link` 

## Usage

```
import SubmitButton from 'react-native-submit-button';

class SubmitButtonExample extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <SubmitButton />
      </View>
    ); 
  } 
}
```


## Props

| Property | Type | Default | Description |
|---------------|----------|--------------|----------------------------------------------------------------|
| primaryColor | `string` | `rgb(30, 205, 151)` | optional user-defined primary color |
| secondaryColor | `string` | `white` | optional user-defined secondary color |
| buttonState | `string` | `normal` | button state can be one of `normal`, `success`, `error` |
| width | `number` | 180 | optional user-defined width for button |
| height | `number` | 54 | optional user-defined height for button |
| buttonText | `string` | 'Submit' | optional user-defined text on button |
| buttonTextWhenReady | `string` | | optional user-defined text on button when success (either provide this or give iconName to be shown once submitted successfully ) , this will get priority over icon name |
| iconName | `string` | 'check' | optional any icon name from fontello icons , to be shown once we got success. |
| textStyle | `object` | | optional text styles to override existing styles |
| buttonStyle | `object` | | optional button styles to override existing styles |
| animationDuration | `number` | 200 | number in `ms`. Time to fold button. |
| errorColor | `string` |  `#ff6666` | error color |
| onSubmit | `function` | | function to call on button press |
| onSuccess | `function` | | function to call on success |
| onError | `function` | | function to call on error |


# License

 - [MIT](https://github.com/ronak301/react-native-submit-button/blob/master/LICENSE.txt).  © Ronak Kothari
