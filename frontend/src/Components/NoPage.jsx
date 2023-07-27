import React from 'react'
import { Link } from 'react-router-dom'

export default function NoPage() {
  return (
    <div>Page Not Found
      <Link to="/Home">  <button type='button'>Please Go Back</button></Link>
    </div>
  )
}