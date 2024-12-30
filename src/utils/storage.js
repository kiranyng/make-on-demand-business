import localforage from 'localforage';

    const rawMaterialsKey = 'rawMaterials';
    const productsKey = 'products';
    const ordersKey = 'orders';
    const categoriesKey = 'categories';

    export const saveRawMaterial = async (material) => {
      try {
        const materials = await getRawMaterials();
        await localforage.setItem(rawMaterialsKey, [...materials, material]);
      } catch (error) {
        console.error('Error saving raw material:', error);
      }
    };

    export const getRawMaterials = async () => {
      try {
        const materials = await localforage.getItem(rawMaterialsKey);
        return materials || [];
      } catch (error) {
        console.error('Error getting raw materials:', error);
        return [];
      }
    };

    export const saveProduct = async (product) => {
      try {
        const products = await getProducts();
        await localforage.setItem(productsKey, [...products, product]);
      } catch (error) {
        console.error('Error saving product:', error);
      }
    };

    export const getProducts = async () => {
      try {
        const products = await localforage.getItem(productsKey);
        return products || [];
      } catch (error) {
        console.error('Error getting products:', error);
        return [];
      }
    };

    export const saveOrder = async (order) => {
      try {
        const orders = await getOrders();
        await localforage.setItem(ordersKey, [...orders, order]);
      } catch (error) {
        console.error('Error saving order:', error);
      }
    };

    export const getOrders = async () => {
      try {
        const orders = await localforage.getItem(ordersKey);
        return orders || [];
      } catch (error) {
        console.error('Error getting orders:', error);
        return [];
      }
    };

    export const saveCategory = async (category) => {
      try {
        const categories = await getCategories();
        await localforage.setItem(categoriesKey, [...categories, category]);
      } catch (error) {
        console.error('Error saving category:', error);
      }
    };

    export const getCategories = async () => {
      try {
        const categories = await localforage.getItem(categoriesKey);
        return categories || [];
      } catch (error) {
        console.error('Error getting categories:', error);
        return [];
      }
    };
