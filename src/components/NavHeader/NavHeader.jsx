import React from 'react'
import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import './NavHeader.scss'

export default function NavHeader({ children }) {

  const navigate = useNavigate()

  return (
    <NavBar onBack={() => { navigate(-1) }}>{children}</NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.any.isRequired
}
