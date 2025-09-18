// src/components/AnimatedInput.tsx
import React, { useEffect } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = TextInputProps & {
  hasError?: boolean;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedInput: React.FC<Props> = ({ hasError, style, ...rest }) => {
  const offset = useSharedValue(0);

  useEffect(() => {
    if (hasError) {
      offset.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [hasError]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <AnimatedTextInput
      {...rest}
      style={[styles.input, style, animatedStyle]}
      placeholderTextColor="#666"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 320,
    maxWidth: "100%",
    backgroundColor: "#101010",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
});

export default AnimatedInput;
