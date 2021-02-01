const cart_producto = "carProductsId";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  LoadProductsCart();
});
function getProductsDb() {
  const url = "./../DB-Products.json";
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function loadProducts() {
  const products = await getProductsDb();
  let html = "";

  products.forEach((product) => {
    html += `
    <div class = "col-3 product-container">
            <div class = "card product">
                <img 
                    src="${product.image}" 
                    class= "card-img-top"
                    alt="${product.name}"
                />
               <div class = "card-body">
                   <h5 class = "card-tittle">${product.name}</h5>
                   <p class= "card-text">${product.extraInfo}</p>
                   <p class = "card-text">${product.price} € / unidad </p>
                   <button type= "button" class = "btn btn-primary btn-cart" onClick=(addProductsCart(${product.id}))>Añadir al carrito</button>
               </div> 
            </div>
        </div>
    `;
    console.log(products);
       
  });
  document.getElementsByClassName("products")[0].innerHTML = html;
}
function openCloseCart(){
    const containerCart = document.getElementsByClassName("cart-products")[0];
    console.log(containerCart.classList);

    containerCart.classList.forEach(item =>{
      if(item === "hidden"){
        containerCart.classList.remove("hidden");
        containerCart.classList.add("active");
      }else{
        containerCart.classList.remove("active");
        containerCart.classList.add("hidden");
      }
    })
}
function addProductsCart(idProduct){
  let arrayProductsId= [];
  let localStorageItems = localStorage.getItem(cart_producto);
  if(localStorageItems === null){
    arrayProductsId.push(idProduct);
    localStorage.setItem(cart_producto, arrayProductsId);
  }else{
    let productsId=  localStorage.getItem(cart_producto);
    if(productsId.length > 0){
      productsId += "," + idProduct;
    }else{
      productsId = idProduct;
    }
    localStorage.setItem(cart_producto, productsId);
  }
  LoadProductsCart();
}
async function LoadProductsCart(){
  const products = await getProductsDb();
  const localStorageItems = localStorage.getItem(cart_producto);
  let html = "";
  if(!localStorageItems){
    html = `
      <div class="cart-product empty">
        <p>Carrito vacio</p>
      </div>
      `;
  }else{
    const idProductsSplit = localStorageItems.split(',');
  const idProductsCart =  Array.from(new Set(idProductsSplit));
  idProductsCart.forEach(id => {
    products.forEach(product => {
      if(id == product.id){
        const quantity = counntDuplicatedId(id, idProductsSplit);
        const totalPrice =  product.price * quantity;
        html += `
          <div class = "cart-product">
           <img src= "${product.image}" alt= "${product.name}"/> 
           <div class= "cart-product-info">
              <span class = "quantity">${quantity}</span>
              <p>${product.name}</p>
              <p>${totalPrice.toFixed(2)}</p>
              <p class="change-quantity">
                <button onclick="decreaseQuantity(${product.id})">-</button>
                <button onclick="increaseQuantity(${product.id})">+</button>
              </p>
              <p class="cart-product-delete">
                <button onClick=(deleteProductCart(${product.id}))>Eliminar</button>
              </p>
           </div>
          </div>
        `;}
    })
  });
  }
  document.getElementsByClassName('cart-products')[0].innerHTML = html;
}
function deleteProductCart(idProduct){
  const idProductsCart = localStorage.getItem(cart_producto);
  const arrayProductCart = idProductsCart.split(',');
  const resultIDDelete = deleteAllIds(idProduct,arrayProductCart);
  
  if(resultIDDelete){
    let count = 0;
    let idsString = "";
    resultIDDelete.forEach(id =>{
      count ++;
      if(count <resultIDDelete.length){
        idsString += id + ",";
      }else{
        idsString += id;
      }
    });
    localStorage.setItem(cart_producto, idsString);
  }
  const idsLocalStorage = localStorage.getItem(cart_producto);
  if(!idsLocalStorage){
    localStorage.removeItem(cart_producto);
  }
  LoadProductsCart();
}
function increaseQuantity(idProduct){
  const idProductCart = localStorage.getItem(cart_producto);
  const arrayIdProductCart = idProductCart.split(",");
  arrayIdProductCart.push(idProduct);
  let count = 0;
  let idsString ="";
  arrayIdProductCart.forEach(id =>{
    count++;
    if(count < arrayIdProductCart.length){
      idsString += id + ",";
    }else{
      idsString += id;
    }
  });
  localStorage.setItem(cart_producto, idsString);
  LoadProductsCart();
}
function decreaseQuantity(idProduct){
  const idProductsCart = localStorage.getItem(cart_producto);
  const arrayIdProductsCart = idProductsCart.split(",");

  const deleteItem = idProduct.toString();
  let index = arrayIdProductsCart.indexOf(deleteItem);
  if(index > -1) {
    arrayIdProductsCart.splice(index, 1);
  }
    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
      count++;
      if(count < arrayIdProductsCart.length){
        idsString += id + ",";
      }else{
        idsString += id; 
      }
    });
    localStorage.setItem(cart_producto,idsString);
    LoadProductsCart();
}
function counntDuplicatedId(value, arrayIds){
  let count = 0;

  arrayIds.forEach(id =>{
    if(value == id){
      count++;
    }
  });
  return count;
}
function deleteAllIds(id, arrayIds){
  return arrayIds.filter(itemId =>{
    return itemId != id;
  });
}
