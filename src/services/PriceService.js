import ApiService from './ApiService';

const getPriceByAccountId = (id) => {
    return ApiService.get('/prices?accountId=' + id);
}

const createPrice = (painting, preparingAluminum, preparingPlastic, preparingIron, soldering, disassembling, straightening) => {
    return ApiService.post('/prices', {painting, preparingAluminum, preparingPlastic, preparingIron, soldering, disassembling, straightening});
}

const updatePrice = (id, painting, preparingAluminum, preparingPlastic, preparingIron, soldering, disassembling, straightening) => {
    return ApiService.put('/prices/' + id, {id, painting, preparingAluminum, preparingPlastic, preparingIron, soldering, disassembling, straightening});
}

const PriceService = {
    getPriceByAccountId,
    createPrice,
    updatePrice
}

export default PriceService