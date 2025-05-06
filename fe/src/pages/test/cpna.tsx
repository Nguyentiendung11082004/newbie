import React from 'react'

type Props = { 
    stateA: any;
};

const CpnA = ({ stateA }: Props) => {
    console.log("stateA",stateA);
    return (
       <div>CpnA</div> 
    );
};

export default CpnA