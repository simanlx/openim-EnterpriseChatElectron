import { RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Empty, message, Tag } from 'antd'
import { t } from 'i18next'
import { type } from 'os'
import React, { FC, useEffect, useState } from 'react'
import { getDeptList, getDeptUserList, getUserInfo } from '../../../api/world_window'
import { MyAvatar } from '../../../components/MyAvatar'
import DepartmentItem from './DepartmentItem'

type OrganizationalProps = {
  selfDepartment:string;
}

type DepartmentListProps = {
  children: DepartmentListProps[];
  id: string;
  label: string;
}

type NaviItemProps = {
  id: string;
  label: string;
}

type MemberListProps = {
  userId: string;
  name: string;
  type: string;
  username: string;
  deptId: string;
}

const Organizational :FC<OrganizationalProps> = ({selfDepartment}) => {
const [showNavigation, setShowNavigation] = useState<boolean>(false)
const [departmentList, setDepartmentList] = useState<DepartmentListProps[]>([])
const [initStorage, setInitStorage] = useState<DepartmentListProps[]>([])
const [memberList, setMemberList] = useState<MemberListProps[]>([])
const [department, setDepartment] = useState<DepartmentListProps>()
const [naviItem, setNaviItem] = useState<NaviItemProps[]>([])
  // const [showDepartmentItem, setShowDepartmentItem] = useState<boolean>(false)


  useEffect(() => {
    getDeptList()
    .then(data => {
      setInitStorage(data.data)
      setDepartmentList(data.data)
    })
    .catch(data => {
      message.error('Server error')
    })
    getDeptUserList('501228')
    .then(data => {
      console.log(data)
    })
  },[])

  useEffect(() => {
    if (selfDepartment === t('OrganizationalStructure')) {
      setShowNavigation(false)
    } else {
      setShowNavigation(true)
      // setDepartment(selfDepartment)
    }
  }, [selfDepartment])

  const findSingleDp = (id: string) => {
    getDeptList(id)
    .then(data => {
      const dataList = data.data
      setDepartmentList(dataList)
    })
    .catch(data => {
      message.error('Server error')
    })
  }

  const handleNavi = (id: string) => {
    findSingleDp(id)
    const naviIndex = naviItem.findIndex((item) => {
      return item.id === id
    })
    const newNavi = naviItem.slice(0,naviIndex + 1)
    setNaviItem(newNavi)
  }

  const departmentItem = (id: string, children: DepartmentListProps[], label: string) => {
    // setShowNavigation(true)
    // setDepartment('技术部'+ index)
    findSingleDp(id)
    getDeptUserList('501228')
    .then(data => {
      const dataList = data.data
      setMemberList(dataList)
    })
    .catch(data => {
      message.error('Server error')
    })
    setDepartment({
      id,
      children,
      label
    })
    setNaviItem([
      ...naviItem,
      {
        id,
        label
      }
    ])
  }

  const navigationList = ({id, label}: {id: string;label: string}) => {
    setNaviItem([
      ...naviItem,
      {
        id,
        label
      }
    ])
  }

  const handleMemberAva = () => {
    console.log('头像')
  }



  const initData = () => {
      // const data = await getDeptList()
      // setDepartmentList(data.data)
      setDepartmentList(initStorage) 
      setNaviItem([])
  }


  const DpChildren = () => (
    <ul className="department">
      {
        departmentList.map((item: any, index) => {
          return (
            <li key={index} onClick={() => departmentItem(item.id, item.children, item.label)}>
              <div className='left_box'>
                <span className='department_logo'></span>
                <span className='department_name'>{item.label}</span>
              </div>
              <RightOutlined />
            </li>
          )
        })
      }
    </ul>
  )

  const DpMember = () => (
    <ul className="organizational_memberList">
      {
        memberList.map((item, index) => {
          return (
            <li key={index} onDoubleClick={() => {}}>
              <div onClick={() => handleMemberAva()}>
                <MyAvatar src={''} size={38} />
              </div>
              <div className="info">
                <div className="title">
                  <span>{item.username}</span>
                  <span>创建人</span>
                </div>
                <span className="status">[手机在线]</span>
              </div>
            </li>
          )
        })
      }
    </ul>
  )

  return (
    <div className='organizational_item'>
      <div className='navigation'>
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={() => initData()}>托云信息技术有限公司</Breadcrumb.Item>
        {
          naviItem.map((item, index) => {
            return <Breadcrumb.Item key={index} onClick={() => handleNavi(item.id)}>{item.label}</Breadcrumb.Item>
          })
        }
      </Breadcrumb>
      </div>
      <div className="organizational_item_content">
        <DpChildren />
        {
          departmentList.length === 0
          ? <DpMember />
          : ''
          // : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'没有组织人员'}/>
        }
      </div>
    </div>
  )
}

export default Organizational