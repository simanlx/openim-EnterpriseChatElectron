import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Drawer, Empty, Input, Modal } from 'antd'
import { t } from 'i18next'
import React, { useState } from 'react'
import { MyAvatar } from '../../../components/MyAvatar'

const LabelList = () => {

  const [isData, setIsData] = useState(true) // 是否有标签数据
  const [drawerVisible, setDrawerVisible] = useState(false) // 是否显示抽屉效果
  const [modalVisible, setModalVisible] = useState(false) // 是否显示提示框效果

  // 关闭抽屉效果
  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  const searchUser = (val: any) => {
    console.log(val)
   }

  // 显示提示框
  const showModal = () => {
  setModalVisible(true)
  }

  // 关闭提示框
  const closeModal = () => {
    setModalVisible(false)
  }

  // 点击确定按钮
  const handleOk = () => {
    setModalVisible(false)
  }

  const GroupListItem = () => (
    <div className="group_item">
      <MyAvatar shape="square" size={36} src={''} icon={<UserOutlined />} />
      <div className="group_item_info">
        <div className="group_item_title">{'标签1'}</div>
        <div className="group_item_sub">{'急急急、四大皆空付款、是的即可返回'}</div>
      </div>
    </div>
  );

  return (
    <div className='labelList'>
      {
        isData
        ? <div className="group_bg">
            {new Array(6).fill(null).map(item => <GroupListItem /> )}
          </div>
        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("NoData")} />
      }
      {/* 新建按钮 */}
      <span className='create_label' onClick={() => setDrawerVisible(true)} >{t('CreateLabel')}</span>
      {/* 抽屉效果 */}
      <Drawer
      className="right_set_drawer togetherSendDrawer"
      width={360}
      // mask={false}
      maskClosable
      title={t('CreateLabel')}
      placement="right"
      onClose={closeDrawer}
      // closable={type === "set" || type === "search_message"}
      visible={drawerVisible}
      // getContainer={document.getElementById("chat_main")!}
      >
        <div className='createDrawerContent'>
          <span className="title">{t('LabelName')}</span>
          <input type="text" placeholder={t('PleaseEnterTheLabelName')}/>
          <span className="title">{t('LabelMember')}</span>
          <div className="addPeople" onClick={showModal}>
            <span className='tip'>{t('ClickAddMemberToLabel')}</span>
          </div>
          <span className="btn">{t('Confirm')}</span>
        </div>
      </Drawer>
      {/* 提示框效果 */}
      <Modal
      width="60%"
      className="group_modal"
      title={t('AddLabelMember')}
      visible={modalVisible}
      onCancel={closeModal}
      footer={null}
      centered>
        <div>
          <div className="group_info_item">
            <div className="select_box">
              <div className="select_box_left">
                <Input onChange={(e) => searchUser(e.target.value)} placeholder={t("SearchFriendGroup")} prefix={<SearchOutlined />} />
                {/* {rs.memberList && rs.memberList.length > 0 ? (
                  rs.memberList.map((m) => <LeftSelectItem key={m.userID} item={m} />)
                ) : rs.searchList.length > 0 ? (
                  //@ts-ignore
                  rs.searchList.map((s) => <LeftSelectItem key={s.uid ?? s.userId ?? s.groupID} item={s} />)
                ) : rs.searchText !== "" ? (
                  <Empty description={t("SearchEmpty")} />
                ) : type ? (
                  <LeftSelect />
                ) : (
                  <LeftMenu />
                )} */}
              </div>
              <div className="select_box_right">
                {/* <div className="select_box_right_title">{`${t("Selected")}：${rs.selectedList.length+t("People")}`}</div>
                {rs.selectedList.map((s) => (
                  <RightSelectItem key={(s as SelectFriendItem).userID || (s as SelectMemberItem).userID || (s as SelectGroupItem).groupID} item={s} />
                ))} */}
              </div>
            </div>
          </div>
          <div className="group_info_footer">
            <Button onClick={closeModal} >{t("Cancel")}</Button>
            <Button onClick={handleOk} type="primary">
              {t("Confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LabelList