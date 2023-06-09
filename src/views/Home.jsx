/* eslint react/prop-types: 0 */
import { useEffect, useState } from "react";
import Table from "../components/Table";


const URL_WEB_SOCKET = 'wss://stream.binance.com:9443/ws';
const request = {
    method: 'SUBSCRIBE',
    params: ['btcusdt@trade'],
    id: 1,
  };
const Home = () => {

    const [ws, setWs] = useState(null);
    const [trades, setTrades] = useState([])

    useEffect(()=>{
        const wsClient = new WebSocket(URL_WEB_SOCKET)
        wsClient.onopen = () => {
            setWs(wsClient)
            wsClient.send(JSON.stringify(request))
        }
        wsClient.onclose = () => {
            console.log('ws closed')
        }
        return () => {
            wsClient.close();
        }
    },[])

    console.log('ws',ws)
    console.log('trades',trades)

    useEffect(() => {
        if (ws) {
          ws.onmessage = (evt) => {
            const trade = JSON.parse(evt.data);
            const newTrades = [...trades];
            addTradeToList(trade, newTrades);
          };
        }
      }, [ws, trades]);
    
      const addTradeToList = (trade, newTrades) => {
        if (newTrades.length >= 30) {
          newTrades.shift();
          newTrades.push(trade);
          setTrades(newTrades);
        } else {
          newTrades.push(trade);
          setTrades(newTrades);
        }
      };
  return (
    <div className="app__home">
        <Table trades={trades} />
    </div>
  )
}

export default Home