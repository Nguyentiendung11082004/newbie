import React, { useEffect, useState } from 'react'
import CpnA from './cpna'
import CpnB from './cpnb'

type Props = {}

const Test = (props: Props) => {
    console.log("cpn test mount")
    const [stateA, setStateA] = useState(1)
    const [stateB, setStateB] = useState(10)
    // console.log("stateA", stateA)
    // console.log("stateB", stateB)
    const hanndleClickA = () => {
        setStateA(stateA + 1)
        // console.log("Ngay sau setCounta:", stateA);
    }
    const hanndleClickB = () => {
        setStateB(stateB + 1)
        // console.log("Ngay sau setCountb:", stateB);
    }
    useEffect(() => {
        // hanndleClickA()
    }, [])

    const arr = [
        { id: 1, name: "a" }
    ];
    const item = { id: 2, name: "b" }

    const result = [...arr, item]
    const result1 = [...arr, { item }]
    const result2 = [...arr, { ...item }];
    console.log("result", result)
    console.log("result1", result1)
    console.log("result2", result2)
    return (
        <>
            <div>Test</div>
            <button onClick={hanndleClickA}>Doi a</button>
            <button onClick={() => hanndleClickB()}>Doi b</button>
            <CpnA stateA={stateA} />
            <CpnB stateB={stateB} />
        </>
    )
}

export default Test