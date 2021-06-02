import {useState, useCallback, useEffect} from 'react'
import {useHttp} from "./Hooks/http.hook";
import {Button} from "./Components/Button/Button";
import {Select} from "./Components/Select/Select";
import {ViewerChecked} from "./Components/ViewerChecked/ViewerChecked";

import 'materialize-css';
import './App.scss';


function App() {
    const {request} = useHttp()
    const url = 'https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json'
    const [data, setData] = useState({
        testArr: [],
        testArrOneDimensional: [],
        categorize: []
    })
    const [selectValue, setSelectValue] = useState({index: '', label: '', value: ''})
    const [arraySelectIndex, setArraySelectIndex] = useState([])
    const [viewFlag, setViewFlag] = useState({selector: false, viewerValue: false})
    const [lastChanges, setLastChanges] = useState({
        nowIndexState: 0,
        lastChangesState: [{
            selectValue: {},
            arraySelectIndex: []
        }]
    })

    const getSourceDataByClick = useCallback(async () => {
        try {
            const fetched = await request(url, 'GET', null)
            let oneDimensionalArray = toOneDimensionalArray(fetched.testArr)
            setData({
                ...data,
                testArr: fetched.testArr,
                testArrOneDimensional: oneDimensionalArray,
                categorize: categorizeArrayByType(oneDimensionalArray),
            })
            setViewFlag({...viewFlag, selector: true})
        } catch (e) {
            console.log(e)
        }
    }, [request, data, setData, setViewFlag])


    const dropData = () => {
        try {
            setData({
                testArr: [],
                testArrOneDimensional: [],
                categorize: []
            })
            setSelectValue({index: '', label: '', value: ''})
            setArraySelectIndex([])
            setViewFlag({selector: false, viewerValue: false})
        } catch (e) {
        }
    }

    const toOneDimensionalArray = (array, result = []) => { // рекурсивное сглаживание массива
        try {
            for (let i = 0; i < array.length; i++) {
                if (Array.isArray(array[i])) {
                    toOneDimensionalArray(array[i], result)
                } else {
                    result.push(array[i])
                }
            }
            return result
        } catch (e) {
        }
    }
    const categorizeArrayByType = (array, types = []) => {
        try {
            let categoryArr = []
            for (let i = 0; i < array.length; i++) {
                if (types.indexOf(typeof array[i]) === -1) {
                    types.push(typeof array[i])
                }
            }
            for (let i = 0; i < types.length; i++) {
                let subArr = []
                for (let j = 0; j < array.length; j++) {
                    let type = typeof array[j]
                    if (types[i] === type) {
                        subArr.push(array[j])
                    }
                }
                categoryArr.push({index: i, label: types[i], value: subArr})
            }
            return categoryArr
        } catch (e) {
        }

    }

    const selectHandler = (event) => {
        try {
            let index = event.target.value
            let selectValueSub = {
                ...selectValue,
                index,
                value: data.categorize[index].value,
                label: data.categorize[index].label
            }
            let arr = []
            if (arraySelectIndex.indexOf(index) === -1) {
                arr = arraySelectIndex.slice()
                arr.push(index)
                arr.sort()
                setArraySelectIndex(arr)

                let arrLastChanges = lastChanges.lastChangesState.slice()
                arrLastChanges.push({selectValue: selectValueSub, arraySelectIndex: arr})
                if (arrLastChanges.length > 10) {
                    arrLastChanges.shift()
                }
                setLastChanges({
                    ...lastChanges,
                    nowIndexState: lastChanges.nowIndexState + 1,
                    lastChangesState: arrLastChanges
                })
                setSelectValue(selectValueSub)
            }



            setViewFlag({...viewFlag, viewerValue: true})
        } catch (e) {
        }

    }

    const dropType = (event) => {
        try {
            let subArr = arraySelectIndex.slice()
            let index = arraySelectIndex.indexOf(event.target.id);
            if (index > -1) {
                subArr.splice(index, 1);
                setArraySelectIndex(subArr)
            }
            const arrLastChanges = lastChanges.lastChangesState.slice()
            arrLastChanges.push({selectValue, arraySelectIndex: subArr})
            if (arrLastChanges.length > 10) {
                arrLastChanges.shift()
            }
            setLastChanges({
                ...lastChanges,
                nowIndexState: lastChanges.nowIndexState + 1,
                lastChangesState: arrLastChanges
            })
        } catch (e) {
        }

    }

    const changeState = (event) => {
        try {
            let index = lastChanges.nowIndexState
            switch (event.target.name) {
                case 'back':
                    if (lastChanges.nowIndexState > 0) {
                        setLastChanges({
                            ...lastChanges,
                            nowIndexState: --index,
                        })
                    }
                    break
                case 'next':
                    if (lastChanges.nowIndexState < lastChanges.lastChangesState.length) {
                        setLastChanges({
                            ...lastChanges,
                            nowIndexState: ++index,
                        })
                    }
                    break
            }
            let lastChan = lastChanges.lastChangesState[index]
            setSelectValue({
                ...selectValue,
                index: lastChan.selectValue.index,
                value: lastChan.selectValue.value,
                label: lastChan.selectValue.label
            })
            setArraySelectIndex(lastChan.arraySelectIndex)
        } catch (e) {
        }

    }

    return <div className="App">
        <div>
            <Button text={'Получить данные'} clickHandler={getSourceDataByClick}/>
            <Button text={'Сбросить данные'} clickHandler={dropData} type={'drop'}/>
        </div>
        {viewFlag.selector && <>
            <div className='navigation'>
                <Button
                    text={'Предыдущее состояние'}
                    clickHandler={changeState}
                    name={'back'}
                    type={'green'}
                />
                <Button
                    text={'Следующие состояние'}
                    clickHandler={changeState}
                    name={'next'}
                    type={'green'}

                />
            </div>
            <Select
                selectHandler={selectHandler}
                selectValue={selectValue.index}
                categorize={data.categorize}
                placeholderText={'Выберете один или несколько типов данных'}
            />
            {viewFlag.viewerValue && <>
                <ViewerChecked
                    arraySelectIndex={arraySelectIndex}
                    categorize={data.categorize}
                    dropType={dropType}
                />
            </>}
        </>}
    </div>
}

export default App
