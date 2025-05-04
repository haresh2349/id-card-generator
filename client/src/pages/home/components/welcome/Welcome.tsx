import { Box, Button, Card, Typography } from "@mui/material"

export const Welcome = () => {
    return <Card sx={{width:"100%",height:"90%",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Box sx={{display:"flex",flexDirection:"column",gridGap:"2rem"}}>
            <Typography
                variant="h3"
                noWrap
                component="a"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                // fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                Welcome to your Smart ID Card Generator
            </Typography>
            <Box sx={{display:"flex",justifyContent:"center"}}>
            <Button variant="contained">Create ID Card</Button>
            </Box>
        </Box>
    </Card>
}