import React from "react";
import style from './Select.module.scss'

export const Select = props => {
    return  <select name="types"
                    className={style.select}
                    onChange={props.selectHandler}
                    value={props.selectValue}
    >
        <option value="" defaultValue hidden>{props.placeholderText}</option>
        {props.categorize.map((option) => {
            return <option
                value={option.index}
                key={option.index}
            >{option.label}</option>
        })}
    </select>
}