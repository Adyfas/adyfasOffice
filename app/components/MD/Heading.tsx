import React, { type ReactNode } from "react"; 

interface Headings{
    children: ReactNode;
}

export default function Heading({children}: Headings){
    return(
        <h1 className="text-xl sm:text-2xl font-bold py-2 text-black">
            {children}
        </h1>
    )
}