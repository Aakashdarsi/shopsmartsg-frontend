'use client'
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { Card } from 'primereact/card'
import { ProductService } from "./ProductService";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from "primereact/divider";

import { InputText } from "primereact/inputtext";
import { PrimeIcons } from "primereact/api";
import Link from "next/link";
import { AutoComplete } from "primereact/autocomplete";

const categories = [
  { label: 'All', value: null },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home', value: 'home' },
  // Add more categories as needed
];
const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pincode, setPincode] = useState('');
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const handleSearch = () => {
    // Implement search logic here
    console.log({
      searchTerm,
      selectedCategory,
      pincode,
      minPrice,
      maxPrice,
    });
    // Make backend call with search term and filters
  };
  const [products, setProducts] = useState([]);
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };
  const Footer = () => {
    return (

      <footer className="p-p-4 p-mt-4 p-2" style={{ backgroundColor: "#f5f5f5", color: "#333" }}>
        <div className="grid justify-between">

          <div className="col-3">
            <h3>Contact Us</h3>
            <p><i className="pi pi-map-marker" /> 123 Hung Mui Kui Terrace, Singapore, SG</p>
            <p><i className="pi pi-phone" /> (123) 456-7890</p>
            <p><i className="pi pi-envelope" /> support@shopsmart.com</p>
          </div>


          <div className="col-3">
            <h3>Customer Service</h3>
            <ul className="p-reset">
              <li><Link href="/help" className="p-mt-1">Help Center</Link></li>
              <li><Link href="/returns" className="p-mt-1">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="p-mt-1">Shipping Information</Link></li>
              <li><Link href="/faq" className="p-mt-1">FAQs</Link></li>
            </ul>
          </div>


          <div className="col-3">
            <h3>Quick Links</h3>
            <ul className="p-reset">
              <li><a href="/shop" className="p-mt-1">Shop</a></li>
              <li><a href="/about" className="p-mt-1">About Us</a></li>
              <li><a href="/contact" className="p-mt-1">Contact</a></li>
              <li><a href="/blog" className="p-mt-1">Blog</a></li>
            </ul>
          </div>


          <div className="col-3 p-md-3">
            <h3>Subscribe to Our Newsletter</h3>
            <div className="p-inputgroup">
              <InputText placeholder="Your email" />
              <Button icon="pi pi-envelope" label="Subscribe" />
            </div>
            <div className="p-mt-3">
              <Button icon={PrimeIcons.FACEBOOK} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.TWITTER} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.INSTAGRAM} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.LINKEDIN} className="p-button-rounded p-button-text" />
            </div>
          </div>
        </div>
        <Divider />
        <p className="p-text-center p-mt-2">© 2024 ShopSmart. All Rights Reserved.</p>
      </footer>
    );
  };

  const productTemplate = (product) => {
    return (
      <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
        <div className="mb-3">
          <img
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.name}
            className="w-6 shadow-2"
          />
        </div>
        <div>
          <h4 className="mb-1">{product.name}</h4>
          <h6 className="mt-0 mb-3">${product.price}</h6>
          <Tag
            value={product.inventoryStatus}
            severity={getSeverity(product)}
          ></Tag>
          <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
            <Button icon="pi pi-search" className="p-button p-button-rounded" />
            <Button
              icon="pi pi-star-fill"
              className="p-button-success p-button-rounded"
            />
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    ProductService.getProductsSmall().then((data) =>
      setProducts(data.slice(0, 9))
    );
  }, []);

  return (
    <div>
      <div className="grid  p-2">
        <div className="col-12  p-inputgroup">
          <Dropdown
            value={selectedCategory}
            options={categories}
            onChange={(e) => setSelectedCategory(e.value)}
            placeholder="Select a Category"
            className="mr-2"
          />
          <AutoComplete
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <Button icon="pi pi-search" onClick={handleSearch} />
        </div>
        <div className="col-12 md-6 p-inputgroup">
          <InputText
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className="mr-2"
          />
          <InputNumber
            value={minPrice}
            onValueChange={(e) => setMinPrice(e.value)}
            placeholder="Min Price"
            className="mr-2"
          />
          <InputNumber
            value={maxPrice}
            onValueChange={(e) => setMaxPrice(e.value)}
            placeholder="Max Price"
            className="mr-2"
          />
        </div>
      </div>
      <Card>
        <div>
          <div className="grid text-center">
            <div className="col-3 cursor-pointer">
              <Card>
                Groceries
              </Card>
            </div>
            <div className="col-3 cursor-pointer">
              <Card>
                Electronics
              </Card>
            </div>
            <div className="col-3 cursor-pointer">
              <Card>
                Clothing
              </Card>
            </div>
            <div className="col-3 cursor-pointer">
              <Card>
                Books
              </Card>
            </div>
          </div>
        </div>
      </Card>
      <br />
      <Card header={"Best Of ShopSmart"}>
        <div className="grid text-center">
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Amul Taja Milk</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Rice</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Noodles</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Smart Watches</p>
              <small>
                <b>Shop Now !</b>
              </small>
            </Card>
          </div>
        </div>
      </Card>
      <br />
      <br />
      <div className="grid">
        <div className="col-6">
          <Card>
            <div className="grid text-center">
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-6">
          <Card>
            <div className="grid text-center">
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
            </div>
          </Card>
        </div>
        <br />
        <br />
        <div className="grid">
          <div className="col-12">
            <Card>
              <Carousel
                value={products}
                numScroll={1}
                numVisible={6}
                responsiveOptions={responsiveOptions}
                itemTemplate={productTemplate}
              />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page