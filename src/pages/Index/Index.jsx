import React from 'react';
import './Index.scss'

export default function index() {
    return <div className='Index'>
        <Search></Search>
    </div>;
}

function Search() {


    return (
        <div className='search-bar'>
            <div className='city'>
                <p className="cityname">上海</p>
                <i className="arrow"></i>
            </div>
            <input type="text" name="" className='search-text' />
        </div>
    )
}