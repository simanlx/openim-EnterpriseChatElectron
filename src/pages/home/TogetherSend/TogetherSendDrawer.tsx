import React from 'react'
import { Drawer, message } from "antd";
import { t } from 'i18next';
import CreateDrawerContent from './components/CreateDrawerContent';
import AgainDrawerContent from './components/AgainDrawerContent';
import DetailsDrawerContent from './components/DetailsDrawerContent';
const TogetherSendDrawer = (props: any) => {
  const switchContent = () => {
    switch (props.props.title) {
      case t('CreateTogetherSend'): 
        return  <CreateDrawerContent
          props={{
            showModal:props.props.showModal
          }}
        />
      case t('AgainTogetherSend'):
        return <AgainDrawerContent />
      default:
        return <DetailsDrawerContent />
    }
  }
  return (
    <Drawer
      className="right_set_drawer togetherSendDrawer"
      width={360}
      // mask={false}
      maskClosable
      title={props.props.title}
      placement="right"
      onClose={() => {
        props.props.closeDrawer(false)
      }}
      // closable={type === "set" || type === "search_message"}
      visible={props.props.visible}
      // getContainer={document.getElementById("chat_main")!}
    >
      {switchContent()}
    </Drawer>
  )
}

export default TogetherSendDrawer