import NextImage, { ImageProps } from "next/image";
import { asset } from "@/lib/asset";

export function Image(props: ImageProps) {
  const src = typeof props.src === "string" ? asset(props.src) : props.src;
  return <NextImage {...props} src={src} />;
}
