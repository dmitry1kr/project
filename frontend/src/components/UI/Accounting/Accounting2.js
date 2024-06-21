import React, { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import 'primeicons/primeicons.css';
import { fetchDevice } from '../../../http/deviceAPI';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
locale('en');

const Accounting = () => {
    const [products, setProducts] = useState(null);
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
                const deviceData = await fetchDevice();
                setProducts(deviceData);
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
                </IconField>
            </div>
        );
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

    const header = renderHeader();

    return (
        <div className="card" style={{ width: '99vw'}}>
            <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                    globalFilterFields={['name_device', 'brand.name', 'type', 'status_accounting.status']} header={header} emptyMessage="Ничего не найдено.">
                <Column field="name_device" header="Наименование" filter filterPlaceholder="Поиск по наименованию" style={{ minWidth: '17rem' }} />
                <Column header="Бренд" filterField="brand.name" style={{ minWidth: '12rem' }} body={brandBodyTemplate} filter filterPlaceholder="Поиск по бренду" />
                <Column field="type" header="Тип" filter filterPlaceholder="Поиск по типу" style={{ minWidth: '14rem' }} />
                <Column field="status_accounting.quantity" header="Колличество" />
                <Column header="Наличие" filterField="status_accounting.status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                <Column field="price" header="Цена" style={{ minWidth: '10rem' }} />
            </DataTable>
        </div>
    );
}

export default Accounting;
