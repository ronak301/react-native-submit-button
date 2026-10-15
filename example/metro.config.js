// Resolves the library from ../src, and every dependency (react, react-native,
// reanimated, svg, worklets) from this app's node_modules so there is one copy.
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const root = path.resolve(__dirname, '..')
const config = getDefaultConfig(__dirname)

config.watchFolders = [root]
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')]
config.resolver.extraNodeModules = {
  'react-native-submit-button': path.join(root, 'src')
}
config.resolver.blockList = [
  new RegExp(`^${path.join(root, 'node_modules').replace(/[/\\]/g, '[/\\\\]')}[/\\\\].*`)
]

module.exports = config
