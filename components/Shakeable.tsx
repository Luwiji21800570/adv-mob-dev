import React, { forwardRef, useImperativeHandle } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type ShakeableRef = {
  shake: () => void;
};

const Shakeable = forwardRef<ShakeableRef, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const offset = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: offset.value }],
    }));

    const runShake = () => {
      offset.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    };

    useImperativeHandle(ref, () => ({
      shake: runShake,
    }));

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  }
);

export default Shakeable;
