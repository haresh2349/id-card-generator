import FormContext from "./FormContext"

export const FormProvider = ({children}) => {
    return <FormContext.Provider>{children}</FormContext.Provider>
}