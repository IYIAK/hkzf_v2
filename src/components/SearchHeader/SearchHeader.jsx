import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { getCurrentCity } from '../../utils'

import "./SearchHeader.scss"

export default function SearchHeader() {

    const navigate = useNavigate()
    const [city, setCity] = useState('北京')

    useEffect(() => {
        getCity()
    }, [])

    async function getCity() {
        var city = await getCurrentCity()
        setCity(city.label)
    }



    return <div className='search-box'>
        <div className='search'>
            {/* 城市选择 */}
            <div className='location' onClick={() => { navigate('/citylist') }}>
                <span className='cityname'>{city}</span>
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
