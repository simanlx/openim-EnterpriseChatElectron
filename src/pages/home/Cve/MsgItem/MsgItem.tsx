import { LoadingOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Spin, Checkbox, Modal, Dropdown, Menu, Popover } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { MyAvatar } from "../../../../components/MyAvatar";
import { messageTypes } from "../../../../constants/messageContentType";
import { events, im, isSingleCve } from "../../../../utils";

import { ATSTATEUPDATE, MUTILMSGCHANGE } from "../../../../constants/events";
import { useInViewport, useLongPress } from "ahooks";

import SwitchMsgType from "./SwitchMsgType/SwitchMsgType";
import MsgMenu from "./MsgMenu/MsgMenu";
import { useTranslation } from "react-i18next";
import { ConversationItem, GroupMemberItem, MessageItem, PictureElem } from "../../../../utils/open_im_sdk/types";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { DetailType } from "../../../../@types/open_im";

type MsgItemProps = {
  msg: MessageItem;
  selfID: string;
  imgClick: (el: PictureElem) => void;
  audio: React.RefObject<HTMLAudioElement>;
  curCve: ConversationItem;
  mutilSelect?: boolean;
};

const canSelectTypes = [
  messageTypes.TEXTMESSAGE,
  messageTypes.ATTEXTMESSAGE,
  messageTypes.PICTUREMESSAGE,
  messageTypes.VIDEOMESSAGE,
  messageTypes.VOICEMESSAGE,
  messageTypes.CARDMESSAGE,
  messageTypes.FILEMESSAGE,
  messageTypes.LOCATIONMESSAGE,
];

const MsgItem: FC<MsgItemProps> = (props) => {
  const { msg, selfID, curCve, mutilSelect, audio } = props;
  const [lastChange, setLastChange] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const avaRef = useRef<HTMLDivElement>(null);
  const msgItemRef = useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(msgItemRef);
  const { t } = useTranslation();
  const [unreadCardShow, setUnreadCardShow] = useState<boolean>(false);
  const groupMemberList = useSelector((state: RootState) => state.contacts.groupMemberList, shallowEqual);
  const groupMemberStatus = useSelector((state: RootState) => state.contacts.member2status, shallowEqual);
  const [greadInfo, setGreadInfo] = useState<{
    groupMemberTotal: number;
    readMemberList: GroupMemberItem[];
    unReadMemberList: GroupMemberItem[];
  }>({
    groupMemberTotal: 0,
    readMemberList: [],
    unReadMemberList: [],
  });

  const readMembers = msg.attachedInfoElem.groupHasReadInfo && msg.attachedInfoElem.groupHasReadInfo.hasReadCount;

  useEffect(() => {
    let tmpGroupMemberTotal = -1
    groupMemberList.forEach(() => {
      tmpGroupMemberTotal += 1;
    });
    const tmpReadMemberList = groupMemberList?.filter((item) => {
      if (msg.attachedInfoElem.groupHasReadInfo.hasReadUserIDList?.includes(item.userID)) {
        return item;
      }
    });

    const tmpUnReadMemberList = groupMemberList?.filter((item) => {
      if (!msg.attachedInfoElem.groupHasReadInfo.hasReadUserIDList?.includes(item.userID) && item.userID !== selfID) {
        return item;
      }
    });
    setGreadInfo({
      groupMemberTotal: tmpGroupMemberTotal,
      readMemberList: tmpReadMemberList,
      unReadMemberList: tmpUnReadMemberList,
    });
  }, [groupMemberList]);

  useEffect(() => {
    if (lastChange) {
      setLastChange(false);
    }
  }, [mutilSelect]);

  useEffect(() => {
    if (inViewport && curCve.userID === msg.sendID && !msg.isRead) {
      markC2CHasRead(msg.sendID, msg.clientMsgID);
    }
    if (inViewport && curCve.groupID === msg.groupID && curCve.groupID !== "" && !msg.isRead && msg.sendID !== selfID) {
      markGroupC2CHasRead();
    }
  }, [inViewport, curCve, selfID]);

  const isSelf = (sendID: string): boolean => {
    return selfID === sendID;
  };

  const switchOnline = (oType: string, details?: DetailType[]) => {
    switch (oType) {
      case "offline":
        return t("Offline");
      case "online":
        let str = "";
        details?.map((detail) => {
          if (detail.status === "online") {
            str += `${detail.platform}/`;
          }
        });
        return `${str.slice(0, -1)} ${t("Online")}`;
      default:
        return "";
    }
  };

  const markC2CHasRead = (userID: string, msgID: string) => {
    msg.isRead = true;
    im.markC2CMessageAsRead({ userID, msgIDList: [msgID] });
  };

  const markGroupC2CHasRead = () => {
    im.markGroupMessageAsRead({ groupID: curCve.groupID, msgIDList: [msg.clientMsgID] });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const switchTip = () => {
    switch (msg.status) {
      case 1:
        return <Spin indicator={antIcon} />;
      case 2:
        if (curCve && isSingleCve(curCve)) {
          return msg.isRead ? t("Readed") : t("UnRead");
        }
        if (curCve && !isSingleCve(curCve)) {
          return msg.isRead ? t("Readed") : t("UnRead");
        }
        return null;
      case 3:
        return <ExclamationCircleFilled style={{ color: "#f34037", fontSize: "20px" }} onClick={() => console.log(888)} />;
      default:
        break;
    }
  };

  const switchStyle = () => {
    if (isSelf(msg.sendID)) {
      return {
        marginLeft: "12px",
      };
    } else {
      return {
        marginRight: "12px",
      };
    }
  };

  const mutilCheckItem = () => {
    if (mutilSelect && canSelectTypes.includes(msg.contentType)) {
      events.emit(MUTILMSGCHANGE, !lastChange, msg);
      setLastChange((v) => !v);
    }
  };

  const avatarLongPress = () => {
    if (!isSingleCve(curCve!)) {
      events.emit(ATSTATEUPDATE, msg.sendID, msg.senderNickname);
    }
  };

  useLongPress(avatarLongPress, avaRef, {
    onClick: () => window.userClick(msg.sendID),
    delay: 500,
  });

  const handleUnreadVisibleChange = (val: boolean) => {
    setUnreadCardShow(val);
  };

  const offCard = () => {
    setUnreadCardShow(false);
  };

  const UnReadContent = (
    <div className="unReadContent">
      <div className="title">
        <span>{t("MessageRecipientList")}</span>
        <span onClick={offCard}></span>
      </div>
      <div className="content">
        <div className="left">
          <span className="tip">{readMembers}</span>
          {t("PeopleReaded")}
          <div className="list">
            {greadInfo.readMemberList.map((item, index) => {
              if (item) {
                const curMember = groupMemberStatus[item.userID];
                return (
                  <div className="list_item" key={index}>
                    <MyAvatar src={item.faceURL} size={38} />
                    <div className="info">
                      <span>{item.nickname}</span>
                      <span>[{switchOnline(curMember?.status, curMember?.detailPlatformStatus)}]</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className="right">
          <span className="tip">{greadInfo.groupMemberTotal - readMembers}</span>
          {t("PeopleUnRead")}
          <div className="list">
            {greadInfo.unReadMemberList.map((item, index) => {
              if (item) {
                const curMember = groupMemberStatus[item.userID];
                return (
                  <div className="list_item" key={index}>
                    <MyAvatar src={item.faceURL} size={38} />
                    <div className="info">
                      <span>{item.nickname}</span>
                      <span>[{switchOnline(curMember?.status, curMember?.detailPlatformStatus)}]</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={msgItemRef} onClick={mutilCheckItem} className={`chat_bg_msg ${isSelf(msg.sendID) ? "chat_bg_omsg" : ""}`}>
      {mutilSelect && (
        <div style={switchStyle()} className="chat_bg_msg_check">
          <Checkbox disabled={!canSelectTypes.includes(msg.contentType)} checked={lastChange} />
        </div>
      )}

      <div className="cs">
        <div ref={avaRef}>
          <MyAvatar className="chat_bg_msg_icon" shape="square" size={42} src={msg.senderFaceUrl} />
        </div>
      </div>

      <div className="chat_bg_msg_content">
        {(!curCve || !isSingleCve(curCve)) && <span className="nick">{msg.senderNickname}</span>}
        <MsgMenu key={msg.clientMsgID} visible={contextMenuVisible} msg={msg} isSelf={isSelf(msg.sendID)} visibleChange={(v) => setContextMenuVisible(v)}>
          <SwitchMsgType {...props} />
        </MsgMenu>
      </div>

      {isSelf(msg.sendID) ? (
        msg.status === 2 ? (
          <div style={{ color: "#428BE5", fontSize: "12px" }} className="chat_bg_flag_read">
            {curCve && isSingleCve(curCve) ? (
              <div>{switchTip()}</div>
            ) : (
              <div className="group_UnRead">
                {/* <Dropdown overlay={UnReadContent} placement="topRight" trigger={['click']}>
                    <div onClick={() => {}}>
                      {`85${t('PeopleUnRead')}`}
                    </div>
                  </Dropdown> */}
                <Popover
                  content={UnReadContent}
                  trigger="click"
                  overlayClassName="unread_card"
                  placement="topRight"
                  onVisibleChange={handleUnreadVisibleChange}
                  visible={unreadCardShow}
                >
                  {greadInfo.groupMemberTotal - readMembers !== 0 ? greadInfo.groupMemberTotal - readMembers + t("PeopleUnRead") : t("AllReaded")}
                </Popover>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: msg.isRead ? "#999" : "#428BE5", marginTop: curCve && isSingleCve(curCve) ? "0" : "24px", fontSize: "12px" }} className="chat_bg_flag">
            {switchTip()}
          </div>
        )
      ) : null}
    </div>
  );
};

export default MsgItem;
