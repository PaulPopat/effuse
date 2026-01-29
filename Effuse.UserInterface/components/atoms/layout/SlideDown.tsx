import React from "react";
import { View } from "react-native";
import Animated, { withSpring, useSharedValue } from "react-native-reanimated";

export type SlideDownProps = React.PropsWithChildren & {
  open: boolean;
};

export const SlideDown = (props: SlideDownProps) => {
  const [height_state, set_height] = React.useState(0);
  const height = useSharedValue(0);

  React.useEffect(() => {
    height.value = withSpring(props.open ? height_state : 0);
  }, [props.open, height_state]);

  return (
    <Animated.View style={{ overflow: "hidden", height, width: "100%" }}>
      <View onLayout={(e) => set_height(e.nativeEvent.layout.height)}>
        {props.children}
      </View>
    </Animated.View>
  );
};
