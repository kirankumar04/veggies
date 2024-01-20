let cartBtn = document.querySelector(".fa-cart-shopping");
let body = document.querySelector("body");
let close = document.querySelector(".close");
let mainBtn = document.querySelector(".main-btn");
let menu_box = document.querySelector(".menu_box");
let shopping_cart = document.querySelector(".listCart");
let itemCount = document.querySelector(".fav-count");
let cartItems = [];
let listProducts = [];
cartBtn.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
close.addEventListener("click", function () {
  body.classList.remove("showCart");
});

// initApp = () => {
//     fetch('products.json')
//     .then(response => response.json())
//     .then(data => {
//         listProducts = data;
//         console.log(listProducts);
//     })
// }
// initApp();
const AddItems = () => {
  menu_box.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("menu_card");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
            <div class="menu_image">
            <img src=${product.image} >
        </div>

        <div class="small_card">
            <i class="fa-solid fa-heart"></i>
        </div>

        <div class="menu_info">
            <h2>${product.name}</h2>
            
            <h3>Rs${product.price}</h3>
            <div class="menu_icon">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
            </div>
            <a class="menu_btn">Add to cart</a>

        </div>
            `;
      menu_box.appendChild(newProduct);
    });
  }
};
menu_box.addEventListener("click", (event) => {
  let elementPos = event.target;
  if (elementPos.classList.contains("menu_btn")) {
    let prod_id = elementPos.parentElement.parentElement.dataset.id;
    addToCart(prod_id);
  }
});
const addToCart = (prod_id) => {
  let positionProductInCart = cartItems.findIndex((value) => value.id == prod_id);
  if (cartItems.length <= 0) {
    cartItems = [
      {
        id: prod_id,
        quantity: 1,
      },
    ];
  } else if (positionProductInCart < 0) {
    cartItems.push({
      id: prod_id,
      quantity: 1,
    });
  } else {
    cartItems[positionProductInCart].quantity++;
  }
  addItemToCartHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};
const addItemToCartHTML = () => {
  shopping_cart.innerHTML = '';
  let totalQunatity = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((cart) => {
      totalQunatity += cart.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = cart.id;
      let productPosition = listProducts.findIndex((item) => item.id == cart.id); 
      let info = listProducts[productPosition];
      console.log(info);
      newItem.innerHTML = `
            <div class="img">
                <img src="${info.image}" alt="">
            </div>
        <div class="name">
            ${info.name}
        </div>
        <div class="price">
            Rs${Math.round((info.price * cart.quantity)*100)/100}
        </div>
        <div class="quantity">
            <span class="minus">-</span>
            <span class="num">${cart.quantity}</span>
            <span class="plus">+</span>
        </div>
            `;
        shopping_cart.appendChild(newItem);
    });
      
  }
  itemCount.innerText = totalQunatity;
};
shopping_cart.addEventListener('click', (event) => {
  let elementPos = event.target;
  if(elementPos.classList.contains('plus') || elementPos.classList.contains('minus')){
    let prod_id = elementPos.parentElement.parentElement.dataset.id;
    let productid =  elementPos.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if(elementPos.classList.contains('plus')){
      type = 'plus';
    }
    updateCart(prod_id, type);
  }
});
const updateCart = (prod_id, type) => {
  let positionProductInCart = cartItems.findIndex((value) => value.id == prod_id);
  if(positionProductInCart >= 0){
    switch(type){
      case 'plus':
        cartItems[positionProductInCart].quantity++;
        break;
      default:
        let valueChange = cartItems[positionProductInCart].quantity - 1;
        if(valueChange > 0){
          cartItems[positionProductInCart].quantity = valueChange;
        }else{
          cartItems.splice(positionProductInCart, 1);
        }
        break;
        
    }
  }
  addItemToCartHTML();
  addCartToMemory();
};
initApp = async () => {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    listProducts = data;
    // console.log(listProducts);
    AddItems();
    if(localStorage.getItem('cartItems')){
      cartItems = JSON.parse(localStorage.getItem('cartItems'));
      addItemToCartHTML();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

initApp();
