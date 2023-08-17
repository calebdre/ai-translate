import React, { FC, useEffect } from 'react'
import { Dimensions } from 'react-native'
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const { width } = Dimensions.get('window')
const AnimatedPath = Animated.createAnimatedComponent(Path)

const calcSineWave = (amplitude: number, frequency: number, phase: number) => {
    'worklet'
    let path = `M 0 ${amplitude * Math.sin(phase)}`
    for (let x = 0; x <= width; x++) {
        const y =
            amplitude *
                Math.sin(2 * Math.PI * (x / width) * frequency + phase) +
            amplitude
        path += `L ${x} ${y}`
    }

    return path
}  

type SineWaveProps = {}
export const SineWave2: FC<SineWaveProps> = ({}) => {
    const phase = useSharedValue(0)

    useEffect(() => {
        phase.value = withRepeat(
            withTiming(2 * Math.PI, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        )
    }, [])

    const animatedProps = useAnimatedProps(() => {
        return {
            d: calcSineWave(70, 4, phase.value)
        }
    })

    return (
        <Svg height="100%" width="100%" viewBox={`0 0 ${width} 100`}>
            <AnimatedPath
                fill="none"
                strokeWidth={2}
                stroke="#000"
                animatedProps={animatedProps}
            />
        </Svg>
    )
}
