import React from 'react';
// import Navbar from '../components/Nav/Navbar';
// import Mininav from '../components/Nav/Mininav';
import Footer from '../components/Footer';
import { NavLink } from 'react-router-dom';

export default function Home() {
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
              crimson-text-regular'>
                <NavLink to='/feed' className='nav-link'>
                  Start to write
                </NavLink>
            </button>

          </div>

          <div className='iconMan'> </div>
            
      </div>
      
      <Footer />

    </>)
};


