"use client";
import React, { useState, useRef, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import { InputText } from "primereact/inputtext";

const Page = () => {
  const [merchantDetails, setMerchantDetails] = useState({
    productName: "",
    category: {
      categoryName: "",
      categoryDescription: "",
    },
    imageUrl: "",
    productDescription: "",
    originalPrice: 0,
    listingPrice: 0,
    availableStock: 0,
    merchantId: "",
    pincode: "",
  });
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [productPrice, setProductPrice] = useState(0);
  const [listingPrice, setListingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageurl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const toast = useRef(null);

  const accept = () => {
    toast.current?.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const onUpload = async (event) => {
    try {
      const file = event.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/images/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );
      setImageUrl(response.data);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Image Uploaded Successfully",
      });
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Upload Failed",
        detail: "Image Upload Failed, Please Try Again",
      });
      console.log(error); // Might Be helpful for FE LOGGING
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/categories`
        );
        setCategories([
          ...response.data,
          { categoryName: "others", categoryId: "others" },
        ]);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const getMerchantDetails = async () => {
      try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${userId}`
        );
        setMerchantDetails(response.data);
      } catch (error) {
        console.log("Merchant details fetch failed", error); // error
        toast.current.show({
          severity: "warn",
          summary: "Merchant Details Failed",
          detail: "Merchant Details fetching Failed!! Please try again",
        });
      }
    };
    getMerchantDetails();
  }, []);

  const createProduct = async () => {
    const dataObj = {
      productName: productName,
      category: {
        categoryName: categories.find((value) => value.categoryId === category)
            ?.categoryName,
        categoryDescription: categories.find(
            (value) => value.categoryId === category
        )?.categoryDescription,
      },
      imageUrl: imageurl,
      productDescription: productDescription,
      originalPrice: productPrice,
      listingPrice: listingPrice,
      availableStock: quantity,
      merchantId: merchantDetails.merchantId,
      pincode: merchantDetails.pincode,
    };
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/products`,
          dataObj
      );
      toast.current.show({
        severity: "success",
        summary: "Details updated successfully",
        detail: response.status,
      });
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Product Creation Failed",
        detail: "Please Try Again!!",
      });
      console.log("error", error); // error
    }
  };

  const categoryHandler = async () => {
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/categories`,
          {
            categoryName: newCategory,
            categoryDescription: newCategoryDescription,
          }
      );
      if (response.status == 200) {
        toast.current.show({
          severity: "success",
          summary: "Category created successfully",
          detail: response.status,
        });
        setCategories([...categories, response.data]);
        setNewCategory("");
        setNewCategoryDescription("");
      }
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Category Creation Failed",
        detail: "Please Try Again!!",
      });
      console.log("error", error); // error
    }
  };

  return (
      <div className="p-grid p-fluid">
        <Toast ref={toast} />
        <ConfirmDialog
            visible={visible}
            onHide={() => setVisible(false)}
            message="Are you sure you want to proceed?"
            header="Confirmation"
            icon="pi pi-exclamation-triangle"
            accept={accept}
            reject={reject}
            style={{ width: "50vw" }}
            breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
        />

        <div className="p-col-12">
          <h2 className={"liter-regular"}>Create Product</h2>
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 mt-2">
          <label htmlFor="productName">Product Name</label>
          <InputText
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 mt-2">
          <label htmlFor="productDescription">Product Description</label>
          <InputTextarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 mt-2">
          <label htmlFor="productPrice">Product Price</label>
          <InputNumber
              id="productPrice"
              value={productPrice}
              onValueChange={(e) => setProductPrice(e.value)}
          />
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 mt-2">
          <label htmlFor="listingPrice">Listing Price</label>
          <InputNumber
              id="listingPrice"
              value={listingPrice}
              onValueChange={(e) => setListingPrice(e.value)}
          />
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 mt-2">
          <label htmlFor="category">Category</label>
          <Dropdown
              id="category"
              value={category}
              options={categories.map((cat) => ({
                label: cat.categoryName,
                value: cat.categoryId,
              }))}
              onChange={(event) => {
                setCategory(event.value);
                setMerchantDetails((prev) => ({
                  ...prev,
                  category:
                      categories.find((cat) => cat.categoryId === event.value) || {},
                }));
              }}
          />
        </div>

        {category === "others" && (
            <>
              <div className="p-col-12 p-md-6 p-lg-4">
                <label htmlFor="newCategory">Category Name</label>
                <InputText
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>

              <div className="p-col-12 p-md-6 p-lg-4">
                <label htmlFor="newCategoryDescription">Category Description</label>
                <InputTextarea
                    id="newCategoryDescription"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
            </>
        )}

        <div className="p-col-12 p-md-6 p-lg-4 mt-1">
          <label htmlFor="quantity">Quantity</label>
          <InputNumber
              id="quantity"
              value={quantity}
              onValueChange={(e) => setQuantity(e.value)}
          />
        </div>

        <div className="p-col-12 p-md-6 p-lg-4 ">
          <label htmlFor="uploadImage">Upload Product Image</label>
          <FileUpload
              id="uploadImage"
              name="demo[]"
              url={`${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/images/upload`}
              onUpload={onUpload}
              multiple={false}
              accept="image/*"
              maxFileSize={1000000}
              emptyTemplate={<p>Drag and drop files to upload</p>}
          />
        </div>

        <div className="p-col-12 ">
          <Button
              onClick={createProduct}
              icon="pi pi-check"
              label="Create Product"
          />
        </div>
      </div>
  );
};

export default Page;