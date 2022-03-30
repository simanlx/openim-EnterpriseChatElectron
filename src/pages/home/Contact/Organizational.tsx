import { RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Tag } from 'antd'
import { t } from 'i18next'
import React, { FC, useEffect, useState } from 'react'
import { MyAvatar } from '../../../components/MyAvatar'
import DepartmentItem from './DepartmentItem'

type OrganizationalProps = {
  selfDepartment:string;
}

const Organizational :FC<OrganizationalProps> = ({selfDepartment}) => {
  const [showNavigation, setShowNavigation] = useState<boolean>(false)
  const [department, setDepartment] = useState<string>()
  // const [showDepartmentItem, setShowDepartmentItem] = useState<boolean>(false)

  useEffect(() => {
    if (selfDepartment === t('OrganizationalStructure')) {
      setShowNavigation(false)
    } else {
      setShowNavigation(true)
      setDepartment(selfDepartment)
    }
  }, [selfDepartment])

  const departmentItem = (index: number) => {
    setShowNavigation(true)
    setDepartment('技术部'+ index)
  }

  return (
    <div className='organizational_item'>
      <div className='navigation'>
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={() => setShowNavigation(false)}>托云信息技术有限公司</Breadcrumb.Item>
        {
          showNavigation
          ? <Breadcrumb.Item>{department}</Breadcrumb.Item>
          : null
        }
      </Breadcrumb>
      </div>
      {
        showNavigation
        ? <DepartmentItem department= {department} />
        : <div className="organizational_item_content">
          <ul className="department">
            {
              new Array(6).fill(null).map((item, index) => {
                return (
                  <li key={index} onClick={() => departmentItem(index)}>
                    <div className='left_box'>
                      <span className='department_logo'></span>
                      <span className='department_name'>{'技术部'+ index}</span>
                    </div>
                    <RightOutlined />
                  </li>
                )
              })
            }
          </ul>
          <ul className="organizational_memberList">
            {
              new Array(16).fill(null).map((item, index) => {
                return (
                  <li key={index}>
                    <MyAvatar src={''} size={38} />
                    <div className="info">
                      <div className="title">
                        <span>姓名</span>
                        <span>创建人</span>
                      </div>
                      <span className="status">[手机在线]</span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      }
    </div>
  )
}

export default Organizational