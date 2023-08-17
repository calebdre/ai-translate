import { Buffer } from 'buffer'
import { useEffect, useState } from 'react'
import LiveAudioStream from 'react-native-live-audio-stream'
import { Secrets } from '../secrets'
import { Utterance } from '../types'

const gladiaUrl = 'wss://api.gladia.io/audio/text/audio-transcription'
const gladiaKey = Secrets.GLADIA_API_KEY

const SAMPLE_RATE = 16000
const BIT_DEPTH = 32

const options = {
    sampleRate: SAMPLE_RATE, // default is 44100 but 32000 is adequate for accurate voice recognition
    channels: 1, // 1 or 2, default 1
    bitsPerSample: BIT_DEPTH, // default 16
    bufferSize: 2048 // default is 2048
}

export const useRecorder = (isActive: boolean, inputLanguage: string) => {
    const [transcript, setTranscript] = useState<string>()
    const [transcriptBuffer, setTranscriptBuffer] = useState<string>()

    useEffect(() => {
        LiveAudioStream.init(options)
        const socket = new WebSocket(gladiaUrl)

        socket.onopen = () => {
            // connection opened
            const configuration = {
                x_gladia_key: gladiaKey,
                sample_rate: SAMPLE_RATE,
                model_type: 'accurate',
                bit_depth: BIT_DEPTH,
                language: inputLanguage
            }
            socket.send(JSON.stringify(configuration))
        }

        socket.onmessage = (event: any) => {
            // a message was received
            console.log('message reiceved', event.data)

            if (event && event.data !== '{}') {
                const utterance = JSON.parse(event.data.toString()) as Utterance
                console.log('trasncribed:', utterance.transcription)
                const transcript = utterance.transcription

                if (utterance.type === 'final') {
                    setTranscriptBuffer('')
                    setTranscript(
                        prev =>
                            (prev || '') + (transcriptBuffer || '') + transcript
                    )
                } else {
                    setTranscriptBuffer(transcript)
                }
            } else {
                // console.log('empty ...');
            }
        }

        LiveAudioStream.on('data', async data => {
            const chunk = Buffer.from(data, 'base64')
            const base64 = chunk.toString('base64')
            console.log('sending data')
            socket.send(JSON.stringify({ frames: base64 }))
        })
    }, [])

    useEffect(() => {
        if (!isActive) {
            LiveAudioStream.stop()
        } else {
            LiveAudioStream.start()
        }
    }, [isActive])

    if (transcript && transcriptBuffer) {
        return `${transcript} ${transcriptBuffer}`
    } else if (transcript) {
        return transcript
    } else if (transcriptBuffer) {
        return transcriptBuffer
    } else {
        return undefined
    }
}
