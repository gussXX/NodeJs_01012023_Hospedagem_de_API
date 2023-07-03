const image = (req, res, next) => {

    res.header("AMP-Same-Origin", 'true');
    res.header("content-type", 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    res.header('vary', 'Accept-Encoding');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-xss-protection', '0');
    next();
    
    data = {
        "items": []
    }
    const imageName = 'https://www.polifitema.com.br/wp-content/uploads/2017/02/success-icon-7-600x600.png'
    return res.sendFile(imageName, {root: __dirname});

    //return res.json(data);
}

module.exports = {
    image
}