import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { IconPath } from '../../../shared/components';
import useAuth from '../../../shared/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://olaf-backend.onrender.com/api';

// Validation Schema using Yup
const form = Yup.object().shape({
  header: Yup.string().max(255, 'Maximum 255 characters').required('Required'),
  short: Yup.string().max(255, 'Maximum 255 characters').required('Required'),
  post_text: Yup.string().required('Required'),
  image: Yup.mixed().required('Required'),
});

const Addcontent = () => { 
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromLocation = location?.state?.from?.pathname || '/Profile'
  const [message, setMessage] = useState(''); 
  const Ic = IconPath();

  const [Newfrom, setNewfrom] = useState(
    {
      header:'',
      short:'',
      post_text:'',
      image:null,
      user:user.username
    }); 
  
  const handleSubmit = async (values, 
    { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('header', values.header);
    formData.append('short', values.short);
    formData.append('post_text', values.post_text);
    formData.append('user', user.id );
    formData.append('image', values.image);

    try {
      await axios.post(`${baseUrl}/posts/`, 
        formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setMessage('Post created successfully!');
      resetForm();
      navigate(fromLocation, { replace: true })
      } catch (error) {
        console.error('Error creating post:', error);
        setMessage('Failed to create post. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <>
    <br/><br/>

      <div className='container'>
        <h2>Create a New Post</h2>
        <Formik
          initialValues={{ header: '', short: '', post_text: '', image: null }}
          validationSchema={form}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <>
            <Form>

              <div className="mb-3">
                <label htmlFor="header" 
                  className="form-label">
                    Header
                </label>
                <Field 
                  name="header" 
                  type="text" 
                  className="form-control" 
                  onChange={(event) => {
                    setFieldValue('header', event.target.value)
                    setNewfrom(prevState => ({
                      ...prevState,
                      header: event.target.value
                    }));
                  }}
                />
                <ErrorMessage name="header" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="short" className="form-label">Short Description</label>
                <Field name="short" type="text" className="form-control" 
                  onChange={(event) => {
                    setFieldValue('short', event.target.value)
                    setNewfrom(prevState => ({
                      ...prevState,
                      short: event.target.value
                    }));
                  }}
                />
                <ErrorMessage name="short" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="post_text" className="form-label">Post Text</label>
                <Field name="post_text" as="textarea" className="form-control" rows="3"
                  onChange={(event) => {
                    setFieldValue('post_text', event.target.value)
                    setNewfrom(prevState => ({
                      ...prevState,
                      post_text: event.target.value
                    }));
                  }}
                />
                <ErrorMessage name="post_text" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
                />
                <ErrorMessage name="image" component="div" className="text-danger" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}>
                Submit
              </button>

            </Form>
          
        
      <br/><br/>

      <div className={window.innerWidth <= 425 ? 
        'container-fluid' :
        'container border border-dark shadow-sm rounded glasx'}>
        <div className={window.innerWidth <= 425 ? 'd-flex justify-content-center' : ''}>
          <div className={window.innerWidth <= 426 ? '' : 'swx container'} >
            <br />

            <h1 class=""
              style={{ fontWeight: 'bolder', fontSize: '42.5px' }}>
              {Newfrom.header}
            </h1>

            <p className=''
              style={{ fontSize: '25px', opacity: '60%' }}>
              {Newfrom.short}
            </p>

            <p className='border-top border-bottom border-dark  p-2'
              style={{ fontSize: '16px' }}>
              <i class="bi bi-person-circle"></i>
              &nbsp;{Newfrom.user}
            </p>

            <p className=''
              style={{ fontSize: '12px' }}>

              <img className='m-1 iconsize'
                src={Ic[0]}
                alt='x'
              />

              <span className=''
                style={{ fontWeight: 'bold' }}>
                {Newfrom.post_datetime}
              </span>

              <img className='m-1 iconsize'
                src={Ic[1]}
                alt='x'
              />

              <span className=''> 1.5k </span>

              <img className='m-1 iconsize'
                src={Ic[2]}
                alt='x'
              />

              <span className=''> 15 </span>

            </p>
          </div>
        </div>

        <div className='d-flex justify-content-center'>
          <img className=''
            src={Newfrom.image 
              || 'https://miro.medium.com/v2/resize:fit:1100/format:webp/1*1Eq0WTubrn1gd_NofdVtJg.png'}
            alt='x'
            style={{ width: '70%' }}
          />
        </div><br />

        <div className='d-flex justify-content-center'>
          <div className='swx' >
            <p className='crimson-text-regular' style={{ fontSize: '24px' }}>
              {Newfrom.post_text}
            </p>
          </div>
        </div>

      </div>

      <br />

      <div style={{backgroundColor:'whitesmoke'}}>
        <div className={window.innerWidth <= 425 ?
          'container-fluid' :
          'container-fluid   glasx'}>

          <div className={window.innerWidth <= 425 ?
            'd-flex justify-content-center' : ''}>

            <div className={window.innerWidth <= 426 ?
              '' : 'swx container'} >
              <br />
              <p className='p-2'
                style={{ fontSize: '16px' }}>
                <i class="bi bi-person-circle"></i>
                &nbsp;Written by {Newfrom.user}
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      </Formik>
      {message && <p>{message}</p>}

      </div>
    </>
  );
};

export default Addcontent;
