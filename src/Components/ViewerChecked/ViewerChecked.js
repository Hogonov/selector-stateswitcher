import React from "react";
import style from './ViewerChecked.module.scss'

export const ViewerChecked = props => {
    return <div className={style.main}>
        {props.arraySelectIndex.map(index => {
            return <div
                key={index}
                className={style.checkedOption}
            >{props.categorize[index].label}
                <svg id={index} className={style.svg} onClick={props.dropType}/>
            </div>
        })}
    </div>
}