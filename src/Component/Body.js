import React, {useState, useEffect} from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import {FaCaretUp,FaCaretDown,FaSearch} from "react-icons/fa";







function StockContainer() {
    const [text, setText] = useState("");
    const [stockData, setStockData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    
    function handleChange(event) {
        setText(event.target.value);
    }
    /* POST REQUEST FOR GRAPH DATA AND TABLE DATA */
    async function handleKeyPress(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          console.log("is Loading");
          await axios.post(
            "http://localhost:3001/postSearchData", 
            { search: text },
            {
              headers: {
                "Content-type": "application/json",
              },
            })
          .then(res=>{
            setStockData(res.data)})
            
          await axios.post(
            "http://localhost:3001/postSearchGraphData", 
              { search: text },
              {
                headers: {
                  "Content-type": "application/json",
                },
              }
          )
          .then(res=>{
            setGraphData(res.data.values)})
        console.log(graphData);
        console.log(stockData);
        }
    }

    /* POST REQUEST FOR GRAPH DATA AND TABLE DATA */
    async function handleClick() {
      await axios.post(
        "http://localhost:3001/postSearchData", 
        { search: text },
        {
          headers: {
            "Content-type": "application/json",
          },
        })
      .then(res=>setStockData(res.data))
        
      await axios.post(
        "http://localhost:3001/postSearchGraphData", 
          { search: text },
          {
            headers: {
              "Content-type": "application/json",
            },
          })
      .then(res=>{
        setGraphData(res.data.values)
      });
      console.log("code is working");
    }
    
    /* GET REQUEST FOR GRAPH DATA AND TABLE DATA */
    useEffect(()=> {
        async function getData() {
            await axios.get("http://localhost:3001/getSearchData")
            .then(res => {
                setStockData(res.data);
            });
        }

        async function getGraphData() {
            await axios.get("http://localhost:3001/getSearchGraphData")
            .then(res=> {
                setGraphData(res.data.values);
            });
        }
        getData();
        getGraphData();
    }, [])
    

    const series =  [{
        data: graphData.map((price)=>{
            return({
                x: price.datetime,
                y:[price.open,price.high,price.low,price.close]
            })
        })
      }]
  
  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }

    return(
        <div>
            <div className="header">
              <h1>Stock Screener</h1>
                <form>
                  <FaSearch className="search-icon" onClick={handleClick}/>
                  <input type="text" placeholder="Search ticker" name="search" onChange={handleChange} onKeyDown={handleKeyPress}></input>
                </form>
            </div>
                <div className="logo">
                  <h2>{stockData.name}</h2>
                  <h3>( {stockData.symbol} )</h3>
                  <h4>Description: {stockData.industry}</h4>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change%</th>
                            <th>Open</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stockData.symbol}</td>
                            <td>{stockData.price} {stockData.currency}</td>
                            <td style={{color: stockData.change>0? "green": "red"}}>{stockData.change}<span>{stockData.change>0?<FaCaretUp/>:<FaCaretDown/>}</span></td>
                            <td style={{color: stockData.changePercent>"0%"? "green": "red" }}>{stockData.changePercent}<span>{stockData.changePercent>"0%"?<FaCaretUp/>:<FaCaretDown/>}</span></td>
                            <td>{stockData.open} {stockData.currency}</td>
                            <td>{stockData.high} {stockData.currency}</td>
                            <td>{stockData.low} {stockData.currency}</td>
                            <td>{stockData.volume}</td>
                        </tr>
                    </tbody> 
                </table>
            <div className="graph">
              <Chart
                  options={options}
                  series={series}
                  type="candlestick"
                  width="60%"
              />
            </div>
        </div>
    );
}

export default StockContainer;