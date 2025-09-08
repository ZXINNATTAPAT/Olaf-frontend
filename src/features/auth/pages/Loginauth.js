import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../shared/services/axios/index'
import useAuth from '../../../shared/hooks/useAuth'
import useLoader from '../../../shared/hooks/useLoader'

export default function Loginauth() {

    const { setUser, setCSRFToken, setAccessToken } = useAuth()
    const { showLoader, hideLoader } = useLoader()
    const navigate = useNavigate()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(null); 

    async function handleSubmit(event) {
        event.preventDefault()

        showLoader('กำลังเข้าสู่ระบบ...')
        setError(null)

        try {
            const response = await axiosInstance.post('/auth/login/', {
                email,
                password
            }, {
                withCredentials: true, // สำคัญสำหรับ httpOnly cookies
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            // สำหรับ httpOnly cookies, token จะถูกส่งอัตโนมัติ
            // แต่เรายังคงเก็บข้อมูล user ใน context
            if (response.data.user) {
                setUser(response.data.user)
            }
            
            // บันทึก access token ถ้ามี
            if (response.data.access_token) {
                setAccessToken(response.data.access_token)
                localStorage.setItem('accessToken', response.data.access_token)
            }
            
            // บันทึก CSRF token ถ้ามี
            if (response.headers["x-csrftoken"]) {
                setCSRFToken(response.headers["x-csrftoken"])
                localStorage.setItem('csrfToken', response.headers["x-csrftoken"])
            }

            setEmail('')
            setPassword('')
            hideLoader()

            // บันทึกสถานะการล็อกอิน
            localStorage.setItem('us', true)
        
            // Navigate to feed page
            navigate('/Feed', { replace: true })
            
        } catch (error) {
            console.error('Login error:', error)
            hideLoader()
            
            // แสดง error message ที่เข้าใจง่าย
            if (error.response?.data?.message) {
                setError(error.response.data.message)
            } else if (error.response?.data?.error) {
                setError(error.response.data.error)
            } else if (error.response?.data?.detail) {
                setError(error.response.data.detail)
            } else if (error.response?.status === 401) {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
            } else if (error.response?.status === 400) {
                setError('กรุณากรอกข้อมูลให้ครบถ้วน')
            } else if (error.response?.status === 500) {
                setError('เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง')
            } else if (error.code === 'NETWORK_ERROR') {
                setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
            } else {
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
            }
        }
    }

    return (
        <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            <div className='border-end' style={{marginTop: '220px'}}>
              <span class="crimson-text-bold-italic" 
                style={{fontSize:"200px",marginLeft:'125px'}}>
                OLAF.
              </span>
              <p className='crimson-text-regular-italic' 
              style={{marginLeft:'125px'}}> 
              Ideas, stories, and knowledge are all creations that can be shaped by your own hands.</p>
            </div>
          </div>
          <div className='col'>
              <div className='card' 
                style={{ marginTop: '180px',border:'none' ,width:'525px' }}>
                <div className='card-body'>
                  <h3 className='crimson-text-bold-italic' style={{fontSize:'80px'}}>Sign in</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="exampleInputUsername1" 
                        className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        aria-describedby="userNameHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update state on change
                      />
                      {/* <div id="emailHelp" 
                        className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleInputPassword1" 
                        className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state on change
                      />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}

                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form><br/>

                  <div className='row'>

                    
                  
                  </div>


                </div>
              </div>
          </div>
        </div>
        

      </div>
    )
}
