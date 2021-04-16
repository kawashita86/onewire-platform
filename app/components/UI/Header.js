import React  from 'react';
import styles from "../Pagina.css";
import path from "path";


export const Header = (props) => {
  return (<>
    <h1 className={styles.titoloApp} data-tclass='titoloApp'>T.<img width='45px' height='55px'
                                                                    src={path.join(process.resourcesPath, 'app', 'assets', 'Timon.png')}/>.Mon
      ©</h1>
    <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Thermo Index Monitoring</h4>
  </>);
}

export default Header;
