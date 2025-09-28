import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  children: React.ReactNode;
  style?: any;
};

const FadeInView: React.FC<Props> = ({ visible, children, style }) => {
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[style, animatedStyle]}
      pointerEvents={visible ? "auto" : "none"} // 🔑 Don’t block touches when hidden
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
