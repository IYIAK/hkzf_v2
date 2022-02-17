import React, { useState, useEffect } from 'react';

import SearchHeader from '../../components/SearchHeader/SearchHeader';
import { API } from "../../utils";
import { BASE_URL } from "../../utils/url";

import { Swiper, Grid, List } from 'antd-mobile'



// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './Index.scss'
import { useNavigate } from 'react-router-dom';

export default function Index() {

    return <div className='Index'>
        <SearchHeader></SearchHeader>
        <MySwiper></MySwiper>
        <Nav></Nav>
        <Group></Group>
        <News></News>
    </div>;
}

// 轮播图
function MySwiper() {

    const [swiper, setSwiper] = useState([])
    const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)


    var getSwiper = async () => {
        // console.log(123);
        const res = await API.get('/home/swiper')
        // console.log(res)
        //  this.setState({ swiper: res.data.body, isSwiperLoaded: true })
        setSwiper(res.data.body)
        setIsSwiperLoaded(true)
    }

    const items = swiper.map((val, i) => (
        <Swiper.Item key={i}>
            <a
                key={val.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={BASE_URL + val.imgSrc}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        </Swiper.Item>
    ))



    useEffect(() => {
        getSwiper()

    }, [])

    return (<>
        {/* 图片没有加载出来时防止布局错乱，添加一个空的div */}
        {isSwiperLoaded ?
            <Swiper autoplay loop>{items}</Swiper>
            : <div style={{ width: '100%', height: 212 }} />}

    </>


    )
}

function Nav() {

    // 导航菜单数据
    const navs = [
        {
            id: 1,
            img: Nav1,
            title: '整租',
            path: '/home/list'
        },
        {
            id: 2,
            img: Nav2,
            title: '合租',
            path: '/home/list'
        },
        {
            id: 3,
            img: Nav3,
            title: '地图找房',
            path: '/map'
        },
        {
            id: 4,
            img: Nav4,
            title: '去出租',
            path: '/rent/add'
        }
    ]

    const navigate = useNavigate()

    function renderNavs() {
        return navs.map((val, i) => (
            <div className='nav-item' key={i} onClick={() => { navigate(val.path) }}>
                <img src={val.img} alt="" />
                <h2>{val.title}</h2>
            </div>
        ))
    }

    return (
        <div className="nav">{renderNavs()}</div>
    )
}

function Group() {

    const [groups, setGroups] = useState(null)

    async function getGroups() {
        const res = await API.get('/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        // console.log(res);
        setGroups(res.data.body)
    }

    useEffect(() => {
        getGroups()
    }, [])

    function renderGroup() {
        // console.log(groups);
        return groups.map((val, i) => (
            <Grid.Item key={i} className="group-item">
                <div className="desc">
                    <p className="title">{val.title}</p>
                    <span className="info">{val.desc}</span>
                </div>
                <img src={BASE_URL + val.imgSrc} alt="" />
            </Grid.Item>
        ))
    }

    return (
        <div className='group'>
            <h3 className="title">
                租房小组
                <span className="more">更多</span>
            </h3>
            <Grid columns={2} gap={10}>
                {groups == null ? '' : renderGroup()}
            </Grid>
        </div>
    )
}

function News() {

    const [news, setNews] = useState(null)

    async function getNews() {
        const res = await API.get('/home/news', {
            params: {
                area: "AREA%7C88cff55c-aaa4-e2e0"
            }
        })
        // console.log(res);
        setNews(res.data.body)
    }

    useEffect(() => {
        getNews()

    }, [])

    function renderNews() {
        return news.map((val, i) => (
            <List.Item key={i}>
                <div className="news-item" key={val.id}>
                    <div className="imgwrap">
                        <img src={BASE_URL + val.imgSrc} alt="" />
                    </div>
                    <div className="content" direction='column' justify="between">  {/* 用 Flex必须在css里设置好宽度或高度 */}
                        <h3 className="title">{val.title}</h3>
                        <div className="info" justify="between">
                            <span>{val.from}</span>
                            <span>{val.date}</span>
                        </div>
                    </div>
                </div>
            </List.Item>
        ))
    }

    return (
        <div className="news">
            <h3 className="title">最新资讯</h3>
            {/* <WingBlank size="md">{this.renderNews()}</WingBlank> */}
            <List>
                {news == null ? '' : renderNews()}
            </List>
        </div>

    )
}