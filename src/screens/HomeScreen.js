import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const productsCol = collection(db, "products");
      const snapshot = await getDocs(productsCol);
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Product Test List</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>SKU: {item.sku}</Text>
            <Text>
              Prices: {item.currentPrice} {item.priceUnit}
            </Text>
            <Text>Status: {item.isActive ? "Active" : "Inactive"}</Text>
          </View>
        )}
      />
      <Button title="Refresh Products" onPress={fetchProducts} />
    </View>
  );
}
