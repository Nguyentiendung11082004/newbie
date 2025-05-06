import React from 'react'

type Props = {
    stateB: any;
}

const CpnB = ({ stateB }: Props) => {
    console.log("stateB",stateB);
    return (
        <div>CpnB</div>
    )
}

export default CpnB