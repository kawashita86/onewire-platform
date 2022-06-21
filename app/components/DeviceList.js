import React from 'react';
import {Button, Col, FormGroup, InputGroup, InputGroupAddon, Label} from 'reactstrap';

export const DeviceList = (props) => {
    const retrieveDevices = () => {
      if(props.loading) return false;
      props.retrieveDeviceList();
    }
    return (
      props.deviceList && props.deviceList.length !== 0 ?
        <FormGroup style={{width: "100%"}}>
            <Label>Scegli un iButton fra quelli elencati:</Label>
           <InputGroup>
            <select defaultValue={props.selectedDevice} className="form-control" name="deviceList" onChange={(e) => props.selectDevice(e.target.value)}>
                {props.deviceList && props.deviceList.map((device)=>{
                  return <option
                      key={device.adapterDetail+'_'+device.address} value={device.adapterDetail+'_'+device.address}>{device.name} - {device.description}</option>
                })}
            </select>
             <InputGroupAddon addonType="append">
               <Button
                 aria-label="Ricarica dispositivi"
                 onClick={() => retrieveDevices()}
                 className="btn-info">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={props.loading ? 'loading-spin':''}>
                    <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                   </svg>
               </Button>
             </InputGroupAddon>
          </InputGroup>
        </FormGroup> :
        <Col md={12}>
        <FormGroup>
          <Button
            aria-label="Ricarica dispositivi"
            onClick={() => retrieveDevices()}
            className="btn-info text-left">
            <span style={{marginRight: "8px"}}>
              Clicca qui per aggiornare la lista di iButton
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={props.loading ? 'loading-spin':''}>
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
            </svg>
          </Button>
        </FormGroup>
        </Col>
    );
}

export default DeviceList;
