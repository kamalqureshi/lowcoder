import { trans } from "i18n";
import {
  SimpleComp,
} from "lowcoder-core";
import {
  BlockGrayLabel,
  ControlPropertyViewWrapper,
  CustomModal,
  DeleteInputIcon,
  TacoButton,
  TacoInput,
  useIcon,
  wrapperToControlItem,
} from "lowcoder-design";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Popover from "antd/es/popover";
import { CloseIcon, SearchIcon } from "icons";
import Draggable from "react-draggable";
import IconScoutApi from "@lowcoder-ee/api/iconscoutApi";
import { searchAssets, getAssetLinks, SearchParams } from "@lowcoder-ee/api/iconFlowApi";
import List, { ListRowProps } from "react-virtualized/dist/es/List";
import { debounce } from "lodash";
import Spin from "antd/es/spin";
import { ControlParams } from "./controlParams";
import { getBase64 } from "@lowcoder-ee/util/fileUtils";
import Flex from "antd/es/flex";
import Typography from "antd/es/typography";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import Badge from "antd/es/badge";
import { CrownFilled } from "@ant-design/icons";
import { SUBSCRIPTION_SETTING } from "@lowcoder-ee/constants/routesURL";
import { useSimpleSubscriptionContext } from "@lowcoder-ee/util/context/SimpleSubscriptionContext";
import { SubscriptionProductsEnum } from "@lowcoder-ee/constants/subscriptionConstants";

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const ButtonIconWrapper = styled.div`
  display: flex;
  width: 18px;
`;

const StyledDeleteInputIcon = styled(DeleteInputIcon)`
  margin-left: auto;
  cursor: pointer;

  &:hover circle {
    fill: #8b8fa3;
  }
`;

const StyledImage = styled.img`
  height: 100%;
  width: 100%;
  color: currentColor;
`;

const Wrapper = styled.div`
  > div:nth-of-type(1) {
    margin-bottom: 4px;
  }
`;
const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  min-height: 480px;
  background: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
`;

const TitleDiv = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
  user-select: none;
`;
const TitleText = styled.span`
  font-size: 16px;
  color: #222222;
  line-height: 16px;
`;
const StyledCloseIcon = styled(CloseIcon)`
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #8b8fa3;

  &:hover g line {
    stroke: #222222;
  }
`;

const SearchDiv = styled.div`
  position: relative;
  margin: 0px 16px;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;
const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 6px;
  left: 12px;
`;
const IconListWrapper = styled.div`
  padding-left: 10px;
  padding-right: 4px;
`;
const IconList = styled(List)`
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    border-radius: 9999px;
    background-color: rgba(139, 143, 163, 0.2);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(139, 143, 163, 0.36);
  }
`;

const IconRow = styled.div`
  padding: 6px;
  display: flex;
  align-items: flex-start; /* Align items to the start to allow different heights */
  justify-content: space-between;

  &:last-child {
    gap: 8px;
    justify-content: flex-start;
  }

  .ant-badge {
    height: 100%;
  }
`;

const IconItemContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: flex-start; 
  cursor: pointer;
  font-size: 28px;
  border-radius: 4px;
  background: #fafafa;

  &:hover {
    box-shadow: 0 8px 24px #1a29470a,0 2px 8px #1a294714;
  }

  &:focus {
    border: 1px solid #315efb;
    box-shadow: 0 0 0 2px #d6e4ff;
  }
`;

const IconWrapper = styled.div<{$isPremium?: boolean}>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.$isPremium && 'opacity: 0.25' };
`;

const StyledPreviewIcon = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`;

const StyledPreviewLotte = styled.video`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`

export enum AssetType {
  ICON = "icon",
  ILLUSTRATION = "illustration",
  // '3D' = "3d",
  LOTTIE = "lottie",
}

export type IconScoutAsset = {
  uuid: string;
  value: string;
  preview: string;
}

const IconScoutSearchParams: SearchParams = {
  query: '',
  asset: 'icon',
  per_page: 25,
  page: 1,
  sort: 'relevant',
};

const columnNum = 8;

export const IconPicker = (props: {
  assetType: string;
  uuid: string;
  value: string;
  preview: string;
  onChange: (key: string, value: string, preview: string) => void;
  label?: ReactNode;
  IconType?: "OnlyAntd" | "All" | "default" | undefined;
}) => {
  const [ visible, setVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ downloading, setDownloading ] = useState(false)
  const [ searchText, setSearchText ] = useState<string>('')
  const [ searchResults, setSearchResults ] = useState<Array<any>>([]);
  const { subscriptions } = useSimpleSubscriptionContext();

  const mediaPackSubscription = subscriptions.find(
    sub => sub.product === SubscriptionProductsEnum.MEDIAPACKAGE && sub.status === 'active'
  );

  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;

  const onChangeIcon = useCallback(
    (key: string, value: string, url: string) => {
      onChangeRef.current(key, value, url);
      setVisible(false);
    }, []
  );

  const fetchResults = async (query: string) => {
    setLoading(true);
    const freeResult = await searchAssets({
      ...IconScoutSearchParams,
      asset: props.assetType,
      price: 'free',
      query,
    });
    const premiumResult = await searchAssets({
      ...IconScoutSearchParams,
      asset: props.assetType,
      price: 'premium',
      query,
    });
    setLoading(false);

    console.log("freeResult", freeResult, "premiumResult", premiumResult)

    setSearchResults([...freeResult.data, ...premiumResult.data]);
  };

  const downloadAsset = async (
    uuid: string,
    downloadUrl: string,
    callback: (assetUrl: string) => void,
  ) => {
    try {
      if (uuid && downloadUrl) {
        const json = await IconScoutApi.downloadAsset(downloadUrl);
        getBase64(json, (url: string) => {
          callback(url);
        });
      }
    } catch(error) {
      console.error(error);
      setDownloading(false);
    }
  }

  const fetchDownloadUrl = async (uuid: string, preview: string) => {
    try {
      setDownloading(true);
      const result = await getAssetLinks(uuid, {
        format: props.assetType === AssetType.LOTTIE ? 'lottie' : 'svg',
      });

      downloadAsset(uuid, result.download_url, (assetUrl: string) => {
        setDownloading(false);
        onChangeIcon(uuid, assetUrl, preview);
      });
    } catch (error) {
      console.error(error);
      setDownloading(false);
    }
  }

  const handleChange = (e: { target: { value: any; }; }) => {
    const query = e.target.value;
    setSearchText(query); // Update search text immediately
  
    if (query.length > 2) {
      debouncedFetchResults(query); // Trigger search only for >2 characters
    } else {
      setSearchResults([]); // Clear results if input is too short
    }
  };

  const debouncedFetchResults = useMemo(() => debounce(fetchResults, 700), []);

  const rowRenderer = useCallback(
    (p: ListRowProps) => (
      <IconRow key={p.key} style={p.style}>
        {searchResults
          .slice(p.index * columnNum, (p.index + 1) * columnNum)
          .map((icon) => (
            <IconItemContainer
              key={icon.uuid}
              tabIndex={0}
              onClick={() => {
                // check if premium content then show subscription popup
                // TODO: if user has subscription then skip this if block
                if (!mediaPackSubscription) {
                  CustomModal.confirm({
                    title: trans("iconScout.buySubscriptionTitle"),
                    content: trans("iconScout.buySubscriptionContent"),
                    onConfirm: () =>{
                      window.open(SUBSCRIPTION_SETTING, "_blank");
                    },
                    confirmBtnType: "primary",
                    okText: trans("iconScout.buySubscriptionButton"),
                  })
                  return;
                }

                fetchDownloadUrl(
                  icon.uuid,
                  props.assetType === AssetType.ICON ? icon.urls.png_64 : icon.urls.thumb,
                );
              }}
            >
              <Badge
                count={icon.price !== 0 ? <CrownFilled style={{color: "#e7b549"}} /> : undefined}
                size='small'
              >
                <IconWrapper $isPremium={icon.price !== 0}>
                  {props.assetType === AssetType.ICON && (
                    <StyledPreviewIcon src={icon.urls.png_64} />
                  )}
                  {props.assetType === AssetType.ILLUSTRATION && (
                    <StyledPreviewIcon src={icon.urls.thumb} />
                  )}
                  {props.assetType === AssetType.LOTTIE && (
                    <StyledPreviewLotte src={icon.urls.thumb} autoPlay />
                  )}
                </IconWrapper>
              </Badge>
            </IconItemContainer>
          ))}
      </IconRow>
    ),[searchResults]
  );

  const popupTitle = useMemo(() => {
    if (props.assetType === AssetType.ILLUSTRATION) return trans("iconScout.searchImage");
    if (props.assetType === AssetType.LOTTIE) return trans("iconScout.searchAnimation");
    return trans("iconScout.searchIcon");
  }, [props.assetType]);

  return (
    <Popover
      trigger={'click'}
      placement="left"
      open={visible}
      onOpenChange={setVisible}
      styles={{
        body: {
          border: "none",
          boxShadow: "none",
          background: "transparent",
        }
      }}
      destroyTooltipOnHide
      content={
        <Draggable handle=".dragHandle">
          <PopupContainer>
            <TitleDiv className="dragHandle">
              <TitleText>{popupTitle}</TitleText>
              <StyledCloseIcon onClick={() => setVisible(false)} />
            </TitleDiv>
            <SearchDiv>
              <TacoInput
                style={{ width: "100%", paddingLeft: "40px" }}
                onChange={handleChange}
                placeholder={popupTitle}
              />
              <StyledSearchIcon />
            </SearchDiv>
            {loading && (
              <Flex align="center" justify="center" style={{flex: 1}}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 25 }} spin />} />
              </Flex>
            )}
            <Spin spinning={downloading} indicator={<LoadingOutlined style={{ fontSize: 25 }} />} >
              {!loading && Boolean(searchText) && !Boolean(searchResults?.length) && (
                <Flex align="center" justify="center" style={{flex: 1}}>
                  <Typography.Text type="secondary">
                    {trans("iconScout.noResults")}
                  </Typography.Text>
                </Flex>
              )}
              {!loading && Boolean(searchText) && Boolean(searchResults?.length) && (
                <IconListWrapper>
                  <IconList
                    width={550}
                    height={400}
                    rowHeight={80}
                    rowCount={Math.ceil(searchResults.length / columnNum)}
                    rowRenderer={rowRenderer}
                    />
                </IconListWrapper>
              )}
            </Spin>
          </PopupContainer>
        </Draggable>
      }
    >
      <TacoButton style={{ width: "100%" }}>
        {props.preview ? (
          <ButtonWrapper>
            <ButtonIconWrapper>
              {props.assetType === AssetType.LOTTIE && (
                <video style={{'width': '100%'}} src={props.preview} autoPlay />
              )}
              {props.assetType !== AssetType.LOTTIE && (
                <IconControlView value={props.value} uuid={props.uuid}/>
              )}
            </ButtonIconWrapper>
            <StyledDeleteInputIcon
              onClick={(e) => {
                props.onChange("", "", "");
                e.stopPropagation();
              }}
            />
          </ButtonWrapper>
        ) : (
          <BlockGrayLabel label={trans("iconControl.selectIcon")} />
        )}
      </TacoButton>
    </Popover>
  );
};

export function IconControlView(props: { value: string, uuid: string }) {
  const { value } = props;
  const icon = useIcon(value);

  if (icon) {
    return icon.getView();
  }
  return <StyledImage src={value} alt="" />;
}

export function IconscoutControl(
  assetType: string = AssetType.ICON,
) {
  return class IconscoutControl extends SimpleComp<IconScoutAsset> {
    readonly IGNORABLE_DEFAULT_VALUE = false;
    protected getDefaultValue(): IconScoutAsset {
      return {
        uuid: '',
        value: '',
        preview: '',
      };
    }

    override getPropertyView(): ReactNode {
      throw new Error("Method not implemented.");
    }

    propertyView(params: ControlParams & { type?: "switch" | "checkbox" }) {
      return wrapperToControlItem(
        <ControlPropertyViewWrapper {...params}>
          <IconPicker
            assetType={assetType}
            uuid={this.value.uuid}
            value={this.value.value}
            preview={this.value.preview}
            onChange={(uuid, value, preview) => {
              this.dispatchChangeValueAction({uuid, value, preview})
            }}
            label={params.label}
            IconType={params.IconType}
          />
        </ControlPropertyViewWrapper>
      );
    }
  }
}
