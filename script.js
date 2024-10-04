'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Amritha B Raj',
  movements: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000],
  interestRate: 2.4,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Creating DOM  Element /// Bankist////

const calcDisplayMovement = function (movements,sort=false) {
  containerMovements.innerHTML = '';
  // const movs=sort ? movements.slice().sort((a,b) => a-b) :movements
  const movs=sort ? movements.slice().sort((a,b) => a-b) : movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // const date=Math.trunc(Math.random()*30);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
}
// calcDisplayMovement(account1.movements);

// reduce
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account2.movements);
//////////// Computing Usernames /////////////

// const name=`A////m/////r////it//////ha B// R///a////j`;

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name =>
      name[0]
    ).join('');
  });
};

createUserName(accounts);
// /// IN ////////// OUT /////////////INTERST //////////////

const calcDisplaySummery = function (acc) {
  const summeryin = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${summeryin}€`
  // console.log(summeryin);
  const summeryout = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(summeryout)}€`
  // console.log(summeryout);
  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummery(account1.movements);

//////////// CREATE AN LIGIN INPUT 
const update = function (acc) {
  // Display Movements
  calcDisplayMovement(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summery
  calcDisplaySummery(acc);
}
let currentAccount;
//  Event Handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log("LOGIN");
    // Display UI and message 
    labelWelcome.textContent = `welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    //  Clear the input field
    inputLoginUsername.value = inputLoginPin.value = '';
    // Using a method
    inputLoginPin.blur();
    // Update UI
    update(currentAccount);
  };
});
// Transfre money from one user to another 
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receivesAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, receivesAcc);

  if (amount > 0 && receivesAcc && currentAccount.balance >= amount && receivesAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount)
    receivesAcc.movements.push(amount);

    // Update UI
    update(currentAccount);
  }
});
/////////// To request loan //////////////////////////////
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    // Add movements
    currentAccount.movements.push(amount);
  };
  // update UI
  update(currentAccount);
  // To clear the input field
  inputLoanAmount.value=''
}) 

/////////// Close an Account with splice method //////////

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(currentAccount.username===inputCloseUsername.value &&currentAccount.pin===Number(inputClosePin.value)){
    
    const index=accounts.findIndex(acc => acc.username===currentAccount.username)
    // console.log(index);
    accounts.splice(index, 1);
    // console.log(`Account has been closed successfully....`);
    // Hide UI
    containerApp.style.opacity=0;
  };
  inputCloseUsername.value=inputCloseUsername.value='';
});
/////////////////// Sort //////////////////////////////////

let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  calcDisplayMovement(currentAccount.movements,!sorted);
  sorted=!sorted;
}); 


labelBalance.addEventListener('click',function(){
  const movementsUI=Array.from(document.querySelectorAll('.movements__value'),el => Number(el.textContent.replace('€','')));
  console.log(movementsUI);
});


