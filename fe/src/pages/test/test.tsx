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

    // const arr = [
    //     { id: 1, name: "a" }
    // ];
    // const item = { id: 2, name: "b" }

    // const result = [...arr, item]
    // const result1 = [...arr, { item }]
    // const result2 = [...arr, { ...item }];
    // console.log("result", result)
    // console.log("result1", result1)
    // console.log("result2", result2)

    // const info = useMemo(() => ({ value: stateB }), [stateB]); th1
    return (
        <>
            <div>Test</div>
            <button onClick={hanndleClickA}>Doi a</button>
            <button onClick={() => hanndleClickB()}>Doi b</button>
            <CpnA stateA={stateA} />
            {/* <CpnB stateB={stateB} /> */}


            <CpnB info={{ value: stateB }} stateB={undefined}  header={<h1>Hello</h1>}  />
        </>
    )
}

export default Test

// 1. Nếu trong CpnB bạn truyền vào một object props thay vì primitive (stateB) thì chuyện gì xảy ra với React.memo?

// Shallow compare nghĩa là:
// Với giá trị nguyên thủy (primitive) như number, string, boolean, null, undefined → so sánh bằng ===.
// Với object / array / function → so sánh reference (địa chỉ trong bộ nhớ).

// Lần render trước: props.stateB = 10
// Lần render sau: props.stateB = 10
// So sánh 10 === 10 ✅ → giống nhau → memo không re-render.

// Lần render trước: props.info trỏ đến object A trong bộ nhớ.
// Lần render sau (dù stateB không đổi): React vẫn tạo object mới → trỏ đến object B trong bộ nhớ.
// So sánh A === B ❌ → khác nhau → memo buộc re-render.

// const info = useMemo(() => ({ value: stateB }), [stateB]);
// <CpnB info={info} />