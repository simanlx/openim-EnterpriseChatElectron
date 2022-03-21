import { EllipsisOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, shallowEqual } from "react-redux";
import { MyAvatar } from "../../../../../components/MyAvatar";
import { RootState } from "../../../../../store";
import { CLOSERIGHTDRAWER } from "../../../../../constants/events";
import { events, im } from "../../../../../utils";
import { PublicUserItem } from "../../../../../utils/open_im_sdk/types";

export const GroupNotice = () => {
  const { t } = useTranslation();
  const groupInfo = useSelector((state: RootState) => state.contacts.groupInfo, shallowEqual);
  const [ownerInfo, setOwnerInfo] = useState<PublicUserItem>();
  const [isEdit, setIsEdit] = useState(false) // 是否要编辑
  const [textValue, setTextValue] = useState('') // 文本域的内容


  useEffect(() => {
    if (groupInfo) {
      im.getUsersInfo([groupInfo.ownerUserID]).then((res) => {
        setOwnerInfo(JSON.parse(res.data).length > 0 ? JSON.parse(res.data)[0].publicInfo : {});
      });
    }
  }, [groupInfo]);

  const handleEdit = () => {
    setIsEdit(true)
  }

  const handleTextValue = (value: any) => {
    setTextValue(value.target.value)
  }

  const sendNotice = () => {
    console.log(textValue)
    events.emit(CLOSERIGHTDRAWER)
    message.success(t("ReleaseSuccess"))
  }

  return (
    <div className="group_notice">
      {
        isEdit
        ? <>
            <textarea className="text" name="" id="" placeholder={t("PleaseInputNotice")} onChange={handleTextValue}></textarea>
            <div className="btnBox">
              {
                textValue === ''
                ? <Button style={{backgroundColor: '#999999',borderColor: '#999999'}} onClick={() => message.warning(t("PleaseInput"))} type="primary" className="btn">
                    {t("Release")}
                  </Button>
                : <Button onClick={sendNotice} type="primary" className="btn">
                    {t("Release")}
                  </Button>
              }
            </div>
          </> 
        
        : <>
            <div>
              sbfeshakfhukefhsukfhehahsdfauihsefohsafhasoihefoiasfohoasihfoeihfaoishdf
              bfeshakfhukefhsukfhehahsdfauihsefohsafhasoihefoiasfohoasihfoeihfaoishdf
            </div>
            <div className="btnBox">
              <Button onClick={handleEdit} type="primary" className="btn">
                {t("Edit")}
              </Button>
            </div>
          </>
      }
      
    </div>
  );
};
