import {
  BorderActiveShadowColor,
  ActiveTextColor,
  BorderColor,
  GreyTextColor,
} from "constants/style";
import { draggingUtils } from "layout";
import styled from "styled-components";
import { getRemoteCompType } from "comps/utils/remote";
import { LowcoderCompMeta } from "types/remoteComp";
import { TransparentImg } from "util/commonUtils";
import { ModuleIcon } from "lowcoder-design";
import { NPM_PLUGIN_ASSETS_BASE_URL } from "constants/npmPlugins";
import { useApplicationId } from "@lowcoder-ee/util/hooks";

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    cursor: grab;
    .module-icon {
      box-shadow: 0 0 5px 0 rgba(49, 94, 251, 0.15);
      border-color: ${BorderActiveShadowColor};
      transform: scale(1.2);
    }
    .module-name {
      color: ${ActiveTextColor};
    }
  }
  .module-icon {
    transition: all 200ms linear;
    margin-right: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${BorderColor};
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .module-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
  }
  .module-name {
    line-height: 1.5;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .module-desc {
    line-height: 1.5;
    font-size: 12px;
    color: ${GreyTextColor};
  }
`;

interface PluginCompItemProps {
  packageName: string;
  packageVersion: string;
  compName: string;
  compMeta: LowcoderCompMeta;
  onDrag: (compType: string) => void;
}

export function PluginCompItem(props: PluginCompItemProps) {
  const appId = useApplicationId();
  const { packageName, packageVersion, compName, compMeta, onDrag } = props;
  const compType = getRemoteCompType("npm", packageName, packageVersion, compName);

  const icon = `${NPM_PLUGIN_ASSETS_BASE_URL}/${appId}/${packageName}@${packageVersion}/${compMeta.icon}`;

  return (
    <ItemWrapper
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("compType", compType);
        e.dataTransfer.setDragImage(TransparentImg, 0, 0);
        draggingUtils.setData("compType", compType);
        draggingUtils.setData("compLayout", compMeta.layoutInfo);
        onDrag(compType);
      }}
    >
      <div className="module-icon">
        {compMeta.icon ? <img alt={compMeta.name} src={icon} /> : <ModuleIcon width={"19px"} />}
      </div>
      <div className="module-content">
        <div className="module-name">{compMeta.name}</div>
        <div className="module-desc">{compMeta.description || "No description."} <span>v{packageVersion || ""}</span></div>
      </div>
    </ItemWrapper>
  );
}
