import React, { useState, useEffect } from 'react';
import FormatDate from './lib/utils'
import axios from 'axios';

function App() {
  const [coinNames, setCoinNames] = useState([])
  const [convertFrom, setConvertFrom] = useState('')
  const [convertTo, setConvertTo] = useState('USD')
  const [convertDate, setConvertDate] = useState(FormatDate(new Date()))
  const [valueConvertFrom, setValueConvertFrom] = useState(0)
  const [valueConvertTo, setValueConvertTo] = useState(0)
  const [resultConvert, setResultConvert] = useState(0)

  useEffect(() => {
    axios.get('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$skip=0&$format=json')
      .then(response => {
        setCoinNames(response.data.value)
      })
  }, [])

  useEffect(() => {
    setResultConvert(valueConvertTo)
  }, [valueConvertTo])

  function handleSelectDate(e) {
    setConvertDate(e.target.value)
  }

  function handleSelectConvertFrom(e) {
    setConvertFrom(e.target.value)
  }

  function handleSelectConvertTo(e) {
    setConvertTo(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if(convertFrom !== '') axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${convertFrom}'&@dataCotacao='01-18-2021'&$top=100&$format=json`)
    .then(response => {
      setValueConvertFrom(response.data.value[1].cotacaoVenda)
    })

    axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${convertTo}'&@dataCotacao='01-18-2021'&$top=100&$format=json`)
      .then(response => {
        setValueConvertTo(response.data.value[1].cotacaoVenda)
      })
  }

  useEffect(() => {
    console.log('coinNames', coinNames)
    console.log('convertFrom', convertFrom)
    console.log('convertTo', convertTo)
    console.log('convertDate', convertDate)
    console.log('valueConvertFrom', valueConvertFrom)
    console.log('valueConvertTo', valueConvertTo)
    console.log('resultConvert', resultConvert)
  }, [coinNames, resultConvert, convertTo, convertDate, valueConvertTo, valueConvertFrom, convertFrom])


  return (
    <main>
      <h1 className="title">Conversor de moedas</h1>
      <form onSubmit={handleSubmit}>
        <div className="dateQuote">
          <h2>Data da cotação</h2>
          <input type="date" onChange={handleSelectDate} />
        </div>
        <div className="valueConverted">
          <h2>Valor a ser convertido</h2>
          <input type="text" />
        </div>
        <div className="selectCurrency">
          <h2>Converter de:</h2>
          <select onChange={handleSelectConvertFrom} className="selectOptions">
            {coinNames.map(
              coin => (
                <option key={coin.simbolo} value={coin.simbolo}>{`${coin.nomeFormatado} (${coin.simbolo})`}</option>
              )
            )}
          </select>
        </div>
        <div className="selectForCurrency">
          <h2>Para:</h2>
          <select onChange={handleSelectConvertTo} className="selectOptions">
            {coinNames.map(
              coin => (
                <option key={coin.simbolo} value={coin.simbolo}>{`${coin.nomeFormatado} (${coin.simbolo})`}</option>
              )
            )}
          </select>
        </div>
        <div className="buttonConfirm">
          <button>Converter</button>
        </div>
      </form>
      <div className="result">
        <h1>O resultado da converção é:</h1>
        <p>R$ {resultConvert}</p>
      </div>
    </main>
  );
}

export default App;