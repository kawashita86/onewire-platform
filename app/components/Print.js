import React, { Component } from 'react';

export default class Print extends Component {
  render() {
    const {fullName, medianHour, medianMonthly} = this.props;

    return (
      <div>
        <table>
          <tr>
            <td>Nome Cognome</td>
            <td>{fullName}</td>
          </tr>
          <tr>
            <td>Data inizio e Data fine</td>
            <td>{startDate} - {endDate}</td>
          </tr>
          <tr>
            <td>Media ore utilizzo</td>
            <td>{medianHour}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              <table>
                {Object.values(medianMonthly).map((i) =>
                  (<tr>
                    <td>{i}</td>
                    <td>{medianMonthly[i]}</td>
                  </tr>)
                )}
              </table>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
