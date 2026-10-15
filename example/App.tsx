import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SubmitButton, type SubmitButtonStatus } from 'react-native-submit-button'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export default function App() {
  const [status, setStatus] = useState<SubmitButtonStatus>('idle')

  async function runControlled() {
    setStatus('loading')
    await wait(1500)
    setStatus(Math.random() > 0.5 ? 'success' : 'error')
    await wait(1500)
    setStatus('idle')
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>react-native-submit-button</Text>

        <Demo title="Promise → success" note="onPress returns a promise that resolves">
          <SubmitButton onPress={() => wait(1500)} resetAfter={1500} />
        </Demo>

        <Demo title="Promise → error" note="the promise rejects; custom error label">
          <SubmitButton
            title="Pay $25"
            errorTitle="Declined"
            onPress={() => wait(1500).then(() => Promise.reject(new Error('declined')))}
            resetAfter={1500}
            width={200}
          />
        </Demo>

        <Demo title="Controlled" note="status prop driven by the screen; random result">
          <SubmitButton
            title="Send"
            status={status}
            onPress={runControlled}
            color="#5B5BD6"
            trackColor="#D9D9F3"
          />
        </Demo>

        <Demo title="Dark, compact" note="custom colours and size">
          <SubmitButton
            title="Save"
            successTitle="Saved"
            onPress={() => wait(1200)}
            resetAfter={1500}
            width={140}
            height={44}
            borderWidth={3}
            color="#F5A524"
            backgroundColor="#111111"
            trackColor="#333333"
          />
        </Demo>

        <Demo title="Disabled" note="no press, dimmed">
          <SubmitButton title="Submit" disabled />
        </Demo>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

function Demo({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <View style={styles.demo}>
      <Text style={styles.demoTitle}>{title}</Text>
      <Text style={styles.demoNote}>{note}</Text>
      <View style={styles.demoBody}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7F9' },
  content: { padding: 24, gap: 28 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  demo: { gap: 4 },
  demoTitle: { fontSize: 16, fontWeight: '600' },
  demoNote: { fontSize: 13, color: '#6B7280' },
  demoBody: { alignItems: 'center', paddingVertical: 12 }
})
