import React, { type ReactNode } from "react"; 

interface SubHeadings{
    children: ReactNode;
}

export default function SubHeading({children}: SubHeadings){
    return(
        <h2 className="sm:text-md font-bold py-2 text-black">
            {children}
        </h2>
    )
}