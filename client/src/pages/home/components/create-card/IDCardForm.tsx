import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, FormHelperText, Button } from "@mui/material"
import { IdCardFormData } from "../../../../types/userDetailsType"
import { useState } from "react"

interface IDCardFormProps {
  formData: IdCardFormData,
  setFormData: React.Dispatch<React.SetStateAction<IdCardFormData>>;
  setIsDataValidated:React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormErrors {
  name?: string;
  userType?: string;
  companyName?: string;
  division?: string;
  designation?: string;
  studentId?: string;
  employeeId?: string;
  instituteName?: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
}

export const IDCardForm = ({ formData, setFormData,setIsDataValidated }: IDCardFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: any) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length > 50) error = 'Name must be 50 characters or less';
        break;
      case 'userType':
        if (!value) error = 'User type is required';
        break;
      case 'companyName':
        if (formData.userType === 'employee' && !value.trim()) 
          error = 'Company name is required for employees';
        break;
      case 'division':
        if (formData.userType === 'student' && !value.trim()) 
          error = 'Division is required for students';
        break;
      case 'designation':
        if (formData.userType === 'employee' && !value.trim()) 
          error = 'Designation is required for employees';
        break;
      case 'studentId':
        if (formData.userType === 'student' && !value.trim()) 
          error = 'Student ID is required';
        break;
      case 'employeeId':
        if (formData.userType === 'employee' && !value.trim()) 
          error = 'Employee ID is required';
        break;
      case 'instituteName':
        if (formData.userType === 'student' && !value.trim()) 
          error = 'Institute name is required';
        break;
      case 'email':
        if (formData.userType === 'employee') {
          if (!value.trim()) error = 'Email is required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
            error = 'Invalid email format';
        }
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!/^[0-9]{10,15}$/.test(value)) 
          error = 'Phone must be 10-15 digits';
        break;
      case 'profilePhoto':
        if (!value) error = 'Profile photo is required';
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, files } = e.target;
    
    // Validate the field
    const error = validateField(name, files?.length ? files[0] : value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Update form data
    if (name === "profilePhoto" && files?.length) {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { value, name } = e.target;
    const error = validateField(name as string, value);
    setErrors(prev => ({ ...prev, [name as string]: error }));
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'term1' && key !== 'term2' && key !== 'link') { // Optional fields
        const error = validateField(key, formData[key as keyof IdCardFormData]);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidate = () => {
    if(validateForm()){
      setIsDataValidated(true)
    }
  }


  return (
    <Box sx={{ 
      width: "30%", 
      display: "flex", 
      flexDirection: "column", 
      gap: "0.8rem", 
      padding: "1rem" 
    }}>
      <FormControl error={!!errors.name}>
        <TextField 
          id="name" 
          label="Name" 
          name="name"
          value={formData?.name}
          variant="outlined"
          required
          error={!!errors.name}
          helperText={errors.name}
          inputProps={{ maxLength: 50 }}
          onChange={handleChange}
        />
      </FormControl>
      
      <FormControl error={!!errors.userType} required>
        <InputLabel id="user-type-label">User Type</InputLabel>
        <Select 
          label="User Type *"
          labelId="user-type-label"
          name="userType"
          value={formData?.userType}
          error={!!errors.userType}
          onChange={handleSelectChange}
        >
          <MenuItem value={"student"}>Student</MenuItem>
          <MenuItem value={"employee"}>Employee</MenuItem>
        </Select>
        {errors.userType && <FormHelperText>{errors.userType}</FormHelperText>}
      </FormControl>

      {formData?.userType == "employee" && (
        <FormControl error={!!errors.companyName}>
          <TextField
            onChange={handleChange} 
            name="companyName"
            id="company-name" 
            label="Company Name" 
            value={formData?.companyName}
            variant="outlined"
            required
            error={!!errors.companyName}
            helperText={errors.companyName}
            inputProps={{ maxLength: 60 }} 
          />
        </FormControl>
      )}

      {formData?.userType == "student" ? (
        <FormControl error={!!errors.division}>
          <TextField
            onChange={handleChange} 
            name="division"
            id="division" 
            value={formData?.division}
            label="Division" 
            variant="outlined"
            required
            error={!!errors.division}
            helperText={errors.division}
          />
        </FormControl>
      ) : (
        <FormControl error={!!errors.designation}>
          <TextField
            onChange={handleChange} 
            name="designation"
            id="designation" 
            label="Designation" 
            variant="outlined"
            value={formData?.designation}
            required
            error={!!errors.designation}
            helperText={errors.designation}
            inputProps={{ maxLength: 30 }}
          />
        </FormControl>
      )}

      {formData?.userType === "student" ? (
        <FormControl error={!!errors.studentId}>
          <TextField
            onChange={handleChange} 
            name="studentId"
            id="student-id" 
            label="Student ID" 
            variant="outlined"
            value={formData?.studentId}
            required
            error={!!errors.studentId}
            helperText={errors.studentId}
            inputProps={{ maxLength: 30 }}
          />
        </FormControl>
      ) : (
        <FormControl error={!!errors.employeeId}>
          <TextField
            onChange={handleChange} 
            name="employeeId"
            id="employee-id" 
            label="Employee ID" 
            variant="outlined"
            value={formData?.employeeId}
            required
            error={!!errors.employeeId}
            helperText={errors.employeeId}
            inputProps={{ maxLength: 30 }}
          />
        </FormControl>
      )}

      {formData?.userType == "student" && (
        <FormControl error={!!errors.instituteName}>
          <TextField
            onChange={handleChange} 
            name="instituteName"
            id="institute-name" 
            label="Institute Name"
            value={formData?.instituteName}
            variant="outlined"
            required
            error={!!errors.instituteName}
            helperText={errors.instituteName}
            inputProps={{ maxLength: 60 }} 
          />
        </FormControl>
      )}

      {formData?.userType === "employee" && (
        <FormControl error={!!errors.email}>
          <TextField
            onChange={handleChange} 
            name="email"
            id="email" 
            label="Email" 
            value={formData?.email}
            variant="outlined"
            required
            error={!!errors.email}
            helperText={errors.email}
            inputProps={{ maxLength: 100 }} 
          />
        </FormControl>
      )}

      <FormControl error={!!errors.phone}>
        <TextField
          onChange={handleChange} 
          name="phone"
          id="phone" 
          label="Phone *" 
          variant="outlined"
          value={formData?.phone}
          required
          error={!!errors.phone}
          helperText={errors.phone || "10-15 digits"}
        />
      </FormControl>

      <FormControl>
        <TextField 
          onChange={handleChange}
          name="term1"
          id="term1" 
          label="Term 1" 
          inputProps={{ maxLength: 100 }}
          variant="outlined"
          value={formData?.term1}
        />
      </FormControl>

      <FormControl>
        <TextField 
          onChange={handleChange}
          name="term2"
          id="term2" 
          label="Term 2" 
          variant="outlined"
          value={formData?.term2}
        />
      </FormControl>

      <FormControl>
        <TextField 
          onChange={handleChange}
          name="link"
          type="url"
          id="link" 
          label="Official Link" 
          variant="outlined"
          value={formData?.link}
          helperText="Include http:// or https://"
        />
      </FormControl>

      <FormControl error={!!errors.profilePhoto}>
        <TextField 
          onChange={handleChange}
          type="file"
          name="profilePhoto"
          id="profile-photo"
          variant="outlined"
          required
          error={!!errors.profilePhoto}
          helperText={errors.profilePhoto}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>
      <Button onClick={handleValidate} variant="contained">VALIDATE</Button>
    </Box>
  )
}