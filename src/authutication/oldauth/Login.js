import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import { Navigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BASE_URL;

const Login = ( ) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      username: username,
      password: password,
    };
  
    try {
      // ส่งคำขอ login
      const response = await axios.post(`${baseUrl}/auth/login/`, payload, {
        withCredentials: true, // Include cookies for session management
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Login successful:', response.data);
  
      // ดึง access token จากการ login
      // const accessToken = response.data.access;
      // sessionStorage.setItem('accessToken',`${response.data.access}`);

      // localStorage.setItem('accessToken',`${response.data.access}`);
     
      // const TKs = localStorage.getItem('accessToken');

      //   const getCookie = (name) => {
      //     const value = `; ${document.cookie}`;
      //     const parts = value.split(`; ${name}=`);
      //     if (parts.length === 2) return parts.pop().split(';').shift();
      //     return null; // Return null if the cookie doesn't exist
      // };
      // const accessToken = getCookie('access_token'); 
      // console.log(accessToken);
      // window.location.href = '/Feed';
      // ส่ง access token ใน header
      // const checkResponse = await axios.get(`${baseUrl}/auth/check/`, {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`, // ส่ง token ใน header
      //   },
      //   withCredentials: true,
      // });
  
      // if (checkResponse.status === 200) {
      //   console.log('User is authenticated:', checkResponse.data);
        
      //   // ย้ายไปที่หน้า Feed
        // window.location.href = '/Feed';
        // navigator('/Feed');
      navigate("/Feed");

      // } else {
      //   console.log('User is not authenticated');
      // }
    } catch (error) {
      console.error('Error during login or authentication check:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };
  
  

  return (
    <>
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
                        className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        aria-describedby="userNameHelp"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state on change
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
    </>
  );
}
export default Login;
