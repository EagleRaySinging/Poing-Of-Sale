// 宣告變數
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const submitButton = document.querySelector("#submit-button");


// 菜單資料
let productData = [];
let cartItems = [];
let total = 0;

// 將產品加入菜單function
function displayProduct(products) {
  let menuContent = "";
  products.forEach(function (product) {
    menuContent += `<div class="col-3" id=${product.id}>
                <div class="card" id=${product.id} >
          <img src="${product.imgUrl}" class="card-img-top" id=${product.id} alt="...">
          <div class="card-body" id=${product.id}>
            <h5 class="card-title" id=${product.id}>${product.name}</h5>
            <p class="card-text" id=${product.id}>${product.price}</p>
            <a id=${product.id} href="#" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>`;
  });
  menu.innerHTML = menuContent;
}

// 產品加入購物車＋計算總金額function
function addToCart(event) {
  const id = event.target.id;
  const addedProduct = productData.find((product) => product.id === id);
  const name = addedProduct.name;
  const price = addedProduct.price;
  const targetItem = cartItems.find((item) => item.id === id);
  if (!targetItem) {
    cartItems.push({
      id,
      name,
      price,
      quantity: 1
    });
  } else {
    targetItem.quantity++;
  }
  //畫面顯示購物車清單
  //map會顯示條列HTML格式的商品，但中間會自動補","，故畫面會多出一個","的HTML
  //此時加入join語法，可去掉多出來的","
  cart.innerHTML = cartItems
    .map(
      (item) => `<li class="list-group-item">
        <span>${item.name}</span> X <span>${item.quantity}</span> 小計：
        <span>${item.price * item.quantity}</span>
        <i class="fa-solid fa-trash-can trashcan"></i>
        </li>`
    )
    .join("");
  //計算總金額
  calculateTotal(price);
}

// 計算總金額function
function calculateTotal(amount) {
  total += amount;
  totalAmount.textContent = total;
}

// 送出訂單function
function submit() {
  if (cart.textContent.trim() === "") {
    alert("不買點東西嘛~客倌(≧д≦ヾ)？");
  } else {
    const cartList = cartItems.map(
      (cartItem) => `${cartItem.name} X ${cartItem.quantity}`
    );
    alert(`確定購買: \n${cartList}\n總金額: ${total}\n感謝客倌消費(・∀・)`);
  }

  reset()
}

// 訂單送出後直接reset清空購物車
function reset() {
  cartItems = []
  total = 0
  cart.innerHTML = "";
  totalAmount.textContent = "--";
}

// 事件監聽器
menu.addEventListener("click", addToCart);
submitButton.addEventListener("click", submit);

cart.addEventListener("click", (e) => {
const target = e.target
  if (target.classList.contains("trashcan")) {
    // html結構上加入span，建立巢狀關係，儲存比對資訊ex: name
    const name = target.parentElement.children[0].textContent;
    // cartItems為陣列，使用findIndex陣列函示比對名字，並從陣列移除splice
    const targetItemIndex = cartItems.findIndex((item) => item.name === name);
    cartItems.splice(targetItemIndex, 1)
    // 重新計算金額
    total -= Number(target.parentElement.children[2].textContent)
    totalAmount.textContent = total
    // 移除該清單內容
    target.parentElement.remove()
  }
})


// get API產品資料
axios
  .get("https://ac-w3-dom-pos.firebaseio.com/products.json")
  .then(function (res) {
    productData = res.data;
    displayProduct(productData);
  })
  .catch(function (err) {
    console.log(err);
  });
