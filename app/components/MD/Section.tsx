import React, { type ReactNode } from "react"; 

interface Sections{
    children: ReactNode;
}

export default function Section({children}: Sections){
    return(
        <section className="p-2">
            {children}
        </section>
    )
}