import { createContext } from "react"

const TeachingContext = createContext(null);
export const TechingContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <TeachingContext.Provider value={null}>
            {children}
        </TeachingContext.Provider>
    )
}