async function trabalhando_com_datas(req, res) {
    const requisition = req.body;

    const date = Date.now();
    const currentdate = new Date(date);

    const fuso = currentdate.getTimezoneOffset();
    const timeFuso = date - fuso;

    const atualTimeFuso = new Date(timeFuso);

    console.log('DATA ATUAL : ' + date)
    console.log('DATA FUSO : ' + fuso)
    console.log('DATA SUBTRAINDO : ' + timeFuso)
    console.log('=============================')
    console.log('HORA CONVERTIDA : ' + atualTimeFuso)
    console.log('HORA ISOSTRING : ' + atualTimeFuso.toISOString())

    res.status(200).json(timeFuso);
}

module.exports = { trabalhando_com_datas };
