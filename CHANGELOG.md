# Changelog

## 2.0.1

No API or behaviour change.

- Source split into focused modules: `useSubmitStatus` (state), `useSubmitAnimation` (Reanimated), and small components for the label, spinner and icons.
- Example app: `uuid` pinned to 11.1.1 for a security fix; dependency lockfiles refreshed.

## 2.0.0

A full rewrite for current React Native.

- Function component in TypeScript, with types shipped.
- Animations on Reanimated 4 worklets (UI thread). Works with the New Architecture.
- Return a promise from `onPress` and the button shows loading, then success or error by itself. `status` gives full control when needed.
- New `resetAfter`, `successTitle`, `errorTitle`, `successIcon`, `errorIcon`, `trackColor`, `borderWidth`, `disabled`, `accessibilityLabel`, `accessibilityHint` and `testID` props.
- SVG spinner and icons; `react-native-vector-icons` and the git-pinned `react-native-circular-progress` are gone.
- Accessibility: button role, busy and disabled states, success or error announced to screen readers.
- Spinner keeps turning under Reduce Motion; fold and unfold follow the system setting.
- New Expo example app.

Breaking: props were renamed. See "Migrating from 1.x" in the README.

## 1.0.5 and earlier

Class component using `Animated`, `react-native-circular-progress` and `react-native-vector-icons`.
