import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

import { Outlet } from 'react-router-dom';
import { TabBar } from 'antd-mobile'

import './Home.scss'

export default function Home() {

    const tabs = [
        {
            title: "首页",
            icon: "icon-ind",
            path: "/home"
        },
        {
            title: "找房",
            icon: "icon-findHouse",
            path: "/home/houselist"
        },
        {
            title: "资讯",
            icon: "icon-infom",
            path: "/home/news"
        },
        {
            title: "我的",
            icon: "icon-my",
            path: "/home/profile"
        }
    ]

    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location

    return <div className='home'>
        <Outlet />
        <TabBar
            activeKey={pathname}
            onChange={(value) => {
                console.log(value); //value就是点击的选项的key
                navigate(value)
            }}>
            {tabs.map(item => (
                <TabBar.Item
                    key={item.path}
                    icon={<i className={`iconfont ${item.icon}`}></i>}

                    title={item.title}
                />
            ))}
        </TabBar>
    </div>;
}

