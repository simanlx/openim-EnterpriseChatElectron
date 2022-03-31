import { RightOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import React, { FC, useEffect, useState } from 'react'
import { getDeptList, getDeptUserList, getUserInfo } from '../../../api/world_window';
import { MyAvatar } from '../../../components/MyAvatar';

type DepartmentListProps = {
  children: DepartmentListProps[];
  id: string;
  label: string;
}

type DepartmentItemPorps = {
  department: DepartmentListProps;
  navigationList: any
}

type MemberListProps = {
  deptId: string;
  name: string;
  type: string;
  userId: string;
  username: string;
}

const DepartmentItem: FC<DepartmentItemPorps> = ({department, navigationList}) => {
  
  const [memberList, setMemberList] = useState<MemberListProps[]>([])
  const [hasChildren, setHasChildren] = useState<boolean>(false)
  const [childrenList, setChildrenList] = useState<DepartmentListProps[]>([])

  useEffect(() => {
    if (department.children.length === 0) {
      setHasChildren(false)
      console.log(0)
    } else {
      setHasChildren(true)
      setChildrenList(department.children)
      console.log(1)
    }
    getDeptUserList(department.id)
    .then(data => {
      console.log(data)
    })
    getUserInfo('707008165')
    .then(data => {
      console.log(data)
    })
  },[])

  // const ChilDepartment = () => (
  //   <div className="organizational_item_content">
  //     <ul className="department">
  //       {
  //         department.children?.map((item: any, index) => {
  //           return (
  //             <li key={index} onClick={() => departmentItem(item.id, item.children, item.label)}>
  //               <div className='left_box'>
  //                 <span className='department_logo'></span>
  //                 <span className='department_name'>{item.label}</span>
  //               </div>
  //               <RightOutlined />
  //             </li>
  //           )
  //         })
  //       }
  //     </ul>
  //   </div>
  // )

  const handleDepartment = (id: string, label: string) => {
    navigationList({
      id,
      label
    })
  }

  return <>
    {
      hasChildren
      ? <div className="organizational_item_content">
          <ul className="department">
            {
              childrenList?.map((item: any, index) => {
                return (
                  <li key={index} onClick={() => handleDepartment(item.id, item.label)}>
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
        </div>
      : memberList.length === 0
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'没有组织人员'}/>
        : <div className='departmentItem'>
          <ul className="departmentItem_memberList">
            {
              memberList.map((item, index) => {
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
  </>
}

export default DepartmentItem