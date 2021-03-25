import React from 'react';
import {Dropdown, FormGroup, Label} from 'reactstrap';

export const DeviceList = (props) => {
    return (
        <FormGroup>
            <Label>Scegli un dispositivo fra quelli elencati:</Label>
            <Dropdown name="deviceList" onChange={(e) => props.selectDevice(e.target.value)}>
                {props.deviceList && props.deviceList.map((device)=>{
                    return <option value={device.address}>{device.deviceName}</option>
                })}
            </Dropdown>
        </FormGroup>
    );
}

export default DeviceList;