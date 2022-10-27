import React from "react";

interface LoginProp{
    callback: (owner: string) => void
}

export default function Login(props: LoginProp): JSX.Element {
    var owner: string;

    const onButtonClick = () => {
        if (owner !== ""){
            props.callback(owner)
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        owner = e.target.value
    }

    return (
        <div className="flex flex-row card-input">
            <input type="text" placeholder="Enter your name" onChange={onInputChange}/>
            <button className="btn-outline-success" onClick={onButtonClick}>Submit</button>
        </div>
    )
}