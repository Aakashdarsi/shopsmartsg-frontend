"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  const router = useRouter();

  // Dummy data for demonstration
  const dummyOrders = [
    {
      orderId: "12345",
      status: "CREATED",
      totalPrice: 50.0,
      createdDate: "2023-10-01T12:00:00Z",
      customerId: "cust123",
      useDelivery: true,
    },
    {
      orderId: "12346",
      status: "READY",
      totalPrice: 75.0,
      createdDate: "2023-10-02T14:00:00Z",
      customerId: "cust124",
      useDelivery: false,
    },
    {
      orderId: "12347",
      status: "COMPLETED",
      totalPrice: 100.0,
      createdDate: "2023-10-03T16:00:00Z",
      customerId: "cust125",
      useDelivery: true,
    },
    {
      orderId: "12348",
      status: "CANCELLED",
      totalPrice: 60.0,
      createdDate: "2023-10-04T18:00:00Z",
      customerId: "cust126",
      useDelivery: false,
    },
  ];

  // Fetch Merchant Order Requests
  useEffect(() => {
    const fetchMerchantOrderRequests = async () => {
      try {
        // Simulate API call with dummy data
        setOrders(dummyOrders);
      } catch (error) {
        console.error("Error fetching merchant order requests:", error);
      }
    };
    fetchMerchantOrderRequests();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      // Simulate API call
      setOrders((prevOrders) =>
          prevOrders.map((order) =>
              order.orderId === orderId ? { ...order, status } : order
          )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const ongoingOrders = orders.filter(
      (order) => order.status === "CREATED" || order.status === "READY" || order.status === "DELIVERY_ACCEPTED"
  );

  const pastOrders = orders.filter(
      (order) => order.status === "COMPLETED" || order.status === "CANCELLED" || order.status === "DELIVERY_PICKED_UP"
  );

  const renderButtons = (orderId, status, delivery) => {
    const buttonStyle = { width: "150px" }; // Fixed width for all buttons

    switch (status) {
      case "CREATED":
        return (
            <div className="flex flex-column align-items-end">
              <Button
                  label="Cancel Order"
                  className="p-button-danger m-3 mt-2"
                  onClick={() => updateOrderStatus(orderId, "CANCELLED")}
                  style={buttonStyle}
              />
              <Button
                  label="Order Ready"
                  className="p-button-success m-3"
                  onClick={() => updateOrderStatus(orderId, "READY")}
                  style={buttonStyle}
              />
            </div>
        );
      case "READY":
        return (
            <Button
                label="Order Picked Up"
                className="p-button-info"
                onClick={() => updateOrderStatus(orderId, "COMPLETED")}
                disabled={delivery}
                style={buttonStyle}
            />
        );
      case "COMPLETED":
        return (
            <Button
                label="Order Completed"
                className="p-button-secondary"
                disabled
                style={buttonStyle}
            />
        );
      case "CANCELLED":
        return (
            <Button
                label="Order Cancelled"
                className="p-button-secondary"
                disabled
                style={buttonStyle}
            />
        );
      default:
        return null;
    }
  };


  return (
      <div className="p-4">
        <h2>Ongoing Orders</h2>
        <div className="p-grid">
          {ongoingOrders.map((order) => (
              <div key={order.orderId} className="p-col-12 p-md-6 p-lg-4">
                <Card title={`Order ID: ${order.orderId}`} className="p-mb-4 mt-2">
                  <div className="flex flex-column">
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>Date: {new Date(order.createdDate).toLocaleDateString()}</p>
                    <p>Customer: {order.customerId}</p>
                    <Link href={`/merchant/orders/${order.orderId}`}>
                      View Order Details
                    </Link>
                    <p>
                      Delivery: {order.useDelivery ? "Partner Assisted" : "Self - Pickup"}
                    </p>
                    {renderButtons(order.orderId, order.status, order.useDelivery)}
                  </div>
                </Card>
              </div>
          ))}
        </div>
        <h2>Past Orders</h2>
        <div className="p-grid">
          {pastOrders.map((order) => (
              <div key={order.orderId} className="p-col-12 p-md-6 p-lg-4 mt-2">
                <Card title={`Order ID: ${order.orderId}`} className="p-mb-4">
                  <div className="flex flex-column">
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>Date: {new Date(order.createdDate).toLocaleDateString()}</p>
                    <p>Customer: {order.customerId}</p>
                    <Link href={`/merchant/orders/${order.orderId}` } className={"mb-2"}>
                      View Order Details
                    </Link>
                    {renderButtons(order.orderId, order.status, order.useDelivery)}
                  </div>
                </Card>
              </div>
          ))}
        </div>
      </div>
  );

};

export default Orders;