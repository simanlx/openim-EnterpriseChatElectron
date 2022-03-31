import { LeftOutlined } from "@ant-design/icons";
import { Drawer, message, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import { events, im, isSingleCve } from "../../../../utils";
import SingleDrawer from "./SingleDrawer";
import GroupDrawer from "./GroupDrawer/GroupDrawer";
import EditDrawer from "./GroupDrawer/EditDrawer";
import MemberDrawer from "./GroupDrawer/MemberDrawer";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import GroupManage from "./GroupDrawer/GroupManage";
import { GroupNotice } from "./GroupDrawer/GroupNotice";
import { useTranslation } from "react-i18next";
import { setCurCve } from "../../../../store/actions/cve";
import { ConversationItem, GroupItem, GroupMemberItem, OptType } from "../../../../utils/open_im_sdk/types";
import { SearchMessageDrawer } from "./SearchMessageDrawer";
import delCart_icon from "../../../../assets/images/del_msg.png"
import { DELETEMESSAGE } from "../../../../constants/events";

type CveRightDrawerProps = {
  curCve: ConversationItem;
  visible: boolean;
  curTool?: number;
  onClose: () => void;
};

export type DrawerType = "set" | "edit_group_info" | "member_list" | "group_manage" | "group_notice_list" | "search_message";

export enum GroupRole {
  NOMAL = 1,
  OWNER = 2,
  ADMIN = 3,
}

const CveRightDrawer: FC<CveRightDrawerProps> = ({ curCve, visible, curTool, onClose }) => {
  const [type, setType] = useState<DrawerType>("set");
  const selfID = useSelector((state: RootState) => state.user.selfInfo.userID, shallowEqual);
  const groupMembers = useSelector((state: RootState) => state.contacts.groupMemberList, shallowEqual);
  const groupInfo = useSelector((state: RootState) => state.contacts.groupInfo, shallowEqual);
  const [adminList, setAdminList] = useState<GroupMemberItem[]>([]);
  const [role, setRole] = useState<GroupRole>(GroupRole.NOMAL);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    switch (curTool) {
      case 0:
        setType("group_notice_list");
        break;
      case 1:
        setType("search_message");
        break;
      default:
        setType("set");
        break;
    }
  }, [curTool]);

  useEffect(() => {
    if (groupInfo) {
      getPermission(groupInfo);
    }
  }, [groupInfo]);

  const getPermission = (info: GroupItem) => {
    let adminIds: string[] = [];
    let tmpList = groupMembers.filter((m) => {
      if (m.roleLevel === 2) {
        adminIds.push(m.userID);
        return m;
      }
    });
    setAdminList(tmpList);
    if (selfID === info.ownerUserID) {
      setRole(GroupRole.OWNER);
    } else if (adminIds.includes(selfID!)) {
      setRole(GroupRole.ADMIN);
    } else {
      setRole(GroupRole.NOMAL);
    }
  };

  const changeType = (tp: DrawerType) => {
    setType(tp);
  };

  const updatePin = () => {
    const options = {
      conversationID: curCve.conversationID,
      isPinned: !curCve.isPinned,
    };
    im.pinConversation(options)
      .then((res) => {
        message.success(!curCve.isPinned ? t("PinSuc") : t("CancelPinSuc"));
        curCve.isPinned = !curCve.isPinned;
      })
      .catch((err) => {});
  };

  const updateOpt = () => {
    const options = {
      conversationIDList: [curCve.conversationID],
      opt: curCve.recvMsgOpt === OptType.Nomal ? OptType.WithoutNotify : OptType.Nomal,
    };
    im.setConversationRecvMessageOpt(options).then(() => {
      const tmp = curCve;
      tmp.recvMsgOpt = curCve.recvMsgOpt !== OptType.Nomal ? OptType.Nomal : OptType.WithoutNotify;
      dispatch(setCurCve(tmp));
    });
  };

  const delLocalRecord = () => {
    if (curCve.conversationType === 1) {
      im.clearC2CHistoryMessage(curCve.userID)
      .then((res) => {
        events.emit(DELETEMESSAGE, curCve.userID, true);
      })
      .catch((err) => message.error(t("DeleteMessageFailed")));
    } else {
      im.clearGroupHistoryMessage(curCve.groupID)
      .then((res) => {
        events.emit(DELETEMESSAGE, curCve.groupID, true);
      })
      .catch((err) => message.error(t("DeleteMessageFailed")));
    }
    setIsModalVisible(false)
  }

  const delRemoteRecord = () => {
    im.deleteConversationMsgFromLocalAndSvr(curCve.conversationID)
    .then((res) => {
      events.emit(DELETEMESSAGE, curCve.conversationID, true);
    })
    .catch((err) => message.error(t("DeleteMessageFailed")));
    setIsModalVisible(false)
  }

  const switchContent = () => {
    switch (type) {
      case "set":
        return isSingleCve(curCve) ? (
          <SingleDrawer curCve={curCve} updatePin={updatePin} updateOpt={updateOpt} />
        ) : (
          <GroupDrawer curCve={curCve} role={role!} groupMembers={groupMembers!} updatePin={updatePin} changeType={changeType} updateOpt={updateOpt} />
        );
      case "edit_group_info":
        return <EditDrawer />;
      case "member_list":
        return <MemberDrawer gid={curCve.groupID} groupMembers={groupMembers!} role={role!} selfID={selfID!} />;
      case "group_manage":
        return <GroupManage gid={curCve.groupID} groupMembers={groupMembers} adminList={adminList} />;
      case "group_notice_list":
        return <GroupNotice />;
      case "search_message":
        return <SearchMessageDrawer curCve={curCve} />;
      default:
        break;
    }
  };

  const backTitle = (tp: DrawerType, title: string) => (
    <div>
      <LeftOutlined onClick={() => setType(tp)} />
      <span style={{ marginLeft: "12px" }}>{title}</span>
    </div>
  );

  const switchTitle = () => {
    switch (type) {
      case "set":
        return <div>{t("Setting")}</div>;
      case "edit_group_info":
        return backTitle("set", t("EditGroupInfo"));
      case "member_list":
        return backTitle("set", t("GroupMembers"));
      case "group_manage":
        return backTitle("set", t("GroupManagement"));
      case "group_notice_list":
        return <div>{t("GroupAnnouncement")}</div>;
      case "search_message":
        return <div className="search_del">{t("ChatsRecord")}<img src={delCart_icon} alt='' onClick={() => setIsModalVisible(true)}/></div>
      default:
        break;
    }
  };

  return (
    <>
      <Drawer
      className="right_set_drawer"
      width={360}
      // mask={false}
      maskClosable
      title={switchTitle()}
      placement="right"
      onClose={() => {
        setType("set");
        onClose();
      }}
      closable={type === "set" || type === "search_message"}
      visible={visible}
      getContainer={document.getElementById("chat_main")!}
      >
        {switchContent()}
      </Drawer>
      <Modal
      className="delCve_modal"
      visible={isModalVisible}
      footer={null}
      onCancel={() => setIsModalVisible(false)}
      closable= {false}
      centered
      >
        <div className="delCve_box">
          <p className="delCve_box_text" onClick={delLocalRecord}>删除本地记录</p>
          <p className="delCve_box_text" onClick={delRemoteRecord}>删除远程记录</p>
        </div>
      </Modal>
    </>
  );
};

export default CveRightDrawer;
