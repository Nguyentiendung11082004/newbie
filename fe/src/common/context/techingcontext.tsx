import React, { createContext } from "react";
export const TechingContext = ({ children }: { children: React.ReactNode }) => {
    const TeachingContext = createContext(null);
    return (
        <TeachingContext.Provider value={null}>
            {children}
        </TeachingContext.Provider>
    )
}