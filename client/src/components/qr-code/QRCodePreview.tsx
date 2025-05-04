import QRCode from 'react-qr-code';

interface QRCodePreviewProps {
    data:{
        name:string;
        id:string;
    }
}
export const QRCodePreview = ({data}:QRCodePreviewProps) => {
    return <QRCode 
            value={`${data?.name}-${data?.id}`}
            size={200}
            level="H" // Error correction level (L, M, Q, H)
            bgColor="#ffffff"
            fgColor="#960756"
        />
}