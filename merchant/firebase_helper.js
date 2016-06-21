function insertProduct(name, description, category, type, unit, size, brand, barcode, photo, store) {
	var productID = firebase.database().ref().child('products').push().key;
	var product = {
		name: name,
		description: description,
		category: category,
		type: type,
		unit: unit,
		size: size,
		brand: brand,
		barcode: barcode,
		photo: photo
	}
	var updates = {};
	updates['/products/' + productID] = product
	firebase.database().ref().update(updates)
}
function insertShop(name){
	var shopID = firebase.database().ref().child('shops').push().key;
	var shop = {
		name: name
	}
	var updates = {};
	updates['/shops/' + shopID] = shop
	firebase.database().ref().update(updates)
}
function insertShopProduct(idProduct, idShop, price){
	var productShop = firebase.database().ref().child('products-shop').push().key;
	var product = {
		price: price
	}
	var updates = {};
	updates['/products-shop/' + idShop + '/' + idProduct + '/' + productShop] = product
	firebase.database().ref().update(updates)
}

function insertOrder(shop, products, address){
	var orderId = firebase.database().ref().child('orders').push().key;
	var order = {
		shop: shop,
		products: products,
		address: address
	}
	var updates = {};
	updates['/orders/' + orderId] = order
	firebase.database().ref().update(updates)
}

function getAllProducts(callback) {
	ref = firebase.database().ref('products')
	ref.once("value", function(snapshot) {
		callback(snapshot.val())
	});
}

function getProductsByName(name, callback) {
	ref = firebase.database().ref('products')
	ref.orderByKey().startAt(name).once("value", function(snapshot) {
		callback(snapshot.val())
	});
}

function getProductByBarcode(barcode, callback) {
	ref = firebase.database().ref('products')
	ref.orderByChild("barcode").equalTo(barcode).once("value", function(snapshot) {
		callback(snapshot.val())
	});
}

function getProductByBarcode(barcode, callback) {
	ref = firebase.database().ref('products')
	ref.orderByChild("barcode").equalTo(barcode).once("value", function(snapshot) {
		callback(snapshot.val())
	});
}

function getProductByCodeAndShop(barcode, shop, callback) {
	ref = firebase.database().ref('products')
	ref.orderByChild("barcode").equalTo(barcode).once("value", function(snapshot) {
		var product = snapshot.val()
		for (var pr in product) {
			if (product[pr].shop == shop) {
				callback(product[pr])
			}
		}
	});
}

function getOrdersByShop(shop, callback) {
	ref = firebase.database().ref('orders')
	ref.orderByKey().startAt(shop).on("child_added", function(snapshot) {
		callback(snapshot.val())
	});
}

function getOrdersByShop(shop, callback) {
	ref = firebase.database().ref('orders')
	ref.orderByChild('shop').startAt(shop).on("child_added", function(snapshot) {
		callback(snapshot.val())
	});
}