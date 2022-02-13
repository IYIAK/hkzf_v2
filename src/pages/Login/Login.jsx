import React from 'react'
import NavHeader from '../../components/NavHeader/NavHeader'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Toast } from "antd-mobile";
import { API } from '../../utils/api'
import './Login.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {

    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className='login'>
            <NavHeader>用户登录</NavHeader>
            <Formik
                initialValues={{ username: '', password: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.username) {
                        errors.username = '账号不能为空';
                    } else if (
                        !/^[a-zA-Z_\d]{5,8}$/.test(values.username)
                    ) {
                        errors.username = '长度为5到8位，只能出现数字、字母、下划线';
                    }

                    if (!values.password) {
                        errors.password = '密码不能为空';
                    } else if (!/^[a-zA-Z_\d]{5,12}$/.test(values.password)) {
                        errors.password = '长度为5到12位，只能出现数字、字母、下划线';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {

                    const { username, password } = values
                    // 发送请求
                    const res = await API.post('/user/login', {
                        username,
                        password
                    })

                    const { status, body, description } = res.data

                    // 利用闭包，这里也可以用location
                    // console.log(location);
                    if (status === 200) {
                        // 登录成功
                        localStorage.setItem('hkzf_token', body.token)

                        /* 
                          1 登录成功后，判断是否需要跳转到用户想要访问的页面（判断 location.state 是否有值）。
                          2 如果不需要（没有值），则直接调用 navigate(-1) 返回上一页。
                          3 如果需要，就跳转到 from.pathname 指定的页面。
                        */
                        if (!location.state) {
                            // 此时，表示是直接进入到了该页面，直接调用 go(-1) 即可
                            navigate(-1)
                        } else {
                            // push：[home, login, map]
                            // replace: [home, map]
                            navigate(location.state.from.pathname)
                        }

                    } else {
                        // 登录失败
                        // Toast.show(description, 2, null, false)
                        Toast.show({
                            content: description
                        })
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field type="text" name="username" placeholder="请输入账号" />
                        <ErrorMessage name="username" component="div" />
                        <Field type="password" name="password" placeholder="请输入密码" />
                        <ErrorMessage name="password" component="div" />
                        <button type="submit" disabled={isSubmitting}>
                            登 录
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="center">
                <Link to='registe'>还没有账号？去注册</Link>
            </div>

        </div>

    )
}
