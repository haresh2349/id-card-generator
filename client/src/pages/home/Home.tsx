import { Box } from "@mui/material"
import Navbar from "../../components/navbar/Navbar"
import { IDCardForm } from "./components/create-card/IDCardForm"
import { IDCardPreview } from "../../components/id-card-preview/IDCardPreview"
import { useState } from "react"
import { IdCardFormData } from "../../types/userDetailsType"

export const Home = () => {
    const [formData,setFormData] = useState<IdCardFormData>({
        name:"",
        userType:"",
        companyName:"",
        instituteName:"",
        department:null,
        designation:null,
        employeeId:null,
        studentId:null,
        email:"",
        phone:"",
        joinedDate:null,
        term1:"",
        term2:"",
        division:"",
        link:"",
        profilePhoto:null
      } as IdCardFormData);
      const [isDataValidated,setIsDataValidated] = useState(false);

    return <Box sx={{width:"100vw",height:"100vh",position:"relative"}}>
        <Navbar/>
        <Box sx={{display:"flex",justifyContent:"space-between",position:"absolute",top:"80px",left:0,right:0}}>
            <IDCardForm formData={formData} setFormData={setFormData} setIsDataValidated={setIsDataValidated}/>
            <IDCardPreview isDataValidated={isDataValidated} previewData={formData}/>
        </Box>
    </Box>
}