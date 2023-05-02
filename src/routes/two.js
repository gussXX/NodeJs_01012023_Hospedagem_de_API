const two = (req, res, next) => {

    // Access-Control-Allow-Origin: https://amp.gmail.dev
    // AMP-Access-Control-Allow-Source-Origin: amp@gmail.dev
    // Access-Control-Expose-Headers: AMP-Access-Control-Allow-Source-Origin

    //response.set('field', 'value');

    const headers = [
        {
            "field" : 'Access-Control-Allow-Origin',
            "value" : 'https://amp.gmail.dev'
        }
    ]

    res.header("content-type", 'application/json');

    res.header("Access-Control-Allow-Origin", ["*"]);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header(headers[0].field, headers[0].value);
    res.header('AMP-Access-Control-Allow-Source-Origin', 'amp@gmail.dev');
    res.header('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    res.header('vary', 'Accept-Encoding');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-xss-protection', '0');
    next();
    
    data = {
        "items": [
            {
                "id": 1,
                "img": "https://image.mkt.esfera.com.vc/lib/fe3e15717564047b751075/m/6/592c04b0-67d1-45a1-b002-71f71b52d9e3.png",
                "question": "Voce conhece a esfera?",
                "text": "ficamos felizes!",
                "wrongtext": "Vamos te apresentar!",
                "c": "2",
                "answers": [
                    {
                        "ida": 1,
                        "answer": "sim"
                    },
                    {
                        "ida": 2,
                        "answer": "nao"
                    }
                ]
            },
            {
                "id": 2,
                "img": "https://image.mkt.esfera.com.vc/lib/fe3e15717564047b751075/m/6/592c04b0-67d1-45a1-b002-71f71b52d9e3.png",
                "question": "Voce conhece a esfera?",
                "text": "ficamos felizes!",
                "wrongtext": "Vamos te apresentar!",
                "c": "1",
                "answers": [
                    {
                        "ida": 1,
                        "answer": "sim"
                    },
                    {
                        "ida": 2,
                        "answer": "nao"
                    },
                    {
                        "ida": 3,
                        "answer": "vou ver e te aviso"
                    },
                    {
                        "ida": 4,
                        "answer": "irineu"
                    }
                ]
            },
            {
                "id": 3,
                "img": "https://image.mkt.esfera.com.vc/lib/fe3e15717564047b751075/m/6/592c04b0-67d1-45a1-b002-71f71b52d9e3.png",
                "question": "Voce conhece a esfera?",
                "text": "ficamos felizes!",
                "wrongtext": "Vamos te apresentar!",
                "c": "1",
                "answers": [
                    {
                        "ida": 1,
                        "answer": "sim"
                    },
                    {
                        "ida": 2,
                        "answer": "nao"
                    }
                ]
            }
        ]
    }

    return res.json(data);
}
//
module.exports = {
    two
}