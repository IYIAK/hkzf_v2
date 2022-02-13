import React, { useEffect, useState } from 'react';
import { Dialog, Grid } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
import { getToken, removeToken } from '../../utils/auth'
import './Profile.scss'
import { useNavigate, Link } from 'react-router-dom';
// 菜单数据
const menus = [
    { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favourites' },
    { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
    { id: 3, name: '看房记录', iconfont: 'icon-record' },
    {
        id: 4,
        name: '成为房主',
        iconfont: 'icon-identity'
    },
    { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
    { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'



export default function Profile() {

    const navigate = useNavigate()

    const [userInfo, setUserInfo] = useState({})
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        getInfo()
    }, [])

    async function getInfo() {

        //API已经封装好了，不用再手动附带上token
        const res = await API.get('/user')

        if (res.data.status === 200) {

            const { avatar, nickname } = res.data.body

            setUserInfo({
                avatar: avatar ? BASE_URL + avatar : DEFAULT_AVATAR, //avatar为空就不要进行拼接了
                nickname
            })

            setIsLogin(true)
        } else {
            // token 失效的情况，这种情况下， 应该将 isLogin 设置为 false
            this.setState({
                isLogin: false
            })
        }

    }

    function handleLogout() {
        Dialog.confirm({
            content: '是否确认退出？',
            onConfirm:
                async () => {
                    // 调用退出接口
                    await API.post('/user/logout', null, {
                        headers: {
                            authorization: getToken()
                        }
                    })

                    // 移除本地token
                    removeToken()

                    // 处理状态
                    setUserInfo({
                        avatar: '',
                        nickname: ''
                    })

                    setIsLogin(false)
                },
            onCancle: () => { }
        })
    }

    return <div className='profile'>

        <div className="title">
            <img
                className='bg'
                src={BASE_URL + '/img/profile/bg.png'}
                alt="背景图"
            />

            <div className="info">
                <img src={isLogin ? userInfo.avatar : DEFAULT_AVATAR} alt="头像" className="avatar" />

                <div className="username">{isLogin ? userInfo.nickname : '游客'}</div>

                {isLogin ?
                    <>
                        <span className='toLogout' onClick={handleLogout}>退出</span>
                        <div className='edit'>
                            编辑个人资料
                            <span className='arrow'>
                                <i className="iconfont icon-arrow" />
                            </span>
                        </div>
                    </>
                    : <span className='toLogin' onClick={() => { navigate('/login') }}>去登录</span>
                }
            </div>
        </div>



        <Grid columns={3} gap={2}>
            {menus.map((item, i) => (
                <Grid.Item key={i}>
                    {item.to ? (
                        <Link to={item.to}>
                            <div className='menuItem'>
                                <i className={`iconfont ${item.iconfont}`} />
                                <span>{item.name}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className='menuItem'>
                            <i className={`iconfont ${item.iconfont}`} />
                            <span>{item.name}</span>
                        </div>
                    )}
                </Grid.Item>
            ))}
        </Grid>

        {/* 加入我们 */}
        <img src={BASE_URL + '/img/profile/join.png'} alt="" className='ad' />


    </div>;
}
