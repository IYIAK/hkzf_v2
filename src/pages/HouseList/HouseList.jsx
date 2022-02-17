import React, { useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader'
import { Toast } from 'antd-mobile';
import { getCurrentCity, API, BASE_URL } from '../../utils';
import { useNavigate } from 'react-router-dom';
import HouseItem from '../../components/HouseItem/HouseItem'
import SearchHeader from '../../components/SearchHeader/SearchHeader'

import Filter from './Filter/Filter'
import './HouseList.scss'


export default function HouseList() {

    const [isDataOK, setIsDataOK] = useState(false)
    const [list, setList] = useState([])
    const [city, setCity] = useState()
    const [filters, setFilters] = useState(null)
    const [hasMoreData, setHasMoreData] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        getListFirst()

        return () => {
            Toast.clear()
        }
    }, [])


    //首次获取数据(获取城市也一起，都是异步操作，最好写在一起，否则执行顺序不可控)
    async function getListFirst() {

        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })

        setIsDataOK(false)
        setHasMoreData(true)

        var { value } = await getCurrentCity()
        setCity(value)

        const res = await API.get('/houses', {
            params: {
                cityId: value,
                start: 1,
                end: 100
            }
        })
        console.log(res);
        setList([...res.data.body.list])
        if (res.data.body.count < 100) {
            setHasMoreData(false)
        }
        setIsDataOK(true)

        Toast.clear()
    }

    async function getList(newfilters) {

        console.log({ ...filters, ...newfilters });

        //修改state是异步操作，因此不能直接获取filters，
        //这里可以修改filters但只当作记录，下次就能知道先前的filters了，请求就自己手动再拼一次数据
        setFilters({ ...filters, ...newfilters })
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0
        })

        setIsDataOK(false)
        setHasMoreData(true)

        const res = await API.get('/houses', {
            params: {
                cityId: city,
                ...{ ...filters, ...newfilters },
                start: 1,
                end: 100
            }
        })
        console.log(res);
        setList([...res.data.body.list])
        if (res.data.body.count < 100) {
            setHasMoreData(false)
        }
        setIsDataOK(true)

        Toast.clear()
    }

    function isRowLoaded(index) {
        // console.log(index);
        return !!list[index];
    }

    //每次加载100行
    function loadMoreRows() {
        console.log('more', list.length + 1, list.length + 50);

        return API.get('/houses', {
            params: {
                cityId: city,
                ...filters,
                start: list.length + 1,
                end: list.length + 100
            }
        }).then(response => {
            // Store response data in list...
            // console.log(response);
            //每次更新list后列表都会闪一下，感觉是虚拟dom没生效，搞不懂为什么
            setList([...list, ...response.data.body.list])
            if (response.data.body.count < 100) {
                setHasMoreData(false)
            }
        })
    }

    function rowRenderer({ index, style }) {
        // console.log(list);
        let house = list[index]
        return (house !== undefined ?
            <HouseItem
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
                onClick={() => { navigate(`/detail/${house.houseCode}`) }} />
            : <div style={style} className="loading">loading...</div>
        )
    }

    return <div className='houselist'>
        <SearchHeader></SearchHeader>

        <Filter getHouseList={getList} filters={filters} isDataOK={isDataOK}></Filter>

        <AutoSizer>

            {isDataOK ?
                ({ height, width }) => (
                    <InfiniteLoader
                        isItemLoaded={isRowLoaded}
                        itemCount={hasMoreData ? list.length + 1 : list.length}
                        loadMoreItems={loadMoreRows}
                    >
                        {({ onItemsRendered, ref }) => (
                            <List
                                className="List"
                                height={height}
                                itemCount={hasMoreData ? list.length + 1 : list.length}
                                itemSize={120}
                                onItemsRendered={onItemsRendered}
                                ref={ref}
                                width={width}
                            >
                                {rowRenderer}
                            </List>
                        )}
                    </InfiniteLoader>)
                : () => { }}
        </AutoSizer>
    </div>;

}
