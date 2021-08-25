const form = document.getElementById("authorization")

form.addEventListener("submit", async event => {
  event.preventDefault()

  const email = form.elements.email;
  const password = form.elements.password;
  const user = {
    "email": email.value,
    "password": password.value
  };

  let result = await authorizationUser(user);

  if (result.errorMessage) {
    email.value = "";
    password.value = "";
    return alert(result.errorMessage)
  }

  const {token} = result;

  if (!localStorage.token) {
    localStorage.setItem("token", token);
    setTimeout( () => {
      localStorage.removeItem("token");
    }, 6e5)
  }
  console.log(token);
});

async function authorizationUser(user) {
  if (!userValidation(user)) {
    const incorrect = document.querySelector(".incorrect");
    incorrect.textContent = 'Некоректный ввод. Проверьте привильность email и пароля.';
    setTimeout( () => {
      incorrect.textContent = '';
    }, 7000);
    return {
      "errorMessage": "Некоректный ввод. Проверьте привильность email и пароля."
    };
  }

  let response = await fetch('https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/login', {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(user)
  });

  return await response.json()
}

function userValidation({email, password}) {
  const emailRegExp = /^[a-z\d]+@[a-z]+\.[a-z]+$/i;
  const passRegExp = /^[a-z\d]{8}$/i;

  return emailRegExp.test(email)? passRegExp.test(password) : false;
}
