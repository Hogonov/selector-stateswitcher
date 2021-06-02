import {useCallback, useState} from 'react'
import {useMessage} from "./message.hook";

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const message = useMessage()
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            message('Загрузка...')
            if (body) {
                body = JSON.stringify((body))
                headers['Content-type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            if (!response.ok) {
                message('Произошла ошибка!')
                throw new Error(data.message || 'Something error')
            }
            setLoading(false)
            return data
        } catch (e) {
            message('Произошла ошибка!')
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])
    return {loading, request, error, clearError}
};