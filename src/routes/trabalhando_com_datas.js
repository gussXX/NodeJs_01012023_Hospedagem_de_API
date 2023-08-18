async function trabalhando_com_datas(req, res) {
    const requisition = req.body;

    // Consulta a hora atual em UTC
    const currentDateUTC = new Date();

    // Define o fuso horário desejado (por exemplo, "America/Sao_Paulo")
    const desiredTimezone = "America/Argentina/Buenos_Aires"; // Substitua pelo fuso horário desejado

    // Obtém o horário atual no fuso horário desejado
    const currentTimezoneDate = new Date(currentDateUTC.toLocaleString('en-US', { timeZone: desiredTimezone }));

    console.log(currentTimezoneDate); // Saída como objeto Date ajustado

    res.status(200).json();
}

module.exports = { trabalhando_com_datas };
