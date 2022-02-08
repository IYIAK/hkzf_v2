import React from 'react';
import Home from './pages/Home/Home';
import Index from "./pages/Index/Index";
import HouseList from "./pages/HouseList/HouseList";
import Profile from "./pages/Profile/Profile"
import News from './pages/News/News';
import CityList from "./pages/CityList/CityList";
import Map from './pages/Map/Map';


import { Route, Routes, Navigate } from 'react-router-dom';

import './App.css'


export default function App() {
  return <div>
    {/*使用了react-router v6新增的嵌套路由，将所有的路由都写在一起，更加简介明了*/}
    <Routes>
      <Route path='home' element={<Home />}>
        <Route index element={<Index />} />  {/*不写path写index表示默认子路由*/}
        <Route path='houselist' element={<HouseList />}></Route>
        <Route path='news' element={<News />}></Route>
        <Route path='profile' element={<Profile />}></Route>
      </Route>
      <Route path='map' element={<Map />}></Route>
      <Route path='citylist' element={<CityList />}></Route>
      <Route path="*" element={<Navigate to='home' />} /> {/* 任意不匹配上述路由的url都强制跳转至Home对应的路径 */}
    </Routes>

  </div>;
}
