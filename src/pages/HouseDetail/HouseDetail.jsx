import React from 'react'
import { useParams } from 'react-router-dom'

export default function HouseDetail() {

    let { id } = useParams()

    return (
        <div>HouseDetail id={id}</div>
    )
}
