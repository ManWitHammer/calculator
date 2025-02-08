import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgCalculator = (props: SvgProps) => (
  <Svg
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#b8b8b8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 8.5h3.5m3.25 5.5h3.5m-3.5 2.5h3.5m-10.5-1.25h4m-2 2v-4M14.1 7l2.829 2.828m-2.829 0L16.93 7M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
    />
  </Svg>
)
export default SvgCalculator