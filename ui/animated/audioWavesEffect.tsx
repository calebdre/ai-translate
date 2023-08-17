import { FC } from 'react'
import { SineWave } from './sinewave'
import { StyleSheet, View } from 'react-native'

type Wave = {
    color: string
    stroke: number
    amplitude: number
    frequency: number
    duration: number
    startPhase: number
    taperValue: number
}

type AudioWavesProps = {
    isActive: boolean
}
export const AudioWaves: FC<AudioWavesProps> = ({ isActive }) => {
    const waves: Wave[] = [
        {
            color: '#bcbcbc',
            stroke: 1,
            amplitude: 40,
            frequency: 4,
            duration: 2400,
            startPhase: 0,
            taperValue: 1.7
        },
        {
            color: '#cdcdcd',
            stroke: 1,
            amplitude: 30,
            frequency: 5,
            duration: 1100,
            startPhase: 0,
            taperValue: 2.5
        }
    ]

    return (
        <View style={styles.container}>
            {waves.map((wave, index) =>
                index === waves.length - 1 ? (
                    <SineWave
                        key={index}
                        {...wave}
                        amplitude={isActive ? wave.amplitude : 0}
                    />
                ) : (
                    <View key={index} style={styles.wave}>
                        <SineWave
                            {...wave}
                            amplitude={isActive ? wave.amplitude : 0}
                        />
                    </View>
                )
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    wave: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})
