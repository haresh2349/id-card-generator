import {createContext, useContext} from "react"
const FormContext = createContext()

export function useFormContext(){
    return useContext(FormContext)
}

export default FormContext