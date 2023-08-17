
import React, { FC, useEffect } from 'react'
import Svg, { Path } from 'react-native-svg'
import { Dimensions } from 'react-native'
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const AnimatedPath = Animated.createAnimatedComponent(Path)

type SineWaveProps = {}

const calcSineWave = (
    amplitude: number, 
    frequency: number, 
    phase: number
) => {
    'worklet'
    
    let path = `M 0 ${amplitude * Math.sin(phase)}`

    for (let x = 0; x <= width; x++) {
        const y = amplitude * Math.sin(2 * Math.PI * (x / width) * frequency + phase) +
            amplitude
        
            path += `L ${x} ${y}`
    }

    return path
}

export const SineWave: FC<SineWaveProps> = ({ }) => {

    const phase = useSharedValue(0)

    const animatedProps = useAnimatedProps(() => {
        return {
            d: calcSineWave(30, 2, phase.value)
        }
    })
    
    useEffect(() => {
        phase.value =
            withRepeat(
                withTiming(
                    2 * Math.PI,
                    {
                        duration: 1000, 
                        easing: Easing.linear 
                    }
                ),
                -1,
                false
            )
    }, [])

    return (
        <Svg height="100%" width="100%" viewBox={`0 0 ${width} 100`}>
            <AnimatedPath
                fill="none"
                strokeWidth={2}
                stroke={"#000"}
                animatedProps={animatedProps}
            />
        </Svg>
    )
}