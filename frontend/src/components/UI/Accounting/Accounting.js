import React, { useEffect, useState, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { fetchDevice } from '../../../http/deviceAPI'
import { getAllOrder } from '../../../http/orderAPI';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { InputNumber } from 'primereact/inputnumber';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';


import 'primeicons/primeicons.css';
import { editPriceAndQuantity } from '../../../http/managerAPI';

const Accounting = () => {
   
    const [products, setProducts] = useState(null);
    
    const [orders, setOrders] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name_device: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'brand.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        type: { value: null, matchMode: FilterMatchMode.EQUALS },
        'status_accounting.status': { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [statuses] = useState(['в наличии', 'осталось мало', 'закончился']);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const getSeverity = (status) => {
        switch (status) {
            case 'в наличии':
                return 'success';
            case 'осталось мало':
                return 'warning';
            case 'закончился':
                return 'danger';
            default:
                return null;
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const deviceData = await fetchDevice();
                const orderData = await getAllOrder(); // Запрос для получения заказов
                const productsWithOrders = deviceData.map(device => ({
                    ...device,
                    orders: orderData.filter(order => order.order_devices.some(od => od.device.id === device.id))
                }));
                setProducts(productsWithOrders);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onRowEditComplete = (e) => {
        console.log(e)
        let _products = [...products];
        let { newData, index } = e;
        console.log(e)
        _products[index] = newData;

        setProducts(_products);
        try {
            editPriceAndQuantity(newData)
        } catch (error) {
            console.log(error)
        }
        
    };

    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="RUB" locale="en-US" minFractionDigits={2}/>;
    };

    const textEditor = (options) => {
        return <InputText type="text"  value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    

    const brandBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt={rowData.brand.name} src={process.env.REACT_APP_API_URL + '/media/' + rowData.brand.image} width="32" />
                <span>{rowData.brand.name}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_accounting.status} severity={getSeverity(rowData.status_accounting.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Выберите статус" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    const amountBodyTemplate = (rowData) => {
        return rowData.total_amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getOrderSeverity(rowData)} />;
    };

    const getOrderSeverity = (order) => {
        switch (order.status) {
            case 'Оплачен':
                return 'success';
            case 'Не оплачен':
                return 'danger';
            case 'В обработке':
                return 'warning';
            default:
                return null;
        }
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating_device.mean_rating} readOnly cancel={false} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={process.env.REACT_APP_API_URL + '/media/' + rowData.image_device.split("/media/")[1]} alt={rowData.image_device} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const rowExpansionTemplate = (data) => {

        const header_order =  (
            <div className="flex flex-wrap justify-content-end gap-3">
                <h5>Заказан '<span style={{color: '#702DFF'}}>{data.name_device}</span>' в:</h5>
            </div>
                
            
        )
        return (
            <div className="p-3">
                
                <DataTable value={data.orders} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} header={header_order}>
                    <Column field="number_order" header="Номер заказа" sortable />
                    <Column field="date_order" header="Дата заказа" sortable />
                    <Column field="total_amount" header="Общая сумма заказа" body={amountBodyTemplate} sortable />
                    <Column field="status" header="Статус" body={statusOrderBodyTemplate} sortable />
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-3">
            
            <IconField iconPosition="left" style={{marginBottom: 7}}>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
            </IconField>
            <Button label="Развернуть всё" onClick={() => setExpandedRows(products.reduce((acc, product) => ({ ...acc, [product.id]: true }), {}))} text />
            <Button label="Свернуть всё" onClick={() => setExpandedRows(null)} text />
        </div>
    );

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    return (
        <div className="card" style={{width: '90vw'}}>
            
            <Toast ref={toast} />
            <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={['name_device', 'brand.name', 'type', 'status_accounting.status']} header={header} emptyMessage="Ничего не найдено."
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                
                onRowEditComplete={onRowEditComplete}
                editMode="row"
                >
                <Column field="" header="" body={imageBodyTemplate}></Column>
                <Column expander style={{ width: '5rem' }} />
                <Column field="name_device" header="Наименование" filter filterPlaceholder="Поиск по наименованию" style={{ minWidth: '17rem' }} />
                <Column header="Бренд" filterField="brand.name" style={{ minWidth: '17rem' }} body={brandBodyTemplate} filter filterPlaceholder="Поиск по бренду" />
                <Column field="type" header="Тип" filter filterPlaceholder="Поиск по типу" style={{ minWidth: '14rem' }} />
                <Column field="status_accounting.quantity" header="Колличество" sortable editor={(options) => textEditor(options)}/>
                <Column field="price" header="Цена" style={{ minWidth: '10rem' }} sortable editor={(options) => priceEditor(options)}/>
                <Column field="rating" header="Отзывы" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Наличие" filterField="status_accounting.status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>

            
        </div>
    );
}

export default Accounting;
