import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import instance from "../api.js";

const SignInScreen = () => {

    const navigateTo = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (!token) {
            navigateTo('/signin');
            localStorage.removeItem("auth-token");
        } else {
            navigateTo('/');
        }
    }, []);

    const handleSignin = async () => {
        setEmailError("");
        setPasswordError("");
        const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!email) {
            setEmailError("Email should not be blank")
        } else if (!regex.test(email)) {
            setEmailError("Not a valid email");
        } else if (!password) {
            setPasswordError("Password should not be blank");
        } else {
            await instance.post("/signin", {
                email: email,
                password: password,
            })
                .then((response) => {
                    if (response.data.status === "user exist") {
                        localStorage.setItem("auth-token", response.data.token);
                        localStorage.setItem("studentId", response.data.student.student_id);
                        navigateTo("/");
                    }
                })
                .catch((err) => {
                    if (err.response.data.statusmsg === "donotexist") {
                        setEmailError(err.response.data.msg);
                    } else {
                        setPasswordError(err.response.data.msg);
                    }
                })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4" >
            <div className='bg-[#191C24] p-8 max-w-sm w-full'>
                <h2 className="text-4xl p-1 text-center font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-6">Sign In</h2>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    className="text-white bg-[#191C24] w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p
                    style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px"
                    }}
                >{emailError}</p>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    className="text-white bg-[#191C24] w-full mt-5 px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p
                    style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "3px",
                        marginLeft: "10px"
                    }}
                >{passwordError}</p>
                <button onClick={handleSignin} className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-colors">
                    Sign In
                </button>
           </div>
        </div>
    )
}

export default SignInScreen;