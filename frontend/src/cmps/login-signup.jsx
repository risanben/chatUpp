import { useState, useEffect } from 'react'
import { userService } from '../services/user.service'
import { ImgUploader } from '../cmps/img-uploader'

export function LoginSignup(props) {
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
    const [isSignup, setIsSignup] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
        setIsSignup(false)
    }

    function handleChange(ev) {
        if (!props.isCredentialMatched) props.setIsCredentialMatched(true)
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    function onLogin(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username) return
        props.onLogin(credentials)
        clearState()
    }

    function onGuestSelect(){
        props.onLogin({username:'guest', fullname:'demo guest', password:'guest'})
    }

    function onSignup(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        props.onSignup(credentials)
        clearState()
    }

    function toggleSignup() {
        setIsSignup(!isSignup)
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <div className="login-signup flex justify-center align-center">

            <div className="login-container flex column align-center">
                <h1>{!isSignup ? 'Login' : 'Signup'}</h1>
                {!isSignup && <form className="login-form flex column align-center " onSubmit={onLogin}>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button className='pointer'>Login</button>
                </form>}
                {(!props.isCredentialMatched && !isSignup) && <section className="errors">User name or password incorrect</section>}
                {!isSignup && <button className='guest-btn pointer' onClick={onGuestSelect}>Continue as a guest</button>}


                <div className="signup-section flex column align-center">
                    {isSignup && <form className="signup-form flex column align-center" onSubmit={onSignup}>
                        <input
                            type="text"
                            name="fullname"
                            value={credentials.fullname}
                            placeholder="Fullname"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        {/* <ImgUploader onUploaded={onUploaded} /> */}
                        <button >Signup</button>
                    </form>}
                </div>
                <div className="membership-status " onClick={toggleSignup}>{!isSignup ? <section>Not a memeber yet? <span className='pointer'>Sign Up</span></section> : <section>Or, <span className='pointer'>Login</span></section>}</div>
            </div>
        </div>
    )
}