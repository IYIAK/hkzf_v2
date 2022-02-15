import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Toast } from 'antd-mobile';
import NavHeader from "../../components/NavHeader/NavHeader";
import { getCurrentCity, API } from '../../utils'

import './CityList.scss'
import { useNavigate } from 'react-router-dom';

const HOUSE_CITY = ['北京', '上海', '广州', '深圳']


export default function CityList() {

    const [cityList, setCityList] = useState({})
    const [cityIndex, setCityIndex] = useState([])
    const [isDataOK, setIsDataOK] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    //useRef绑定的元素要用ListComp.current调用
    const ListComp = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        getData()
    }, [])

    //获取并处理数据
    async function getData() {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })

        const allres = await API.get('/area/city?level=1')
        const hotres = await API.get('/area/hot')
        // console.log('all', allres.data.body);
        // console.log('hot', hotres.data.body);

        // 将城市按首字母存放
        let list = {}
        for (let city of allres.data.body) {
            let first = city.short.substr(0, 1)
            if (list[first]) {
                list[first].push(city)
            } else {
                list[first] = [city]
            }
        }
        let index = Object.keys(list).sort()

        //处理热门城市
        list['热'] = hotres.data.body
        index.unshift('热')

        //处理当前城市
        const cur = await getCurrentCity()
        // console.log(cur);
        list['#'] = [cur]
        index.unshift('#')

        //要注意这里必须重新生成一个对象和数组，否则只是将引用作为state
        setCityList({ ...list })
        setCityIndex([...index])
        setIsDataOK(true)

        Toast.clear()
    }

    function formatIndex(name) {
        if (name === '#') return '当前城市'
        if (name === '热') return '热门城市'
        return name.toUpperCase()
    }

    //生成每个首字母的城市列表，作为List的item
    function renderItem(index, style) {
        // console.log(cityIndex[index]);
        return (
            <div className='item' style={style}>
                <div className="title">{formatIndex(cityIndex[index])}</div>
                {cityList[cityIndex[index]].map((val, ind) => (
                    <div className="name" key={ind} onClick={() => {
                        // console.log(val);
                        changeCity(val)
                    }}>
                        {val.label}
                    </div>
                ))}
            </div>
        )
    }


    //点击城市名的事件处理
    function changeCity({ label, value }) {
        // console.log(label);
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))  //存入本地缓存
            navigate(-1)  //回到上一页
        } else {
            Toast.show('该城市暂无房源数据', 1, null, false)  //轻提示组件
        }
    }

    //生成右侧的索引
    function renderIndex() {
        return cityIndex.map((val, index) => {
            return (
                <li className="city-index-item" key={index}
                    onClick={() => {
                        // console.log("index", index)
                        // console.log(ListComp);
                        ListComp.current.scrollToItem(index, 'start') //调用了list的滚动到指定行的方法
                    }}>
                    <span className={activeIndex === index ? "index-active" : ""} key={val}>{val.toUpperCase()}</span>
                </li >
            )
        })
    }

    //用于设置当前高亮的索引
    var onItemsRendered = ({ visibleStartIndex }) => {
        //组件自带的属性方法，visibleStartIndex就是当前可视区域最上面item的index
        setActiveIndex(visibleStartIndex)
    }


    return <div className='citylist'>
        <NavHeader>城市选择</NavHeader>
        <AutoSizer>
            {isDataOK ? ({ height, width }) => (
                <List
                    className='List'
                    height={height}
                    width={width}
                    itemSize={(index) => {
                        return cityList[cityIndex[index]].length * 36 + 40
                    }}
                    itemCount={cityIndex.length}
                    ref={ListComp}
                    onItemsRendered={onItemsRendered}>
                    {
                        ({ index, style }) => (
                            renderItem(index, style)
                        )
                    }
                </List>
            ) : () => { }}
        </AutoSizer>


        <ul className="city-index">
            {renderIndex()}
        </ul>
    </div>;
}
