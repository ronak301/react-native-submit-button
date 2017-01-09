# react-native-submit-button

Animated Submit button - 
- folds when in progress
- expands back when its ready

![Alt text](/example/images/out.gif?raw=true "Animated Submit Button")

**Installtion**

```npm install --save react-native-submit-button```

if RN > 0.29 `react-native link` 
else `rnpm link`

 
**Usage**

import SubmitButton from 'react-native-submit-button';

class SubmitButtonExample extends Component {

  render() {
  
    return (
    
      <View>
      
        <SubmitButton />
        
      </View>
      
    );
    
  }
  
}
