import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, TabPaneProps, Tabs } from "antd";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "throttle-debounce";
import { MyAvatar } from "../../../../components/MyAvatar";
import { SessionType } from "../../../../constants/messageContentType";
import { im } from "../../../../utils";
import { ConversationItem } from "../../../../utils/open_im_sdk/types";

export const SearchMessageDrawer = ({ curCve }: { curCve: ConversationItem }) => {
  const [activeKey, setActiveKey] = useState("101");
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      const ink: HTMLDivElement | null = window.document.querySelector(".ant-tabs-ink-bar");
      if (ink) ink.style.transform = "translateX(3px)";
    });
  }, []);

  const tabChange = (key: string) => {
    setActiveKey(key);
    if(key === "101") return;
    searchMessage("",Number(key))
  };

  const searchMessage = (key: string,type?:number) => {
    if(key===""&&!type) return;
    const options = {
      sourceID: curCve.conversationType === SessionType.SINGLECVE ? curCve.userID : curCve.groupID,
      sessionType: curCve.conversationType,
      keywordList: type ? [] : [key],
      keywordListMatchType: 0,
      senderUserIDList: [],
      messageTypeList: type? [type] : [],
      searchTimePosition: 0,
      searchTimePeriod: 0,
      pageIndex: 1,
      count:200
    };
    im.searchLocalMessages(options).then((res) => {
      console.log(JSON.parse(res.data));
    });
  };

  const debounceSearch = debounce(1000, searchMessage);

  return (
    <div className="search_message">
      <Tabs activeKey={activeKey} defaultActiveKey="101" onChange={tabChange}>
        <MyTabpane debounceSearch={debounceSearch} tab="消息" key="101">
          <TextMessageList />
        </MyTabpane>
        <MyTabpane debounceSearch={debounceSearch} tab="图片" key="102"></MyTabpane>
        <MyTabpane debounceSearch={debounceSearch} tab="视频" key="104"></MyTabpane>
        <MyTabpane debounceSearch={debounceSearch} tab="文件" key="105"></MyTabpane>
      </Tabs>
    </div>
  );
};

interface MyTabpaneProps extends TabPaneProps {
  debounceSearch: (key: string,type?:number) => void;
}

const MyTabpane: FC<MyTabpaneProps> = (props) => {
  const { t } = useTranslation();

  const inputOnChange = (key: React.ChangeEvent<HTMLInputElement>) => props.debounceSearch(key.target.value);

  

  return (
    <Tabs.TabPane {...props}>
      <div className="message_search_input">
        <Input onChange={inputOnChange} placeholder={"开发中~"} prefix={<SearchOutlined />} />
      </div>
      {props.children}
    </Tabs.TabPane>
  );
};

const TextMessageList = () => {
  const { t } = useTranslation();

  const TextMessageItem = () => (
    <div className="text_item">
      <MyAvatar size={36} />
      <div className="text_item_right">
        <div className="info">
          <span className="nick">李华</span>
          <span className="time">15：20</span>
        </div>
        <div>HI，我通过你的好友请求了。</div>
      </div>
    </div>
  );

  return (
    <div className="text_message_list">
      {/* <TextMessageItem /> */}
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("EmptySearch")}/>
    </div>
  );
};
