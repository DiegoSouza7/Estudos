import React, { useState, useEffect } from 'react';
import { FormatDate, FormatOrderDate } from './lib/utils';

import axios from 'axios';

function App() {
  const [coinNames, setCoinNames] = useState([])
  const [convertFrom, setConvertFrom] = useState('BRL')
  const [convertTo, setConvertTo] = useState('USD')
  const [convertDate, setConvertDate] = useState(FormatDate(new Date()))
  const [valueConvertFrom, setValueConvertFrom] = useState(0)
  const [valueConvertTo, setValueConvertTo] = useState(0)
  const [valueConvert, setValueConvert] = useState(0)
  const [resultConvert, setResultConvert] = useState(0)

  useEffect(() => {
    axios.get('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$skip=0&$format=json')
      .then(response => {
        let result = response.data.value
        result.push({
          simbolo: 'BRL',
          nomeFormatado: 'Real'
        })
        setCoinNames(result)
      })
  }, [])

  function handleValueConvert(e) {
    setValueConvert(parseFloat(e.target.value))
  }

  function handleSelectDate(e) {
    const date = FormatOrderDate(e.target.value)
    setConvertDate(date)
  }

  function handleSelectConvertFrom(e) {
    setConvertFrom(e.target.value)
  }

  function handleSelectConvertTo(e) {
    setConvertTo(e.target.value)
  }

  function calculateValue() {
    if(valueConvert !== 0) {
      if(valueConvertTo !== 0 || valueConvertFrom !== 0) {
        if(convertTo === 'BRL') {
          setValueConvertTo(1.00)
        }

        if(convertFrom === 'BRL' && convertTo === 'BRL') {
          setResultConvert(valueConvert)
        } else if(convertFrom === 'BRL') {
          setResultConvert(valueConvert * valueConvertTo)
        } else if(convertTo === 'BRL') {
          setResultConvert(valueConvert / valueConvertFrom)
        } else {
          setResultConvert((valueConvertFrom / valueConvertTo) * valueConvert)
        }
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if(convertFrom !== 'BRL') {
      axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${convertFrom}'&@dataCotacao='${convertDate}'&$top=100&$format=json`)
      .then(response => {
        setValueConvertFrom(response.data.value[response.data.value.length - 1].cotacaoVenda)
      })
    }

    if(convertTo !== 'BRL') {
      axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${convertTo}'&@dataCotacao='${convertDate}'&$top=100&$format=json`)
      .then(response => {
        setValueConvertTo(response.data.value[response.data.value.length - 1].cotacaoVenda)
      })
    }

    calculateValue()
  }

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
          <input type="text" defaultValue={0} onChange={handleValueConvert} />
        </div>
        <div className="selectCurrency">
          <h2>Converter de:</h2>
          <select onChange={handleSelectConvertFrom} className="selectOptions" value={convertFrom} >
            {coinNames.map(
              coin => (
                <option key={coin.simbolo} value={coin.simbolo}>{`${coin.nomeFormatado} (${coin.simbolo})`}</option>
              )
            )}
          </select>
        </div>
        <div className="selectForCurrency">
          <h2>Para:</h2>
          <select onChange={handleSelectConvertTo} className="selectOptions" value={convertTo} >
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
        <p>{convertTo} {resultConvert}</p>
      </div>
    </main>
  );
}

export default App;