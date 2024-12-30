import BarcodeScannerComponent from 'react-qr-barcode-scanner'
import { useState } from 'react'


export default function Scanner() {
    const [data, setData] = useState('Not Found')

    return (
        <>
            <BarcodeScannerComponent 
                width={500}
                height={500}
                onUpdate={(err,result)=> {
                    if(result) setData(result.txt)
                    else setData('Not Found')
                }}
            />
            <p>{data}</p>

            
        </>
    )
}

