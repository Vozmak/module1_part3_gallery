if (!localStorage.token) window.location.href = "../index.html";

if (localStorage.timestamp < Date.now()) {
  localStorage.removeItem("token");
  localStorage.removeItem("timestamp");
  window.location.href = "../index.html";
}

displayImgList();

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

    return alert(error.errorMessage);
  }

  const jsonImgList = await imgList.json();

  for (let img of jsonImgList.objects) {
    let newImg = document.createElement("img");
    newImg.src = img;
    gallery.insertAdjacentElement("beforeend", newImg);
  }

  localStorage.setItem("page", page);
}
