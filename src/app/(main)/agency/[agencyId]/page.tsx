import React from 'react'

type Props = {}

const SpecificAgencyPage = ({
    params,
}: {
    params: { agencyId: string }
    searchParams: { code: string }
}) => {
    return (
        <div>{params.agencyId}</div>
    )
}

export default SpecificAgencyPage