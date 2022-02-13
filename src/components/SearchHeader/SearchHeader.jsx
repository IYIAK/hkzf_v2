import React from 'react';
import { useNavigate } from "react-router-dom";

import "./SearchHeader.scss"

export default function SearchHeader({ cityName }) {

    const navigate = useNavigate()

    return <div className='search-box'>
        <div className='search'>
            {/* 城市选择 */}
            <div className='location' onClick={() => { navigate('/citylist') }}>
                <span className='cityname'>{cityName}</span>
                <i className="iconfont icon-arrow"></i>
            </div>

            {/* 搜索 */}
            <div className="form" onClick={() => { navigate('/search') }}>
                <i className="iconfont icon-search"></i>
                <span className='text'>请输入小区或地址</span>
            </div>
        </div>

        {/* 地图选房 */}
        <i className='iconfont icon-map' onClick={() => { navigate('/map') }} />
    </div>;
}
