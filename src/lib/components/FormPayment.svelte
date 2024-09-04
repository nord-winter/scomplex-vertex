<script>
//   import { onMount } from 'svelte';

//   let card = {
//     name: '',
//     number: '',
//     expiration_month: '',
//     expiration_year: '',
//     security_code: ''
//   };

//   onMount(() => {
//     Omise.setPublicKey('YOUR_PUBLIC_KEY');
//   });

//   async function handleSubmit(event) {
//     event.preventDefault();
//     Omise.createToken('card', card, (statusCode, response) => {
//       if (response.object === 'error') {
//         console.error(response.message);
//       } else {
//         // Отправьте токен на сервер для завершения платежа
//         console.log('Token:', response.id);
//         processPayment(response.id);
//       }
//     });
//   }

//   async function processPayment(token) {
//     // Логика для отправки токена на сервер и обработки платежа
//     try {
//       const res = await fetch('/process-payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token }),
//       });

//       if (!res.ok) {
//         throw new Error('Ошибка при обработке платежа');
//       }

//       console.log('Payment successful');
//     } catch (error) {
//       console.error(error);
//     }
//   }



//   OmiseCard.configure({
//     publicKey: "OMISE_PUBLIC_KEY"
//   });

//   var button = document.querySelector("#checkoutButton");
//   var form = document.querySelector("#checkoutForm");

//   button.addEventListener("click", (event) => {
//     event.preventDefault();
//     OmiseCard.open({
//       amount: 12345,
//       currency: "THB",
//       defaultPaymentMethod: "credit_card",
//       onCreateTokenSuccess: (nonce) => {
//           if (nonce.startsWith("tokn_")) {
//               form.omiseToken.value = nonce;
//           } else {
//               form.omiseSource.value = nonce;
//           };
//         form.submit();
//       }
//     });
//   });




</script>


