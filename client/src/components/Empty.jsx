import { useMutation } from "@apollo/client"
import { EMPTY_BOTTLES } from "../utils/mutations"


export default function Empty(){
    const [emptyBottles] = useMutation(EMPTY_BOTTLES)
    

    return(
        <>
            Hello 
        </>
    )
}