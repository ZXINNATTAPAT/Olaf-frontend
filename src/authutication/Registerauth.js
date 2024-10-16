import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axios/index'

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    function onEmailChange(event) {
        setEmail(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    function onUsernameChange(event) {
        setUsername(event.target.value)
    }

    function onPasswordConfirmationChange(event) {
        setPasswordConfirmation(event.target.value)
    }

    function onFirstNameChange(event) {
        setFirstName(event.target.value)
    }

    function onLastNameChange(event) {
        setLastName(event.target.value)
    }

    function onPhoneChange(event) {
        setPhone(event.target.value)
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        setLoading(true)
        setErrorMessage('')  // Reset error message

        // Basic validation
        if (!username || !email || !password || !passwordConfirmation || !firstName || !lastName || !phone) {
            setErrorMessage('All fields are required!')
            setLoading(false)
            return
        }

        if (password !== passwordConfirmation) {
            setErrorMessage('Passwords do not match!')
            setLoading(false)
            return
        }

        try {
            const response = await axiosInstance.post('auth/register', JSON.stringify({
                username,
                email,
                password,
                password2: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                phone
            }))

            // Clear form inputs
            setEmail('')
            setPassword('')
            setUsername('')
            setPasswordConfirmation('')
            setFirstName('')
            setLastName('')
            setPhone('')
            setLoading(false)

            // Navigate to login page
            navigate('/auth/login')
        } catch (error) {
            setLoading(false)
            // Handle error response from server
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Registration failed!')
            } else {
                setErrorMessage('An error occurred. Please try again later.')
            }
        }
    }

    return (
        <div className='container'>
            <h2>Register</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder='First Name' 
                        autoComplete='off' 
                        className='form-control' 
                        id='firstName' 
                        value={firstName}
                        onChange={onFirstNameChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder='Last Name' 
                        autoComplete='off' 
                        className='form-control' 
                        id='lastName' 
                        value={lastName}
                        onChange={onLastNameChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder='Phone' 
                        autoComplete='off' 
                        className='form-control' 
                        id='phone' 
                        value={phone}
                        onChange={onPhoneChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="text" 
                        placeholder='Username' 
                        autoComplete='off' 
                        className='form-control' 
                        id='username' 
                        value={username}
                        onChange={onUsernameChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        autoComplete='off' 
                        className='form-control' 
                        id="email" 
                        value={email}
                        onChange={onEmailChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        placeholder='Password' 
                        autoComplete='off' 
                        className='form-control' 
                        id="password" 
                        value={password}
                        onChange={onPasswordChange} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        placeholder='Confirm Password' 
                        autoComplete='off' 
                        className='form-control' 
                        id="passwordConfirmation" 
                        value={passwordConfirmation}
                        onChange={onPasswordConfirmationChange} 
                    />
                </div>
                <div className="mb-3">
                    <button disabled={loading} className='btn btn-success' type="submit">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    )
}
