import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import './DevicePage.css'
import { updateQuantityDeviceInBasket } from '../../../http/basketAPI';


const Counter = ({ initialValue, maxDevice, onQuantityChange, idCart }) => {
    const [valueInput, setValueInput] = useState(initialValue);

    const setValuePlus = () => {
        if (valueInput < maxDevice) {
            setValueInput(valueInput + 1);
            onQuantityChange(valueInput + 1);
            updateQuantityDeviceInBasket(idCart, 'increase')
        }
    };

    const setValueMinus = () => {
        if (valueInput > 1) {
            setValueInput(valueInput - 1);
            onQuantityChange(valueInput - 1);
            updateQuantityDeviceInBasket(idCart, 'decrease')
        }
    };

    const handleChange = event => {
        const quantity = parseInt(event.target.value, 10);
        if (!isNaN(quantity) && quantity >= 1 && quantity <= maxDevice) {
            setValueInput(quantity);
            onQuantityChange(quantity);
        }
    };

    return (
        <InputGroup style={{ width: 150 }}>
            <Button variant="outline-secondary" onClick={setValueMinus}>
                ➖
            </Button>
            <Form.Control value={valueInput} min="1" max={maxDevice} onChange={handleChange} />
            <Button variant="outline-secondary" onClick={setValuePlus}>
                ➕
            </Button>
        </InputGroup>
    );
};

export default Counter
