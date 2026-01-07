import React from 'react'

type Props = {
    stateB: any;
    info: any;
    header: any;
}

const CpnB = ({ info, header }: Props) => {
    // console.log("stateB",stateB);
    console.log("header", header);
    return (
        <div>CpnB
            {/* {header} */}
        </div>
    )
}
// export default CpnB
export default React.memo(CpnB);