import React, { useState } from 'react'

import {
    PixelRatio,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    useColorScheme,
    View
} from 'react-native'

import { Colors, Header } from 'react-native/Libraries/NewAppScreen'
import { LANGUAGES, textToSpeech } from './lib/text-to-speech'
import { useRecorder } from './lib/transcribe'
import { useTranslate } from './lib/translate'
import { AudioWaves } from './ui/animated/audioWavesEffect'
import { Section } from './ui/section'

const radius = PixelRatio.roundToNearestPixel(130)
const STROKE_WIDTH = 30

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark'
    const [isRecording, setIsRecording] = useState(false)
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
    }

    const transcript = useRecorder(isRecording, 'english')

    const translation = useTranslate(transcript, 'spanish', translation => {
        textToSpeech(translation, LANGUAGES.French, {
            playOnLoad: true
        })
    })

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />
                <View
                    style={{
                        backgroundColor: isDarkMode
                            ? Colors.black
                            : Colors.white
                    }}>
                    <Pressable
                        onPress={() => {
                            setIsRecording(prev => !prev)
                        }}>
                        <Section title="Step One">
                            <Text>
                                <Text
                                    style={{
                                        fontSize: 35
                                    }}>
                                    {isRecording ? 'stop' : 'start'}
                                </Text>
                                &nbsp;recording
                            </Text>
                        </Section>
                        <Text
                            style={{
                                color: isDarkMode ? Colors.white : Colors.black,
                                fontSize: 20,
                                marginLeft: 25
                            }}>
                            Transcript:
                        </Text>
                        <Text
                            style={{
                                marginLeft: 25,
                                color: isDarkMode ? Colors.white : Colors.black,
                                fontSize: 15
                            }}>
                            {transcript}
                        </Text>
                    </Pressable>
                    <View style={{ marginTop: 40 }} />
                    <View
                        style={{
                            marginLeft: 25
                        }}>
                        <Text
                            style={{
                                color: isDarkMode ? Colors.white : Colors.black,
                                fontSize: 20
                            }}>
                            Translation
                        </Text>
                        <Text
                            style={{
                                color: isDarkMode ? Colors.white : Colors.black,
                                fontSize: 15
                            }}>
                            {translation}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <View style={{ height: 400, width: '100%' }}>
                            <AudioWaves isActive={isRecording} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App
