import React  from 'react';
import styles from "../Pagina.css";
import path from "path";
import {Link} from "react-router-dom";
import routes from "../../constants/routes.json";


export const Header = (props) => {
  return (<>
    <h1 className={styles.titoloApp} data-tclass='titoloApp'>
      T.<img width='45px' height='55px'
             src={path.join(process.resourcesPath, 'app', 'assets', 'Timon.png')}/>.Mon
      ©
      </h1>
      <div className="pull-right" style={{paddingTop: '20px'}}>
        <Link to={routes.CONFIGURATION}>
          <i className="fa fa-2x fa-cog"/>
        </Link>
      </div>
    <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Thermo Index Monitoring</h4>
</>);
}

export default Header;
