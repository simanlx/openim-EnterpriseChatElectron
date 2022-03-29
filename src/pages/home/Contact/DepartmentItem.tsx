import React, { FC } from 'react'
import { MyAvatar } from '../../../components/MyAvatar';

type DepartmentItemPorps = {
  department:string | undefined;
}

const DepartmentItem: FC<DepartmentItemPorps> = ({department}) => {
  return (
    <div className='departmentItem'>
      <ul className="departmentItem_memberList">
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
  )
}

export default DepartmentItem