import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { Map } from 'react-bmapgl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
// import ZoomControl from 'react-bmapgl/Control/ZoomControl';
// import Circle from 'react-bmapgl/Overlay/Circle';
import Label from 'react-bmapgl/Overlay/Label'

import { Toast } from "antd-mobile";

import NavHeader from "../../components/NavHeader/NavHeader";
import HouseItem from '../../components/HouseItem/HouseItem'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

import './Map.scss'


export default function MapSelect() {

    const [isDataOK, setIsDataOK] = useState(false)
    const [data, setData] = useState([])
    const [zoom, setZoom] = useState(11)
    const [houseList, setHouseList] = useState([])
    const [isHouseListOK, setIsHouseListOK] = useState(false)

    const mapRef = useRef()

    useEffect(() => {
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        getData(value)
        const myGeo = new window.BMapGL.Geocoder();

        // 将地图定位到对应城市
        // 使用百度地图的地址解析功能，地址必须带‘市’字
        myGeo.getPoint(label + '市', (point) => {
            if (point) {
                // console.log(point);
                //实测，mapRef.current.map才是真正的map对象
                mapRef.current.map.centerAndZoom(point, 11);
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        })

        return () => {
            Toast.clear()
        }
    }, [])

    //获取数据
    async function getData(id) {
        try {

            setIsDataOK(false)
            // 不自动消失需要设置duration
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0
            })

            const res = await API.get(`/area/map?id=${id}`)
            // console.log(res);

            setData(res.data.body)
            setIsDataOK(true)
            Toast.clear()


        } catch (e) {
            console.log(e);
            Toast.clear()
        }
    }


    // 创建覆盖物
    function createOverlays(data) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建坐标对象
        // const areaPoint = new BMapGL.Point(longitude, latitude)

        if (zoom < 14) {
            // 区或镇
            // this.createCircle(areaPoint, areaName, count, value)
            return (
                <Label
                    position={{ lng: longitude, lat: latitude }}
                    text={`
                        <p class='name'>${areaName}</p>
                        <p>${count}套</p>
                    `}
                    key={value}
                    style={{
                        width: '70px',
                        height: '70px',
                        lineHeight: 1,
                        display: 'inline-block',
                        position: 'absolute',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(12,181,106,.9)',
                        color: '#fff',
                        border: '2px solid rgba(255,255,255,.8)',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={(e) => {
                        // 只有这里能拿到map实例，从而获得zoom
                        // console.log(e.currentTarget.map);
                        e.currentTarget.map.centerAndZoom({ lng: longitude, lat: latitude }, e.currentTarget.map.getZoom() + 2)
                        e.currentTarget.map.clearOverlays()
                        setZoom(e.currentTarget.map.getZoom() + 2)
                        getData(value)
                    }}
                ></Label>
            )

        } else {
            // this.createRect(areaPoint, areaName, count, value)
            //小区覆盖物
            return (
                <Label
                    position={{ lng: longitude, lat: latitude }}
                    text={`
                <div class='rect'>
                    <span class='houseName'>${areaName}</span>
                    <span class='houseNum'>${count}套</span>
                    <i class='arrow'></i>
                </div>
                `}
                    key={value}
                    style={{
                        cursor: 'pointer',
                        border: '0px solid rgba(255,0,0)',
                        padding: '0px',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                        color: 'rgb(255,255,255)',
                        textAlign: 'center'
                    }}
                    onClick={(e) => {
                        getHouseList(value)

                        //将小区移动到地图上半部分中央
                        const target = e.domEvent.changedTouches[0]
                        e.currentTarget.map.panBy(
                            window.innerWidth / 2 - target.clientX,
                            (window.innerHeight - 330) / 2 - target.clientY
                        )

                    }}
                ></Label>
            )
        }
    }


    //获取小区房源数据
    async function getHouseList(value) {
        try {
            setIsHouseListOK(false)
            Toast.show({
                icon: 'loading',
                content: '加载中…',
                duration: 0
            })
            const res = await API.get(`/houses?cityId=${value}`)
            setHouseList(res.data.body.list)
            console.log('res', res);
            Toast.clear()
            setIsHouseListOK(true)


        } catch (e) {
            Toast.clear()
        }
    }

    function renderHouseList() {
        return houseList.map(item => (
            <HouseItem
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        ))
    }


    return (
        <div className='map'>
            <NavHeader>地图选房</NavHeader>
            {/* 这里用的是封装好的react地图组件，但是设计的太诡异了，组件最外层竟然是一个不能设置类名的div，但是style属性就可以修改这个div的css  */}
            <Map
                style={{ height: '100%' }}
                enableDragging
                center={{ lng: 116.402544, lat: 39.928216 }}
                zoom="11"
                ref={mapRef}>
                {/* 比例尺和缩放控件需要单独引入并写为子组件 */}
                <ScaleControl />
                {/* <ZoomControl /> */}

                {isDataOK ? data.map(item => {
                    // 创建覆盖物，data更新后会自动重新渲染
                    return createOverlays(item)
                }) : ''}
            </Map>

            {/* 默认状态是藏在屏幕下侧的，class中添加show就升上来，实现动画效果 */}
            <div className={`houseList ${isHouseListOK ? 'show' : ''}`}>
                <div className='titleWrap'>
                    <h1 className='listTitle'>房屋列表</h1>
                    <Link className='titleMore' to="/home/list">
                        更多房源
                    </Link>
                </div>

                <div className='houseItems'>
                    {/* 房屋结构 */}
                    {isHouseListOK ? renderHouseList() : ''}
                </div>
            </div>
        </div>
    );
}
