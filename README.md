# MyShopping Site

A full-stack e-commerce platform where users can browse products, manage shopping carts, create wishlists, and complete purchases.  
Built with a React frontend, Express/Node backend, MongoDB database.

---

## Demo Link

[Live Demo](https://major-project1-front-end.vercel.app/)  

---

## Quick Start

```bash
git clone https://github.com/Mourya7603/MajorProject1-FrontEnd.git
cd shopping-site
npm install
npm run dev      # or `npm start` / `yarn dev`
```
---

## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB

---

## Demo Video
Watch a walkthrough (5–7 minutes) of all major features of this app:  
[Video Link](https://drive.google.com/file/d/1LinqJW0J0t_cYVyJvSplpYRlUautfzX7/view?usp=sharing) 

---

## Features
**Home**
- Displays featured products and categories
- Navigation to all sections of the site

**Product Browsing**
- Browse all products with filtering options
- Search products in real-time
- Paginated product listings

**Product Details**
- View detailed product information (images, descriptions, specifications)
- Add products to cart or wishlist

**Shopping Cart**
- Add/remove products from cart
- Adjust quantities
- View order summary

**Wishlist Management**
- Save favorite products for later
- Move items from wishlist to cart

**User Profile**
- Manage personal information
- View order history

**Address Management**
- Save multiple shipping addresses
- Set default address for checkout

---

## API Reference

### **GET	/api/products**<br>	 
List all products<br>	 
Sample Response:<br>
```[{ _id, name, price, category, image, ... }, …]```

### **GET	/api/products/:id**<br>	 	
Get details for one product<br>		
Sample Response:<br>
```{ _id, name, price, description, images, ... }```

### **GET	/api/products/category/:category**<br>	 	
Get products by category<br>		
Sample Response:<br>
```[{ _id, name, price, image, ... }, …]```

### **POST	/api/products**<br> 	
Create a new product (admin protected)<br>	
Sample Response:<br>
```{ _id, name, price, category, ... }```

### **POST	/api/cart**<br> 	
Add item to cart (protected)<br>	
Sample Response:<br>
```{ _id, userId, items, total, ... }```

### **GET	/api/cart**<br> 	
Get user's cart (protected)<br>	
Sample Response:<br>
```{ _id, userId, items, total, ... }```

### **POST	/api/wishlist**<br> 	
Add item to wishlist (protected)<br>	
Sample Response:<br>
```{ _id, userId, items, ... }```

### **POST	/api/orders**<br> 	
Create a new order (protected)<br>	
Sample Response:<br>
```{ _id, userId, items, total, status, ... }```

---

## Contact
For bugs or feature requests, please reach out to magalapallimourya@gmail.com
