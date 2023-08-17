import { useCallback, useEffect, useState } from 'react'
import { extractAndCombineData } from '../utils/ai-utils'
import { Secrets } from '../secrets'

const translate = async (
    text: string,
    language: string,
    onTranslate: (translation: string) => void,
    onFinish: () => void
) => {
    console.log('translating', text)
    const payload = {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
            {
                role: 'user',
                content: `Translate this text into ${language}: "${text}"`
            }
        ]
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://api.openai.com/v1/chat/completions', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', `Bearer ${Secrets.OPENAI_API_KEY}`)

    xhr.onreadystatechange = async () => {
        if (
            xhr.status !== 200 &&
            xhr.status !== 0 // Before the request completes, the value of status is 0
        ) {
            // Connection Failed
            console.error(
                'failed',
                xhr.readyState,
                xhr.status,
                xhr.responseText,
                xhr.response,
                xhr
            )
            return
        }
        if (xhr.readyState === 3 && xhr.status === 200) {
            // LOADING
            const resp = extractAndCombineData(xhr.responseText)
            const content = resp.content
            onTranslate(content)
            console.log('text', resp)
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            // COMPLETE
            // console.log('complete', xhr.responseText, xhr.response);
            onFinish()
        }
    }

    xhr.send(JSON.stringify(payload))
}

export const useTranslate = (
    text: string | undefined,
    outputLanguage: string,
    onFinishTranslatingChunk: (translation: string) => void
) => {
    const [translation, setTranslation] = useState<string>()

    const onFinish = useCallback(() => {
        if (translation) onFinishTranslatingChunk(translation)
    }, [translation])

    useEffect(() => {
        if (text && text.length > 0) {
            translate(
                text,
                outputLanguage,
                translation => {
                    setTranslation(translation)
                },
                onFinish
            )
        }
    }, [text, outputLanguage])

    return translation
}
