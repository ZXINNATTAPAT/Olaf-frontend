import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../axios/index'
import useAuth from '../hook/useAuth'

export default function Loginauth() {

    const { setAccessToken, setCSRFToken } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/Feed'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [error, setError] = useState(null); 

    async function handleSubmit(event) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await axiosInstance.post('auth/login', 
              JSON.stringify({
                email,
                password
            }))

            setAccessToken(response?.data?.access_token)
            setCSRFToken(response.headers["x-csrftoken"])
            setEmail()
            setPassword()
            setLoading(false)

            localStorage.setItem('us' , true) //user status
        
            // console.log(response?.data?.access_token);
            // console.log(response.headers["x-csrftoken"]);

            navigate(fromLocation, { replace: true })
        } catch (error) {
            console.log(JSON.stringify({
                email,
                password
            }))
            setLoading(false)
            setError(error);
            // TODO: handle errors
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

                    <div className='card p-1 m-1' style={{ width: '60px', height: '60px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div className='card-body' 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src='https://cdn-icons-png.flaticon.com/512/2991/2991148.png'
                          alt='Icon'
                          style={{ width: '45px', height: '45px' }}
                        />
                      </div>
                    </div>

                    <div className='card p-1 m-1' style={{ width: '60px', height: '60px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div className='card-body' 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/600px-2023_Facebook_icon.svg.png'
                          alt='Icon'
                          style={{ width: '45px', height: '45px' }}
                        />
                      </div>
                    </div>
                  
                  </div>


                </div>
              </div>
          </div>
        </div>
        

      </div>
    )
}
