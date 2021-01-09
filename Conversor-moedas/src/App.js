import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [coinName, setCoinName] = useState([])
  const [convertFrom, setConvertFrom] = useState()
  const [convertTo, setConvertTo] = useState()
  const [convertDate, setConvertDate] = useState()
  const [resultConvert, setResultConvert] = useState(0)
  const [valueConvertFrom, setValueConvertFrom] = useState()
  const [valueConvertTo, setValueConvertTo] = useState()

  useEffect(() => {
    axios.get('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$skip=0&$format=json')
      .then(response => {
        setCoinName(response.data.value)
      })
  }, [])

  function handleSelectConvertFrom(e) {
    setConvertFrom(e.target.value)
  }

  function handleSelectConvertTo(e) {
    setConvertTo(e.target.value)
  }

  function handleSelectConvertTo(e) {
    setConvertDate(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$skip=0&$format=json&$select=${convertTo}`)
      .then(response => {
        setValueConvertTo(response.data)
      })
    console.log(setValueConvertTo)
  }





  return (
    <main>
      <h1 className="title">Conversor de moedas</h1>
      <form onSubmit={handleSubmit}>
        <div className="dateQuote">
          <h2>Data da cotação</h2>
          <input type="date"/>
        </div>
        <div className="valueConverted">
          <h2>Valor a ser convertido</h2>
          <input type="text"/>
        </div>
        <div className="selectCurrency">
          <h2>Converter de:</h2>
          <select onChange={handleSelectConvertFrom} className="selectOptions">
            {coinName.map(
              coin => (
                <option key={coin.simbolo} value={coin.simbolo}>{`${coin.nomeFormatado} (${coin.simbolo})`}</option>
              )
            )}
          </select>
        </div>
        <div className="selectForCurrency">
          <h2>Para:</h2>
          <select onChange={handleSelectConvertTo} className="selectOptions">
            {coinName.map(
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