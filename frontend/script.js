async function upload() {
  let file = document.getElementById("file").files[0];
  let theme = document.getElementById("theme").value;

  let formData = new FormData();
  formData.append("image", file);
  formData.append("theme", theme);

  let res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    body: formData
  });

  let data = await res.json();

  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  data.forEach(img => {
    let el = document.createElement("img");
    el.src = img;
    el.style.width = "200px";
    resultDiv.appendChild(el);
  });
}