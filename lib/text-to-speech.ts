import { Player } from '@react-native-community/audio-toolkit'
import { Secrets } from '../secrets'

export const LANGUAGES = {
    English: 'en-ZA-LeahNeural',
    Spanish: 'es-DO-RamonaNeural',
    German: 'de-AT-JonasNeural',
    French: 'fr-FR_ReneeV3Voice'
}
type TextToSpeechConfig = {
    onFinished?: (url: string) => void
    playOnLoad?: boolean
    pollInterval?: number
}

export const textToSpeech = async (
    text: string,
    language: string,
    config?: TextToSpeechConfig
) => {
    const data = {
        voice: LANGUAGES[language],
        content: [text]
    }

    const resp = await fetch('https://play.ht/api/v1/convert', {
        method: 'POST',
        headers: getPlayHTHeaders(),
        body: JSON.stringify(data)
    })
    const json = await resp.json()
    const transciptionId = json.transcriptionId

    while (true) {
        const url = await getTranscriptionUrl(transciptionId)
        if (url) {
            config?.onFinished && config.onFinished(url)
            if (config?.playOnLoad) {
                new Player(url).play()
            }
            break
        }
        await new Promise(resolve =>
            setTimeout(resolve, config?.pollInterval || 500)
        )
    }
}

const getTranscriptionUrl = async (transciptionId: string) => {
    const resp = await fetch(
        `https://play.ht/api/v1/articleStatus?transcriptionId=${transciptionId}`,
        {
            headers: getPlayHTHeaders()
        }
    )

    const json = await resp.json()
    if (json.hasOwnProperty('audioUrl')) {
        return json.audioUrl
    }

    return null
}

const getPlayHTHeaders = () => {
    return {
        Authorization: `Bearer ${Secrets.PLAY_HY_SECRET_KEY}`,
        'X-USER-ID': Secrets.PLAY_HY_API_KEY!,
        'Content-Type': 'application/json'
    }
}
