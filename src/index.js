import React from "react";
import ReactDOM from "react-dom";
import crypto from "crypto";

import "./styles.css";

const TILES = [
  { number: 0, color: "white" },
  { number: 11, color: "black" },
  { number: 5, color: "red" },
  { number: 10, color: "black" },
  { number: 6, color: "red" },
  { number: 9, color: "black" },
  { number: 7, color: "red" },
  { number: 8, color: "black" },
  { number: 1, color: "red" },
  { number: 14, color: "black" },
  { number: 2, color: "red" },
  { number: 13, color: "black" },
  { number: 3, color: "red" },
  { number: 12, color: "black" },
  { number: 4, color: "red" }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      server_seed: "",
      amount: 2662
    };
  }
  render() {
    // an example with 10 seeds

    const chain = [this.state.server_seed];

    for (let i = 0; i < this.state.amount; i++) {
      chain.push(
        crypto
          .createHash("sha256")
          .update(chain[chain.length - 1])
          .digest("hex")
      );
    }

    // the hash of bitcoin block 570120 (https://medium.com/@blazedev/blaze-com-double-seeding-event-d3290ef13454)
    const clientSeed =
      "0000000000000000002aeb06364afc13b3c4d52767e8c91db8cdb39d8f71e8dd";

    return (
      <div className="App">
        <h3>Enter the server seed of your game</h3>
        <input
          value={this.state.server_seed}
          onChange={e => this.setState({ server_seed: e.target.value })}
        />
        <br />
        <br />
        <h3>Enter the # of games to view before this one</h3>
        <input
          value={this.state.amount}
          onChange={e => this.setState({ amount: e.target.value })}
        />

        <hr />
        <h1>Double rolls:</h1>

        {!this.state.server_seed || this.state.server_seed.length !== 64 ? (
          <h3 style={{ color: "red" }}>
            Please enter a server seed to view this table
          </h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Seed</th>
                <th>Hash (hmac with client seed)</th>
              </tr>
            </thead>
            <tbody>
              {chain.map((seed, index) => {
                const hash = crypto
                  .createHmac("sha256", seed)
                  .update(clientSeed)
                  .digest("hex");

                // roulette number from 0-15
                const n = parseInt(hash, 16) % 15;

                const tile = TILES.find(t => t.number === n);

                return (
                  <tr>
                    <td style={{ color: tile.color }}>
                      {tile.color.slice(0, 1).toUpperCase() +
                        tile.color.slice(1)}{" "}
                      {n}
                    </td>
                    <td>{seed}</td>
                    <td>{hash}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
