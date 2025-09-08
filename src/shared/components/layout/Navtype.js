import React from 'react'

export default function Navtype() {

 // function aboutpage (e){
 //   e.preventDefault();
 //   window.location.href = '/about';
 // } 

  return (
    <>
        <div  style={{textAlign:'center',fontSize:'16px'}}>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1" style={{fontSize:'16px'}} > Life </button>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1"  style={{fontSize:'16px'}}>Work</button>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1"  style={{fontSize:'16px'}}>Society</button>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1"  style={{fontSize:'16px'}}>Technology</button>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1"  style={{fontSize:'16px'}}>Software Development</button>
            <button type="button" 
              className="btn btn-outline-dark rounded-pill 
               m-1"  style={{fontSize:'16px'}}>Culture</button>
        </div><br/>
    </>
  )
}
