export const fetchBranchData = async (endpointUrl: string) => (await fetch(endpointUrl)).json();
