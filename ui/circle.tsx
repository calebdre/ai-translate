import React, { FC, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Svg, { Circle, Line, Path } from 'react-native-svg'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    useDerivedValue
} from 'react-native-reanimated'

type CircularProgressProps = {
    strokeWidth: number
    radius: number
    backgroundColor: string
    percentageComplete: number
}

const AnimatedPath = Animated.createAnimatedComponent(Path)
const sineWave = (A: number, f: number, phase: number, x: number): number =>
    A * Math.sin(2 * Math.PI * f * x + phase)

const { width } = Dimensions.get('window')
const height = 200 // or any other value you prefer
export const CircularProgress: FC<CircularProgressProps> = ({
    radius,
    strokeWidth,
    backgroundColor,
    percentageComplete,
    ...props
}) => {
    const phase = useSharedValue(0)
    const animateTo = useDerivedValue(() => {
        return sineWave(100, 0.01, phase.value, width * percentageComplete)
    })

    const animatedStyle = useAnimatedStyle(() => {
        let d = `M 0 ${height / 2} `
        for (let x = 0; x <= width; x++) {
            d += `L ${x} ${height / 2 + sineWave(100, 0.01, phase.value, x)} `
        }
        return { margin: 0, d }
    })

    useEffect(() => {
        phase.value = withRepeat(
            withTiming(2 * Math.PI, {
                duration: 2000,
                easing: Easing.linear
            }),
            -1,
            false
        )
    }, [])
    return (
        <View style={styles.container} {...props}>
            <Svg height={height} width={width}>
                <AnimatedPath
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    animatedProps={animatedStyle}
                />
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
