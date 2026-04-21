// Firestore Helper Functions for Grand Slam Market
class FirestoreHelper {
    constructor(db) {
        this.db = db;
    }

    // Generic CRUD operations
    async addDocument(collection, data) {
        try {
            const docRef = await this.db.collection(collection).add({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getDocument(collection, docId) {
        try {
            const doc = await this.db.collection(collection).doc(docId).get();
            if (doc.exists) {
                return { success: true, data: { id: doc.id, ...doc.data() } };
            } else {
                return { success: false, error: 'Document not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateDocument(collection, docId, data) {
        try {
            await this.db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: new Date()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteDocument(collection, docId) {
        try {
            await this.db.collection(collection).doc(docId).delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCollection(collection, orderBy = null, limit = null) {
        try {
            let query = this.db.collection(collection);
            
            if (orderBy) {
                query = query.orderBy(orderBy);
            }
            
            if (limit) {
                query = query.limit(limit);
            }
            
            const snapshot = await query.get();
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async queryCollection(collection, field, operator, value) {
        try {
            const snapshot = await this.db.collection(collection)
                .where(field, operator, value)
                .get();
            
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Specific functions for Grand Slam Market
    async saveContactForm(formData) {
        const contactData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            message: formData.message,
            status: 'pending',
            type: 'contact'
        };
        
        return await this.addDocument('contacts', contactData);
    }

    async getContacts(status = null) {
        if (status) {
            return await this.queryCollection('contacts', 'status', '==', status);
        }
        return await this.getCollection('contacts', 'createdAt', 'desc');
    }

    async saveProduct(product) {
        const productData = {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            imageUrl: product.imageUrl || '',
            active: product.active !== false,
            type: 'product'
        };
        
        return await this.addDocument('products', productData);
    }

    async getProducts(category = null, activeOnly = true) {
        let query = this.db.collection('products').where('type', '==', 'product');
        
        if (activeOnly) {
            query = query.where('active', '==', true);
        }
        
        if (category) {
            query = query.where('category', '==', category);
        }
        
        try {
            const snapshot = await query.orderBy('name').get();
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return { success: true, data: products };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async saveOrder(orderData) {
        const order = {
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone || '',
            items: orderData.items,
            total: orderData.total,
            status: 'pending',
            deliveryAddress: orderData.deliveryAddress || '',
            type: 'order'
        };
        
        return await this.addDocument('orders', order);
    }

    async getOrders(status = null) {
        if (status) {
            return await this.queryCollection('orders', 'status', '==', status);
        }
        return await this.getCollection('orders', 'createdAt', 'desc');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirestoreHelper;
}
