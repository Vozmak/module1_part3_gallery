if (!localStorage.token) window.location.href = "../index.html";

if (localStorage.timestamp < Date.now()) {
  localStorage.removeItem("token");
  localStorage.removeItem("timestamp");

  window.location.href = "../index.html";
}

displayImgList();

previous.onclick = function() {
  window.location.href = `gallery.html?page=${localStorage.page - 1}`
};

next.onclick = function() {
  window.location.href = `gallery.html?page=${+localStorage.page + 1}`
};

async function displayImgList() {
  const gallery = document.querySelector(".gallery")

  const searchParams = new URL(window.location.href).searchParams;
  let page = searchParams.get("page") || localStorage.page || 1;

  const imgList = await fetch("https://glq7fjiy07.execute-api.us-east-1.amazonaws.com/api/gallery?page=" + page, {
    headers: {
      "Authorization": localStorage.token
    }
  });

  if (imgList.status !== 200) {
    let error = await imgList.json();
    window.location.href = `gallery.html?page=${localStorage.page}`;

    return alert(error.errorMessage);
  }

  const jsonImgList = await imgList.json();

  for (let img of jsonImgList.objects) {
    let newImg = document.createElement("img");
    newImg.src = img;
    gallery.insertAdjacentElement("beforeend", newImg);
  }

  let div = document.querySelector(".page");
  let p = div.querySelector("p");
  p.textContent = `Страница ${page} из ${jsonImgList.total}`;

  localStorage.setItem("page", page);
}
