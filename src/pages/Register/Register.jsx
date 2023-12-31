import './Register.css'
import { useState } from 'react';
import { FieldInput2 } from '../../common/FieldInput2/FieldInput2';
import { registerCall } from '../../services/apiCalls';
import { validator } from '../../services/useful';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const navigate = useNavigate();
    const [userBody, setUserBody] = useState({
        activity_id: 1,
        username: '',
        email: '',
        password: ''
    })

    const userBodyHandler = (e) => {
        setUserBody((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const [userError, setUserError] = useState({
        username: '',
        emailError: "",
        passwordError: ""
    })

    const errorCheck = (e) => {
        let error = "";
        error = validator(e.target.name, e.target.value);

        setUserError((prevState) => ({
            ...prevState,
            [e.target.name + 'Error']: error,
        }));
    }
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const submit = () => {
        registerCall(userBody)
            .then(
                result => {
                    setModalMessage(result.data.message)
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        navigate('/');
                    }, 2000)
                }
            )
            .catch(error => {
                setModalMessage(error.message)
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                }, 2000)
            });
    }

    return (
        <div className='regDesign'>
            {(!showModal) ? (<div className='regContainer '>
                <div className="fieldComp">
                    <FieldInput2
                        design={'inputReg'}
                        type={"username"}
                        name={"username"}
                        placeholder={"Your username..."}
                        functionProp={userBodyHandler}
                        functionBlur={errorCheck}
                    />
                    <FieldInput2
                        design={'inputReg'}
                        type={"email"}
                        name={"email"}
                        placeholder={"email@email.email"}
                        functionProp={userBodyHandler}
                        functionBlur={errorCheck}
                    />
                    <FieldInput2
                        design={'inputReg'}
                        type={"password"}
                        name={"password"}
                        placeholder={"Password"}
                        functionProp={userBodyHandler}
                        functionBlur={errorCheck}
                    />
                </div>
                {(userError.passwordError === true && userError.emailError === true && userError.usernameError === true)
                    ? <div className="regButton" onClick={submit}>Register</div>
                    : <div className="regButtonInactive">Register</div>
                }
                {(userError.usernameError === true)
                    ? ""
                    : <div className='errorMsg'>{userError.usernameError}</div>
                }
                {(userError.emailError === true)
                    ? ""
                    : <div className='errorMsg'>{userError.emailError}</div>
                }
                {(userError.passwordError === true)
                    ? ""
                    : <div className='errorMsg'>{userError.passwordError}</div>
                }
            </div>) : (<div className='regModalContainer'>{modalMessage}</div>)}

        </div>
    );
};