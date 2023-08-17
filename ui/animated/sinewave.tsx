import { FC, useEffect } from 'react'
import { Dimensions } from 'react-native'
import Animated, {
    Easing,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const { width } = Dimensions.get('window')
const AnimatedPath = Animated.createAnimatedComponent(Path)

const generateSineWavePath = (
    amplitude: number,
    frequency: number,
    phase: number,
    width: number,
    taperValue: number
) => {
    'worklet'
    let path = `M 0 ${amplitude * Math.sin(phase)}`

    for (let x = 0; x <= width; x++) {
        const taper =
            0.5 * (1 - Math.cos((2 * Math.PI * x) / (width - 1))) * taperValue
        const y = amplitude *
                Math.sin(2 * Math.PI * (x / width) * frequency + phase) +
            amplitude
        path += ` L ${x} ${y}`
    }

    return path
}

type SineWaveProps = {
    amplitude: number
    frequency: number
    startPhase: number
    duration: number
    color: string
    stroke: number
    taperValue: number
}

export const SineWave: FC<SineWaveProps> = ({
    amplitude,
    frequency,
    startPhase,
    duration,
    color,
    stroke,
    taperValue
}) => {
    const phase = useSharedValue(startPhase)
    const amplitudeAnimated = useDerivedValue(() => {
        return withTiming(amplitude, {
            duration: 800,
            easing: Easing.inOut(Easing.cubic)
        })
    }, [amplitude])

    useEffect(() => {
        phase.value = withRepeat(
            withTiming(2 * Math.PI - startPhase, {
                duration,
                easing: Easing.linear
            }),
            -1,
            false
        )
    }, [])

    const animatedProps = useAnimatedProps(() => {
        const d = generateSineWavePath(
            amplitudeAnimated.value,
            frequency,
            phase.value,
            width,
            taperValue
        )
        return { d }
    })

    return (
        <Svg height="100%" width="100%" viewBox={`0 0 ${width} 100`}>
            <AnimatedPath
                translateX={-startPhase}
                animatedProps={animatedProps}
                stroke={color}
                strokeWidth={stroke}
                fill="none"
            />
        </Svg>
    )
}
