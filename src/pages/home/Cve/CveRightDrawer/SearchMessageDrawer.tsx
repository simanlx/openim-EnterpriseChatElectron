import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, TabPaneProps, Tabs, Typography, Image as AntdImage, Dropdown, Menu } from "antd";
import { t } from "i18next";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "throttle-debounce";
import { MyAvatar } from "../../../../components/MyAvatar";
import { SessionType } from "../../../../constants/messageContentType";
import { im } from "../../../../utils";
import { ConversationItem } from "../../../../utils/open_im_sdk/types";
import styles from "../../../../components/SearchBar/index.module.less";
import file_zip from '../../../../assets/images/file_zip.png'

const { Paragraph, Text } = Typography;

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
        <MyTabpane debounceSearch={debounceSearch} tab="图片" key="102">
          <PicMessageList />
        </MyTabpane>
        <MyTabpane debounceSearch={debounceSearch} tab="视频" key="104">
          <VideoMessageList />
        </MyTabpane>
        <MyTabpane debounceSearch={debounceSearch} tab="文件" key="105">
          <FileMessageList />
        </MyTabpane>
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
        <Input onChange={inputOnChange} placeholder={t('Search')} prefix={<SearchOutlined />} />
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
      {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("EmptySearch")}/> */}
      <ul className="content_list">
        {
          new Array(16).fill(null).map((item, index) => {
            return  <li key={index}>
              <MyAvatar src={''} size={38} />
              <div className="info">
                <div className="title">
                  <span>姓名</span>
                  <span>时间</span>
                </div>
                <div className="content">
                  <span>
                    <Paragraph copyable={{ text: 'Hello, Ant Design!' }}>
                      <Text
                        style={{width: "220px"}}
                        ellipsis={{ tooltip: 'I am ellipsis now!' }}
                      >
                        Ant Design, a design language for background applications, is refined by Ant UED Team.This is a copyable text.
                      </Text>
                    </Paragraph>
                  </span>
                </div>
              </div>
            </li>
          })
        }
      </ul>
    </div>
  );
};
const picClick = () => {

}

const preservation = () => {
  console.log('保存')
}

const faceMenu = () => (
  <Menu className={styles.btn_menu}>
    <Menu.Item key="1" onClick={() => preservation()}>{t('AddMsg')}</Menu.Item>
  </Menu>
)

const PicMessageList = () => {
  return <div className="pic_message_list">
    <div className="week">
      <span>本周</span>
      <div className="content">
        {
          new Array(6).fill(null).map((item, index) => {
            return <div className="item" key={index}>
              <Dropdown
              overlay={faceMenu}
              trigger={['contextMenu']}
              placement='bottom'
              >
                <AntdImage
                // preview={false}
                style={{borderRadius: '5px'}}
                height={80}
                width={80}
                src={'https://scpic1.chinaz.net/Files/pic/pic9/202203/apic39782_s.jpg'}
                onContextMenu={() => {}}
                />
              </Dropdown>
            </div>
          })
        }
      </div>
    </div>
    <div className="month">
    <span>本月</span>
      <div className="content">
        {
          new Array(16).fill(null).map((item, index) => {
            return <div className="item" key={index}>
              <Dropdown
              overlay={faceMenu}
              trigger={['contextMenu']}
              placement='bottom'
              >
                <AntdImage
                // preview={false}
                style={{borderRadius: '5px'}}
                height={80}
                width={80}
                src={'https://scpic1.chinaz.net/Files/pic/pic9/202203/apic39782_s.jpg'}
                onContextMenu={() => {}}
                />
              </Dropdown>
            </div>
          })
        }
      </div>
    </div>
  </div>
}

const VideoMessageList = () => {
  return <div className="video_message_list">
    <div className="week">
      <span>本周</span>
      <div className="content">
        {
          new Array(6).fill(null).map((item, index) => {
            return <div className="item" key={index}>
              <AntdImage
              preview={false}
              style={{borderRadius: '5px'}}
              height={80}
              width={80}
              src={'https://scpic1.chinaz.net/Files/pic/pic9/202203/apic39782_s.jpg'}
              onContextMenu={() => {}}
              />
              <div className="title">
                <span></span>
                <span>5:20</span>
              </div>
            </div>
          })
        }
      </div>
    </div>
    <div className="month">
    <span>本月</span>
      <div className="content">
        {
          new Array(16).fill(null).map((item, index) => {
            return <div className="item" key={index}>
              <AntdImage
              preview={false}
              style={{borderRadius: '5px'}}
              height={80}
              width={80}
              src={'https://scpic1.chinaz.net/Files/pic/pic9/202203/apic39782_s.jpg'}
              onContextMenu={() => {}}
              />
              <div className="title">
                <span></span>
                <span>5:20</span>
              </div>
            </div>
          })
        }
      </div>
    </div>
  </div>
}

const downloadFile = () => {
  console.log("下载文件")
}

const FileMessageList = () => {
  return <div className="file_message_list">
     <ul className="content_list">
        {
          new Array(16).fill(null).map((item, index) => {
            return  <li key={index}>
              <div className="box">
                <img src={file_zip} alt="" style={{width: '38px',height:'44px'}}/>
                <div className="info">
                  <div className="title">
                    <span>文件.zip</span>
                  </div>
                  <div className="content">
                    <span>10KB&nbsp;&nbsp;</span>
                    <span>发送者&nbsp;&nbsp;5:20</span>
                  </div>
                </div>
              </div>
              <span className="download" onClick={() => downloadFile()}></span>
            </li>
          })
        }
      </ul>
  </div>
}