import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Login, Home } from './components'
import { app } from "./config/firebase.config";
import {
    getAuth,
    GoogleAuthProvider,
    inMemoryPersistence,
    signInWithPopup,
} from "firebase/auth";

import { AnimatePresence } from 'framer-motion'
import { validateUser } from "./api";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";

const App = () => {

    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();
    const [auth, setAuth] = useState(
        false || window.localStorage.getItem("auth") === "true"
    );
    const [{ user }, dispatch] =
        useStateValue();

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    //console.log(token);
                    validateUser(token).then((data) => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data,
                        });
                    });
                })
            } else {
                setAuth(false)
                window.localStorage.setItem("auth", false);
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                });
                navigate('/login')
            }
        })
    }, [])


    return (
        <AnimatePresence mode="wait">
            <div className='h-auto min-w-[680px] bg-primary
         flex justify-center items-center'>
                <Routes>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/*" element={<Home />} />
                </Routes>
            </div>
        </AnimatePresence>
    )
}

export default App