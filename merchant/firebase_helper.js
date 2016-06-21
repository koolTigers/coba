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

		function getAllProducts(callback) {
			//var ref = new firebase("https://coba-54f85.firebaseio.com/products");
			ref = firebase.database().ref('products')
			ref.on("value", function(snapshot) {
				//console.log(snapshot.val())
				callback(snapshot.val())
			});
		}

		function getProductsByName(name, callback) {
			ref = firebase.database().ref('products')
			ref.orderByKey().startAt(name).on("value", function(snapshot) {
				callback(snapshot.val())
			});
		}

		function getProductByBarcode(barcode, callback) {
			ref = firebase.database().ref('products')
			ref.orderByChild("barcode").equalTo(barcode).on("value", function(snapshot) {
				callback(snapshot.val())
			});
		}
