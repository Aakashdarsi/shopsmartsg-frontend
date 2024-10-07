/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import {
  Column,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
  ColumnFilterElementTemplateOptions,
} from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { Tag } from "primereact/tag";
import { useRouter } from "next/navigation";
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from "primereact/tristatecheckbox";
import { CustomerService } from "./services/CustomerService";
import {getStaticProps} from "./services/CustomerService"
import "../admin/admin.main.css";
import axios from "axios";
interface Representative {
  name: string;
  image: string;
}

interface Country {
  name: string;
  code: string;
}

interface Customer {
  merchantName: string;
  merchantId: string;
}

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  "country.name": {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  date: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  balance: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  status: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
};

export default function AdvancedFilterDemo() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [representatives] = useState<Representative[]>([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ]);
  const [statuses] = useState<string[]>([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  const toast = useRef(null);
  const getSeverity = (status: string) => {
    switch (status) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  };

  // useEffect(() => {
  //   CustomerService.getCustomersMedium().then((data: Customer[]) => {
  //     setCustomers(getCustomers(data));
  //     setLoading(false);
  //   });
  //   initFilters();
  // }, []);
  useEffect(() => {
    getStaticProps().then((data) => {
      setCustomers(data.props.merchants);
    });
    initFilters();
  },[])
  const getCustomers = (data: Customer[]) => {
    return [...(data || [])].map((d) => {
      // @ts-expect-error - might be better
      d.date = new Date(d.date);

      return d;
    });
  };

  
  const blockUser = async (merchantId:string) => {
    const response = await axios.put(`http://localhost:8080/merchants/admin/blacklist/${merchantId}`);
    if (response.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Blocked",
        detail: "Merchant has been blocked successfully",
        life: 3000,
      });
      setCustomers(customers.map((c) => c.merchantId === merchantId? {...c, blacklisted: true } : c));
    }
  }
  
  const unblockUser = async (merchantId: string) => {
    const response = await axios.put(`http://localhost:8080/merchants/admin/unblacklist/${merchantId}`);
    if (response.status === 200) {
      toast.current.show({
        severity: "info",
        summary: "Unblocked",
        detail: "Merchant has been unblocked successfully",
        life: 3000,
      });
      setCustomers(customers.map((c) => c.merchantId === merchantId? {...c, blacklisted:false } : c));
    }
  }

  const deleteCustomer = async(rowId: string) => {
    const response = await axios.delete(`http://localhost:8080/merchants/${rowId}`);
    if (response.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Customer deleted successfully",
        life: 3000,
      });
      setCustomers(customers.filter((c) => c.merchantId!== rowId));
    }
    
  }
  const deleteCustomerPopUp = async(rowId:string) => {

    confirmDialog({
      message: "Are you sure you want to delete this customer?",
      header: "Confirm Delete",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteCustomer(rowId),
      reject: () => {},
    })
  }

  const blockUserPopUp =  (merchantId: string) => {
    confirmDialog({
    message: "Are you sure you want to block this customer?",
      header: "Confirm Block",
      icon: "pi pi-exclamation-triangle",
      accept: () => blockUser(merchantId),
      reject: () => {},
  })
}

  const unBlockUserPopup = (merchantId: string) => {
    confirmDialog({
      message: "Are you sure you want to unblock this customer?",
      header: "Confirm Unblock",
      icon: "pi pi-check",
      accept: () => unblockUser(merchantId),
      reject: () => {},
 
   })
 }
  const formatDate = (value: Date) => {
    return value.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    // @ts-expect-error - might be empty string
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue("");
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />

        <Button onClick={() => router.push("/admin/add")}>
          Create Merchant
        </Button>

        <p>Admin Portal</p>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />

          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };



  const filterClearTemplate = (options: ColumnFilterClearTemplateOptions) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        severity="secondary"
      ></Button>
    );
  };

  const filterApplyTemplate = (options: ColumnFilterApplyTemplateOptions) => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={options.filterApplyCallback}
        severity="success"
      ></Button>
    );
  };

  const filterFooterTemplate = () => {
    return <div className="px-3 pt-0 pb-3 text-center">Filter by Country</div>;
  };
  const representativeFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e: MultiSelectChangeEvent) =>
          options.filterCallback(e.value)
        }
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  const representativesItemTemplate = (option: Representative) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Customer) => {
    return formatDate(new Date());
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) =>
          options.filterCallback(e.value, options.index)
        }
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const balanceBodyTemplate = (rowData: Customer) => {
    return formatCurrency(4500);
  };

  const balanceFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e: InputNumberChangeEvent) =>
          options.filterCallback(e.value, options.index)
        }
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const statusBodyTemplate = (rowData: Customer) => {
    return <Tag value={"proposal"} severity={getSeverity("proposal")} />;
  };

  const statusFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e: DropdownChangeEvent) =>
          options.filterCallback(e.value, options.index)
        }
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const blockTemplate = (rowData) => {
    return rowData.blacklisted ? (
      <Button onClick={() => unBlockUserPopup(rowData.merchantId)}>Unblock</Button>
    ) : (
      <Button
        icon="pi pi-ban"
        label="Block"
        severity="danger"
        onClick={() => blockUserPopUp(rowData.merchantId)}
      />
    );
  };
  const statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };
  const router = useRouter();

  const verifiedUpdateTemplate = (id: string) => {
    return <Button onClick={() => router.push("/admin/update")}>Update</Button>;
  };
  const verifiedBodyTemplate = (rowData: Customer) => {
    return (
      <Button onClick={() => router.push("/admin/mermanage")}>
        View Details
      </Button>
    );
  };

  const verifiedFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Verified
        </label>
        <TriStateCheckbox
          id="verified-filter"
          value={options.value}
          onChange={(e: TriStateCheckboxChangeEvent) =>
            options.filterCallback(e.value)
          }
        />
      </div>
    );
  };


  const verifiedDeleteTemplate = (rowData) => {
   
    return (
      <Button
        type="button"
        icon="pi pi-trash"
        onClick={() => deleteCustomerPopUp(rowData.merchantId)}
        severity="danger"
      ></Button>
    );
  }

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={customers}
        paginator
        showGridlines
        rows={10}
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilterFields={[
          "name",
          "country.name",
          "representative.name",
          "balance",
          "status",
        ]}
        header={header}
        emptyMessage="No customers found."
        onFilter={(e) => setFilters(e.filters)}
      >
        <Column
          field="merchantName"
          header="Name"
          filter={true}
          filterField="merchantName"
          filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />

        <Column
          header="Date"
          filterField="date"
          dataType="date"
          style={{ minWidth: "10rem" }}
          body={dateBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          header="Balance"
          filterField="balance"
          dataType="numeric"
          style={{ minWidth: "10rem" }}
          body={balanceBodyTemplate}
          filter
          filterElement={balanceFilterTemplate}
        />
        <Column
          field="status"
          header="Status"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusFilterTemplate}
        />

        <Column
          field="View Details"
          header="View"
          bodyClassName="text-center"
          style={{ minWidth: "8rem" }}
          body={verifiedBodyTemplate}
          filter
          filterElement={verifiedFilterTemplate}
        />

        <Column
          field="Update"
          header="Update Details"
          bodyClassName="text-center"
          style={{ minWidth: "8rem" }}
          body={verifiedUpdateTemplate}
          filter
          filterElement={verifiedFilterTemplate}
        />
        <Column
          field="merchantId"
          header="Delete"
          bodyClassName="text-center"
          style={{ minWidth: "8rem" }}
          body={verifiedDeleteTemplate}
          filter
          filterElement={verifiedFilterTemplate}
        />
        <Column
          field="Block"
          header="Block"
          bodyClassName="text-center"
          style={{ minWidth: "8rem" }}
          body={blockTemplate}
         
          
        />
      </DataTable>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}