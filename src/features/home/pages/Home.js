import React from 'react';
// import Navbar from '../components/Nav/Navbar';
// import Mininav from '../components/Nav/Mininav';
import { Footer } from '../../../shared/components';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleButtonClick = () => {
    if (!user.email) {
      navigate('/auth/login'); // Redirect to login if not logged in
    } else {
      navigate('/feed'); // Proceed to the feed if logged in
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className='container-fluid border-bottom border-dark' 
        style={{height:'85vh',
        backgroundColor:'whitesmoke',border:'#000000'}}>

          <div className='container' >
            <br/><br/><br/><br/><br/><br/>
            <h1 className='crimson-text-bold-italic'
                style={{fontSize:'200px'}}>
                  OLAF.
            </h1>
            <p className='crimson-text-regular'style={{fontSize:'22px'}} >
              Put your story ideas into words, for they may become the seeds of<br/>
              inspiration that help others grow
            </p><br/>

            <button className='btn btn-dark 
              crimson-text-regular' onClick={handleButtonClick}>
                
                  Start to write
                
            </button>

          </div>

          <div className='iconMan'> </div>
            
      </div>
      
      <Footer />

    </>)
};


