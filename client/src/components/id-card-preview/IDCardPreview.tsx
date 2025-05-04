import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Button, ButtonGroup, CircularProgress } from "@mui/material"
import { QRCodePreview } from "../qr-code/QRCodePreview"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IdCardFormData } from "../../types/userDetailsType";
import NO_PROFILE from '../../assets/no-profile-avatar.webp'
import { useEffect, useState, useRef } from "react";
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';

interface IDCardPreviewProps {
    previewData: IdCardFormData
    isDataValidated:boolean;
}

interface QRData {
    name: string;
    id: string;
}

export const IDCardPreview = ({ previewData,isDataValidated}: IDCardPreviewProps) => {
    const [qrData, setQRData] = useState<QRData>({ name: "", id: "" })
    const [isProcessingImage, setIsProcessingImage] = useState(false)
    const idCardRef = useRef<HTMLDivElement>(null)
    const dummyTandC = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, facilis."

    useEffect(() => {
        if(previewData?.name && (previewData?.employeeId || previewData?.studentId)){
            setQRData({
                name: previewData?.name || "",
                id: previewData?.userType === "student" 
                    ? previewData?.studentId || ""
                    : previewData?.employeeId || ""
            })
        }
    }, [previewData])

    const handlePrint = async () => {
        setIsProcessingImage(true);
        
        try {
          // Add small delay to ensure DOM updates
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!idCardRef.current) {
            throw new Error('Element not found');
          }
      
          // Use these options for better reliability
          const canvas = await html2canvas(idCardRef.current, {
            scale: 2, // Higher quality
            logging: true, // Helpful for debugging
            useCORS: true, // For external images
            allowTaint: true, // For external images
            // async: true, // Better for complex elements
            onclone: (clonedDoc) => {
              // Ensure all elements are visible in the clone
              const elements = clonedDoc.querySelectorAll('*');
              elements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.style.visibility = 'visible';
                }
              });
            }
          });
      
          const dataUrl = canvas.toDataURL('image/png');
          const printWin = window.open('', '_blank');
          
          if (!printWin) {
            throw new Error('Popup blocked - please allow popups for this site');
          }
      
          printWin.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>ID Card</title>
                <style>
                  body { margin: 0; padding: 0; }
                  img { max-width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" />
                <script>
                  // Trigger print after image loads
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      window.close();
                    }, 200);
                  };
                </script>
              </body>
            </html>
          `);
          
          printWin.document.close();
      
        } catch (error) {
          console.error('Print error:', error);
        //   alert('Failed to generate print preview: ' + error?.message);
        } finally {
          setIsProcessingImage(false);
        }
    };

    const handleDownload = async () => {
        if (!idCardRef.current) return
        
        setIsProcessingImage(true)
        try {
            const canvas = await html2canvas(idCardRef.current)
            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `${previewData?.name || 'id-card'}.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error('Error generating download:', error)
        } finally {
            setIsProcessingImage(false)
        }
    }

    console.log(isDataValidated,"isDatavalidated")
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 3,
            // p: 3,
            py:3,
            width:"70%"
        }}>
            <Box 
                ref={idCardRef}
                sx={{
                    width: '100%',
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    gap: 3,
                    py: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                {/* ID Card Front */}
                <Box sx={{
                    width: { xs: '100%', md: '400px' },
                    height: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    border: '4px solid #960756',
                    borderRadius: '12px',
                    position: 'relative'
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#000",
                            textAlign: "center",
                            p: "1rem",
                            fontWeight: 'bold',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {previewData?.userType === "student" 
                            ? previewData?.instituteName || "Institute Name" 
                            : previewData?.companyName || "Company Name"}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box sx={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: '3px solid #960756'
                        }}>
                            <img 
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }} 
                                src={
                                    previewData?.profilePhoto 
                                        ? URL.createObjectURL(previewData.profilePhoto) 
                                        : NO_PROFILE
                                }
                                alt="Profile" 
                                onLoad={() => {
                                    if (previewData?.profilePhoto) {
                                        URL.revokeObjectURL(URL.createObjectURL(previewData.profilePhoto))
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            color: "#000",
                            textAlign: "center",
                            fontWeight: "700",
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {previewData?.name || 'Full Name'}
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: "#000",
                            textAlign: "center",
                            fontFamily: 'monospace',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {previewData?.userType === "student" 
                            ? previewData?.division || "Division"
                            : previewData?.designation || "Designation"}
                    </Typography>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        justifyContent: "center",
                        bgcolor: "#960756",
                        color: "#FFF",
                        p: "5px 10px",
                    }}>
                        <Typography variant="subtitle1">
                            {previewData?.userType === "student" ? "S.ID : " : "E.ID : "}
                        </Typography>
                        <Typography variant="subtitle1">
                            {previewData?.userType === "student" 
                                ? previewData?.studentId || 'N/A'
                                : previewData?.employeeId || 'N/A'}
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 1,
                        pb: 2,
                        mt: 'auto'
                    }}>
                            <Box sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "0.5rem", 
                                justifyContent: "center" 
                            }}>
                                <Typography variant="body1">{"Phone: "}</Typography>
                                <Typography variant="body1">
                                    {previewData?.phone || '1234567890'}
                                </Typography>
                            </Box>
                            {previewData?.userType != "student" && <Typography 
                                variant="body1" 
                                sx={{
                                    textAlign: 'center',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {previewData?.email || 'your-email@example.com'}
                            </Typography>}
                    </Box>
                </Box>

                {/* ID Card Back */}
                <Box sx={{
                    width: { xs: '100%', md: '400px' },
                    height: '520px',
                    border: "4px solid #960756",
                    borderRadius: "6px",
                    position: "relative",
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                            <Box sx={{ 
                                display: "flex", 
                                justifyContent: "center", 
                                p: "1rem",
                                flexGrow: 1,
                                alignItems: 'center'
                            }}>
                                {qrData.name && qrData.id ? (
                                    <QRCodePreview data={qrData} />
                                ) : (
                                    <Typography variant="h5">QR Code Preview</Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography 
                                    variant="h6" 
                                    sx={{
                                        bgcolor: "#960756",
                                        color: "#FFF",
                                        p: "0.5rem 2rem",
                                        textAlign: 'center'
                                    }}
                                >
                                    Terms & Conditions
                                </Typography>
                            </Box>

                            <Box sx={{ 
                                color: "#000", 
                                flexGrow: 1
                            }}>
                                <List sx={{ p: 0 }}>
                                    <ListItem sx={{ display:"flex",alignItems:"center" }}>
                                        <ListItemIcon sx={{ minWidth: '24px', mt: '4px' }}>
                                            <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={previewData?.term1 || dummyTandC} 
                                            sx={{ fontSize: "0.8rem" }} 
                                        />
                                    </ListItem>
                                    <ListItem sx={{ display:"flex",alignItems:"center" }}>
                                        <ListItemIcon sx={{ minWidth: '24px', mt: '4px' }}>
                                            <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={previewData?.term2 || dummyTandC} 
                                            sx={{ fontSize: "0.8rem" }} 
                                        />
                                    </ListItem>
                                </List>
                            </Box>

                            <Box sx={{ 
                                display: "flex", 
                                justifyContent: "center", 
                                // p: 2,
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        textAlign: 'center',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {previewData?.link || 'https://www.companyname.com'}
                                </Typography>
                            </Box>
                </Box>
            </Box>

            {/* Action Buttons */}
            <ButtonGroup 
                variant="contained" 
                disabled={!isDataValidated && isProcessingImage}
                sx={{ 
                    mt: 2,
                    display:"flex",
                    alignItems:"center",
                    gridGap:"1rem"
                }}
            >
                <Button 
                    startIcon={isProcessingImage ? <CircularProgress size={20} /> : <PrintIcon />}
                    onClick={handlePrint}
                    disabled={!isDataValidated || isProcessingImage}
                >
                    Print
                </Button>
                <Button 
                    startIcon={isProcessingImage ? <CircularProgress size={20} /> : <DownloadIcon />}
                    onClick={handleDownload}
                    disabled={!isDataValidated || isProcessingImage}
                >
                    Download
                </Button>
            </ButtonGroup>
        </Box>
    )
}