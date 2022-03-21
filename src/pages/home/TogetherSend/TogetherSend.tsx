import React, { useState } from 'react'
import { t } from 'i18next'
import TogetherSendDrawer from './TogetherSendDrawer'
import AddSendObjectModal from './AddSendObjectModal'


const TogetherSend = () => {
  const [isContent, setIsContent] = useState(1) // 0--没有内容，1--有内容
  const [drawerTitle,setDrawerTitle] = useState('') // 抽屉效果标题
  const [visible,setVisible] = useState(false) // 是否显示抽屉效果
  const [modalVisible, setModalVisible] = useState(false) // 是否显示提示框效果

  // 显示抽屉效果
  const showDrawer = (style:any) => {
    setVisible(true)
    switch (style) {
      case 'create':
        setDrawerTitle(t('CreateTogetherSend'))
        break;
      case 'again':
        setDrawerTitle(t('AgainTogetherSend'))
        break;
      default:
        setDrawerTitle(t('TogetherSendDetails'))
        break;
    }
  }

  const closeDrawer = (val:boolean) => {
    setVisible(val)
  }

  // 显示对话框
  const showModal = (val: boolean) => {
    setModalVisible(val)
  }

  const closeModal = (val: boolean) => {
    setModalVisible(val)
  }

  return (
    <div className='togetherSend'>
      {
        isContent
        ? <ul className='message'>
            {
              new Array(6).fill(null).map((item, index) => {
                return (
                  <li key={index}>
                    <div className="title">
                      <div className='text_box'>
                        {t('SendTo')}&nbsp;
                        <span>人名</span>
                        &nbsp;{t('Etc')}{2}{t('People')}
                        <span>标签1</span>
                        &nbsp;的两个标签
                      </div>
                    </div>
                    <div className="content">
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                      fsdfaseffjhfbkjashekfhaksjhfk 哈哈贾会计很快就散很快就啊哈和偶发和客户靠撒谎
                    </div>
                    <div className='footer'>
                      <div className="time">
                        <span>2022年3月15日</span>
                      </div>
                      <div className='operation'>
                        <span className='delete'></span>
                        <span className='details' onClick={() => showDrawer('details')}></span>
                        <span className='againSend' onClick={() => showDrawer('again')}>{t('AgainSend')}</span>
                      </div>
                    </div>
                  </li>
                )
              })
            }
            
          </ul>
        : <div className="null">
            <span></span>
            <span>{t('NoData')}</span>
          </div>
      }
      {/* 创建按钮 */}
      <div className='createBtn' onClick={() => showDrawer('create')}></div>
      {/* 抽屉效果 */}
      <TogetherSendDrawer
      props={{
        visible,
        title: drawerTitle,
        closeDrawer,
        showModal,
      }}
      />
      <AddSendObjectModal
        props={{
          modalVisible,
          closeModal,
        }}
      />
    </div>
  )
}

export default TogetherSend