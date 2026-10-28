import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { theme } from "../../../shared/theme";
import { Hook } from "./Hook";
import { Item } from "./Item";
import { Closing } from "./Closing";
import { content } from "../content";
import { NARRATION, closingFrames, hookFrames, itemFrames, timeline } from "../timeline";

export const AdultChildrenTalk: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Audio src={staticFile(NARRATION)} />
      <Series>
        <Series.Sequence durationInFrames={hookFrames}>
          <Hook />
        </Series.Sequence>
        {content.items.map((item, i) => (
          <Series.Sequence key={i} durationInFrames={itemFrames[i]}>
            <Item n={i + 1} {...item} beats={timeline.items[i]} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={closingFrames}>
          <Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
