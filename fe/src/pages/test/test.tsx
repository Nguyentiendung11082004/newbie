import React, { useCallback, useEffect, useState } from 'react'
import CpnA from './cpna'
import CpnB from './cpnb'
import axios from 'axios'

type Props = {}

const Test = (props: Props) => {
    // console.log("cpn test mount")
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


    // Closure
    // for (var i = 0; i < 3; i++) {
    //     setTimeout(() => {
    //         console.log(i)
    //     }, 100)
    // }
    // for (let i = 0; i < 3; i++) {
    //     setTimeout(() => console.log(i), 100)
    //   }

    // console.log("1");

    setTimeout(() => {
        console.log("2");
    }, 2000);

    console.log("3");

    console.log("1");

    fetch("https://api.com/data")
        .then(res => {
            console.log("3 + ", res);
        });

    console.log('1');
    const getData = async () => {
        let res = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log("res", res)
    }
    getData()
    console.log("3");

    console.log('start');

    queueMicrotask(() => {
        console.log('microtask 1');
    });

    Promise.resolve().then(() => console.log('promise'));

    setTimeout(() => console.log('timeout'), 0);

    console.log('end');



    return (
        <>
            <div>Test</div>
            <button onClick={hanndleClickA}>Doi a</button>
            <button onClick={() => hanndleClickB()}>Doi b</button>
            {/* <CpnA stateA={stateA} /> */}
            {/* <CpnB stateB={stateB} /> */}


            {/* <CpnB info={{ value: stateB }} stateB={undefined} header={<h1>Hello</h1>} /> */}
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



// const handleSetForm = 
// const [quyTrinh, setQuyTrinh] = useState<any>()
// const handleSetForm = useCallback((value, prop, rowData, isArray) => {
//     if (isArray) {
//         let newObj = {};
//         prop.forEach((x, index) => {
//             newObj[x] = value[index];
//         });
//         setQuyTrinh((prev) => ({
//             ...prev,
//             listPhanCongCongViec: prev.listPhanCongCongViec?.map((x) => {
//                 if (rowData.Id) {
//                     if (x.Id === rowData.Id) {
//                         return {
//                             ...x,
//                             ...newObj,
//                         }
//                     }
//                 } else if (x.GUID === rowData.GUID) {
//                     return {
//                         ...x,
//                         ...newObj,
//                     };
//                 }
//                 return x;
//             }),
//         }));
//     } else {
//         setQuyTrinh((prev) => {
//             if (rowData) {
//                 const rs = prev.listPhanCongCongViec.map((e) => {
//                     if (e.GUID ? e.GUID === rowData.GUID : e.Id === rowData.Id) {
//                         return {
//                             ...e,
//                             [prop]: value
//                         }
//                     }
//                     return e;
//                 })
//                 return {
//                     ...prev,
//                     listPhanCongCongViec: rs
//                 }
//             } else {
//                 return {
//                     ...prev,
//                     [prop]: value
//                 }
//             }
//         })
//     }
// }, [])