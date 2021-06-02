import React from "react";
import style from './Button.module.scss'

export const Button = props => {

    let color = style.button
    switch (props.type){
        case 'red': color = style.buttonRed
            break
        case 'green': color = style.buttonGreen
    }

    return <button
        name={props.name}
        className={`btn ${color}`}
        onClick={props.clickHandler}
    >{props.text}</button>
}