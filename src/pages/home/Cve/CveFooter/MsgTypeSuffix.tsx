import { CrownOutlined, PlusCircleOutlined, PlusOutlined, ScissorOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message,Image as AntdImage } from "antd";
import { FC, forwardRef, useImperativeHandle, useState } from "react";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { getPicInfo, getVideoInfo, im, switchUpload } from "../../../../utils";
import Upload, { RcFile } from "antd/lib/upload";
import { PICMESSAGETHUMOPTION } from "../../../../config";
import { faceMap } from "../../../../constants/faceType";
import { messageTypes } from "../../../../constants/messageContentType";
import send_id_card from "@/assets/images/send_id_card.png";
import send_pic from "@/assets/images/send_pic.png";
import send_video from "@/assets/images/send_video.png";
import send_file from "@/assets/images/send_file.png";
import { useTranslation } from "react-i18next";
import { CustomEmojiType, FaceType } from "../../../../@types/open_im";
import styles from "../../../../components/SearchBar/index.module.less";
import { minioUploadType } from "../../../../api/admin";

type MsgTypeSuffixProps = {
    choseCard:()=>void
    faceClick:(face:typeof faceMap[0] | CustomEmojiType, type: FaceType)=>void;
    sendMsg: (nMsg: string, type: messageTypes) => void;
}

const MsgTypeSuffix:FC<MsgTypeSuffixProps> = ({choseCard,faceClick,sendMsg},ref) => {
  const { t } = useTranslation();

  const [expressionStyle, setExpressionStyle] = useState(1) // 1--显示表情符号 2--显示表情包
  const [visibleValue, setVisibleValue] = useState(false)
  const [emojiMap, setEmojiMap] = useState<CustomEmojiType[]>([])
  const [getEmojiIndex, setGetEmojiIndex] = useState<number>()

  const imgMsg = async (file: RcFile, url: string) => {
    const { width, height } = await getPicInfo(file);
    const sourcePicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width,
      height,
      url,
    };
    const snapshotPicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width: 200,
      height: 200,
      url: url + PICMESSAGETHUMOPTION,
    };
    const imgInfo = {
      sourcePicture,
      snapshotPicture,
      bigPicture: sourcePicture,
    };
    const { data } = await im.createImageMessage(imgInfo);
    sendMsg(data, messageTypes.PICTUREMESSAGE);
  };

  const videoMsg = async (file: RcFile, url: string) => {
    const snp = "https://echat-1302656840.cos.ap-chengdu.myqcloud.com/rc-upload-1638518718431-15video_cover.png?imageView2/1/w/200/h/200/rq/80";
    const duration = await getVideoInfo(file);
    const videoInfo = {
      videoPath: url,
      duration,
      videoType: file.type,
      snapshotPath: snp,
      videoUUID: file.uid,
      videoUrl: url,
      videoSize: file.size,
      snapshotUUID: file.uid,
      snapshotSize: 117882,
      snapshotUrl: snp,
      snapshotWidth: 1024,
      snapshotHeight: 1024,
    };
    const { data } = await im.createVideoMessage(videoInfo);
    sendMsg(data, messageTypes.VIDEOMESSAGE);
  };

  const fileMsg = async (file: RcFile, url: string) => {
    const fileInfo = {
      filePath: url,
      fileName: file.name,
      uuid: file.uid,
      sourceUrl: url,
      fileSize: file.size
    }
    const { data } = await im.createFileMessage(fileInfo)
    sendMsg(data, messageTypes.FILEMESSAGE);
  }


  const sendCosMsg = async (uploadData: UploadRequestOption, type: string) => {
    switchUpload(uploadData,type==="pic"?minioUploadType.picture:minioUploadType.file)
      .then((res) => {
        switch (type) {
          case "pic":
            imgMsg(uploadData.file as RcFile, res.data.URL);
            break;
          case "video":
            videoMsg(uploadData.file as RcFile, res.data.URL);
            break;
          case "file":
            fileMsg(uploadData.file as RcFile, res.data.URL);
            break;
          default:
            break;
        }
      })
      .catch((err) => message.error(t("UploadFailed")));
  };

  const changeEmojiStyle = (style: any) => {
    switch (style) {
      case 1:
        setExpressionStyle(1)
        setVisibleValue(true)
        break;
      default:
        setExpressionStyle(2)
        setVisibleValue(true)
        const emojiStorage = JSON.parse(localStorage.getItem('userEmoji')!) // 获取本地表情包
        const userId = JSON.parse(localStorage.getItem('lastimuid')!) // 获取当前用户ID
        // 获取当前用户的表情包
        const emojis = emojiStorage.filter((item: any) => {
          return item.userID === String(userId)
        })
        setEmojiMap(emojis[0].emoji)
        break;
    }
  }

  const handleVisibleChange = (flag: any) => {
    setVisibleValue(flag)
    if (flag) {
      setExpressionStyle(1)
    }
  }

  const deleteFace = () => {
    const emojiStorage = JSON.parse(localStorage.getItem('userEmoji')!) // 获取本地表情包
    const userId = JSON.parse(localStorage.getItem('lastimuid')!) // 获取当前用户ID
    // 获取当前用户的表情包
    const emojis = emojiStorage.filter((item: any) => {
      return item.userID === String(userId)
    })
    const otherUserEmoji = emojiStorage.filter((item: any) => {
      return item.userID !== String(userId)
    })
    const newFace = emojis[0].emoji.filter((item: any, index: number) => {
      return index !== getEmojiIndex
    })
    const allUserEmoji = [
      {
        userID: String(userId),
        emoji: newFace
      },
      ...otherUserEmoji
    ]
    localStorage.setItem('userEmoji', JSON.stringify(allUserEmoji))
    setEmojiMap(newFace)
  }

  const uploadIcon = async (uploadData: UploadRequestOption) => {
    switchUpload(uploadData)
      .then( async(res) => {
        const {width, height} = await getPicInfo(uploadData.file as RcFile)
        const userEmoji = JSON.parse(localStorage.getItem('userEmoji')!)
        const userId = JSON.parse(localStorage.getItem('lastimuid')!)
        const emojiObj = userEmoji.filter((item: any) => {
          return item.userID === String(userId)
        })
        const otherUserEmoji = userEmoji.filter((item: any) => {
          return item.userID !== String(userId)
        })
        // console.log(emojiObj)
        emojiObj[0].emoji = [
          {
            url: res.data.URL,
            width,
            height
          },
          ...emojiObj[0].emoji
        ]
        const allUserEmoji = [
          {
            userID: String(userId),
            emoji: emojiObj[0].emoji
          },
          ...otherUserEmoji
        ]
        localStorage.setItem('userEmoji', JSON.stringify(allUserEmoji))
      })
      .catch((err) => message.error(t("UploadFailed")));
  };

  
  const menus = [
    {
      title: t("SendCard"),
      icon: send_id_card,
      method: choseCard,
      type: "card",
    },
    {
      title: t("SendFile"),
      icon: send_file,
      method: sendCosMsg,
      type: "file",
    },
    {
      title: t("SendVideo"),
      icon: send_video,
      method: sendCosMsg,
      type: "video",
    },
    {
      title: t("SendPicture"),
      icon: send_pic,
      method: sendCosMsg,
      type: "pic",
    },
  ];

  const faceMenu = () => (
    <Menu className={styles.btn_menu}>
      <Menu.Item key="1" onClick={() => deleteFace()}>{t('Delete')}</Menu.Item>
    </Menu>
  )

  useImperativeHandle(ref,()=>({
    sendImageMsg:imgMsg
  }))

  const FaceType = () => (
    <div style={{ boxShadow: "0px 4px 25px rgb(0 0 0 / 16%)" }} className="face_container">
      {
        expressionStyle === 1
        ? <div className="face_container_emoji">
            {faceMap.map((face) => (
              <div key={face.context} onClick={() => faceClick(face,'emoji')} className="face_item">
                <AntdImage preview={false} width={24} src={face.src} />
              </div>
            ))}
          </div>
        : <div className="face_container_emoji">
          <Upload accept="image/*" action={""} customRequest={(data) => uploadIcon(data)} showUploadList={false}>
            <span className="upload">
              <div>
                <PlusOutlined style={{fontSize: '35px'}} />
              </div>
            </span>
          </Upload>
          {emojiMap?.map((face, index) => (
              <div key={index} className="emoji_item">
                  <Dropdown
                  overlay={faceMenu}
                  trigger={['contextMenu']}
                  placement='bottom'
                  >
                    <AntdImage
                    preview={false}
                    style={{borderRadius: '5px'}}
                    height={50}
                    width={50}
                    src={face.url}
                    onClick={() => faceClick(face,'customEmoji')}
                    onContextMenu={() => setGetEmojiIndex(index)}
                    />
                  </Dropdown>
              </div>
            ))}
          </div>
      }
      
      <hr style={{margin: 0,opacity: '.3'}}></hr>
      <div className="expression_style">
        <span
        style={expressionStyle === 1 ? { backgroundColor: 'rgb(229 231 235)'} : { backgroundColor: ''}}
        onClick={() => changeEmojiStyle(1)}
        ><SmileOutlined style={{fontSize: '16px',color: '#428BE5'}} /></span>
        <span
        style={expressionStyle !== 1 ? { backgroundColor: 'rgb(229 231 235)'} : { backgroundColor: ''}}
        onClick={() => changeEmojiStyle(2)}
        ><CrownOutlined style={{fontSize: '16px',color: '#428BE5'}} /></span>
      </div>
    </div>
  );

  const switchType = (type:string) => {
    switch (type) {
      case "pic":
        return "image/*"
      case "video":
        return "video/*"
      case "file":
        return "*"
      default:
        break;
    }
  }

  const MsgType = () => (
    <Menu className="input_menu">
      {menus.map((m: any) => {
        if (m.type === "card") {
          return (
            <Menu.Item key={m.title} onClick={m.method} icon={<img src={m.icon} />}>
              {m.title}
            </Menu.Item>
          );
        } else {
          return (
            <Menu.Item key={m.title} icon={<img src={m.icon} />}>
              <Upload
                accept={switchType(m.type)}
                key={m.title}
                action={""}
                customRequest={(data) => m.method(data, m.type)}
                showUploadList={false}
              >
                {m.title}
              </Upload>
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );

  const shotScreen = () => window.electron?.screenshot()

  return (
    <div className="suffix_container">
      {window.electron&&<ScissorOutlined onClick={shotScreen} />}
      <Dropdown
      visible={visibleValue}
      onVisibleChange={handleVisibleChange}
      overlayClassName="face_type_drop"
      overlay={FaceType}
      placement="topRight"
      arrow
      trigger={['click']}
      >
        {/* <Tooltip title="表情"> */}
        <SmileOutlined style={{ margin: "0 8px" }} />
        {/* </Tooltip> */}
      </Dropdown>

      <Dropdown overlayClassName="msg_type_drop" overlay={MsgType} placement="top" arrow>
        <PlusCircleOutlined />
      </Dropdown>
    </div>
  );
};

// @ts-ignore
export default forwardRef(MsgTypeSuffix);
