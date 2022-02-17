import React, { useState, useEffect } from 'react'
import { CascadePickerView, Mask } from 'antd-mobile'
import { API, getCurrentCity } from "../../../utils";

import './Filter.scss'

// 条件筛选栏标题数组：
const titleList = [
    { title: '区域', type: 'area' },
    { title: '方式', type: 'mode' },
    { title: '租金', type: 'price' },
    { title: '筛选', type: 'more' }
]

export default function Filter({ getHouseList }) {


    const [filterData, setFilterData] = useState(null)
    const [titleSelected, setTitleSelected] = useState('')

    useEffect(() => {
        getFiltersData()
        //useEffect中的函数不能闭包外部的state
    }, [])



    // 封装获取所有筛选条件的方法
    async function getFiltersData() {
        // console.log(city);
        // 获取当前定位城市id
        var { value } = await getCurrentCity()
        const res = await API.get(`/houses/condition?id=${value}`)
        // console.log(res);
        setFilterData(res.data.body)
    }

    //处理点击标题栏
    function handleClickTitle(type) {
        setTitleSelected(type)
        console.log({ filterData, titleSelected });
    }

    //处理确定按钮
    function handleOK(val) {
        setTitleSelected('')
        if (titleSelected === 'area') {
            // console.log(val.length);
            for (let i = 3; i > 0; i--) {
                if (val[i] !== null && val[i] !== 'null') {

                    getHouseList({ area: val[i] })
                    return
                }
            }
            getHouseList({ area: null })
        }

        if (titleSelected === 'mode') {
            getHouseList({ rentType: val[0] })
            return
        }

        if (titleSelected === 'price') {
            getHouseList({ price: val[0] })
            return
        }


    }

    function handleCancle() {
        setTitleSelected('')
    }

    return (
        <div className='filter'>
            <FilterTitle titleSelected={titleSelected} handleClick={handleClickTitle}></FilterTitle>
            {titleSelected === '' ? '' : <>
                <FilterPicker filterData={filterData} titleSelected={titleSelected} handleOK={handleOK} handleCancle={handleCancle}></FilterPicker>
                <Mask visible={true} onMaskClick={handleCancle} style={{ '--z-index': 5 }} />
            </>}

        </div>
    )
}



function FilterTitle({ titleSelected, handleClick }) {


    return (
        <div className='title'>
            {titleList.map((val, index) => {
                return (
                    <div
                        key={index}
                        className={`title-item ${titleSelected === val.type ? 'selected' : ''}`}
                        onClick={() => { handleClick(val.type) }}>
                        <span>{val.title}</span>
                        <i className="iconfont icon-arrow" />
                    </div>
                )
            })}

        </div>
    )
}

function FilterPicker({ filterData, titleSelected, handleOK, handleCancle }) {

    const [selectedVal, setSelectVal] = useState()

    function formatFilterData() {
        let data = []
        let { area, subway, rentType, price } = filterData

        switch (titleSelected) {
            case 'area':
                // 获取到区域数据
                data = [area, subway]
                break
            case 'mode':
                data = rentType
                break
            case 'price':
                data = price
                break
            default:
                break
        }

        return data
    }

    return titleSelected ?
        <div className="picker">
            <CascadePickerView
                options={formatFilterData()}

                onChange={val => {
                    setSelectVal(val)
                    // console.log('onChange', val)
                }}></CascadePickerView>
            <div className="btns">
                <div className="cancel btn" onClick={handleCancle}>取消</div>
                <div className="ok btn" onClick={() => { handleOK(selectedVal) }}>确定</div>
            </div>
        </div>
        : ''

}