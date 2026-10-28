import { Composition } from "remotion";
import { AdultChildrenTalk3D } from "./videos/adult-children-talk/AdultChildrenTalk3D";
import { AdultChildrenTalk as AdultChildrenTalk2D } from "./videos/adult-children-talk/2d/AdultChildrenTalk";
import { totalFrames } from "./videos/adult-children-talk/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="adult-children-talk"
        component={AdultChildrenTalk3D}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* 이전 2D 버전 */}
      <Composition
        id="adult-children-talk-2d"
        component={AdultChildrenTalk2D}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
