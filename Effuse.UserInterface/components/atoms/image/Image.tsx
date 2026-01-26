import React from "react";
import { ImageResizeMode, Image as RnImage } from "react-native";

export type ImageProps = React.PropsWithChildren & {
  href: string | URL;
  width: number;
  height: number;
  resize_mode?: ImageResizeMode;
};

export const Image = (props: ImageProps) => {
  const [error, set_error] = React.useState(false);

  if (error) return <>{props.children}</>;

  return (
    <RnImage
      source={{ uri: props.href.toString() }}
      style={{ width: props.width, height: props.height }}
      resizeMode={props.resize_mode ?? "cover"}
      onError={() => set_error(true)}
    />
  );
};
