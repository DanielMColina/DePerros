const api = axios.create({
  baseURL:"https://api.thedogapi.com/v1",
})
api.defaults.headers.common["x-api-key"] = "live_nvt5J7tC1oSqd3B08Tx1FfX5K94TCbBIv9OeYuyibuS08DxvvBzvynOaQupcMBPX" 

// const API_URL_RAMDOM = 'https://api.thedogapi.com/v1/images/search?limit=2';
// const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites/';
// const API_URL_FAVORITES_DELETE = (id)=> `https://api.thedogapi.com/v1/favourites/${id}`;
// const API_KEY = "live_nvt5J7tC1oSqd3B08Tx1FfX5K94TCbBIv9OeYuyibuS08DxvvBzvynOaQupcMBPX"
// const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload"

const spanError= document.getElementById("error");

async function loadRamdomDogs() {
  const {data, status} = await api.get("/images/search?limit=2")

  // const res = await fetch(API_URL_RAMDOM);
  // const data = await res.json();

  if(status !== 200){
    spanError.innerHTML= "hubo un error " + status;
  }
  else{
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');

    img1.src = data[0].url;
    img2.src = data[1].url;
    console.log(data);

    btn1.onclick = ()=> saveFavouritesDog(data[0].id);
    btn2.onclick = ()=>  saveFavouritesDog(data[1].id);
  }
}

async function loadfavouritesDogs() {
  const {data, status} =await api.get("/favourites");

  // const res = await fetch(API_URL_FAVORITES, {
  //   method:"GET",
  //   headers:{
  //     "Content-Type": "application/json",
  //     "x-api-key":API_KEY,
  //   }
  // });
  // const data = await res.json();

  if(status !== 200){
    spanError.innerHTML= "hubo un error" + status;
  } else{
    const ulFavorites = document.querySelector("#favoritesList");
    ulFavorites.innerHTML=""

    data.forEach(dog => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const icon = document.createElement("i");

      li.classList.add("product");
      img.classList.add("product__image");
      btn.classList.add("product__button", "product__button--favorites");
      icon.classList.add("fa-heart","fa-solid")


      btn.appendChild(icon);
      btn.onclick= ()=> deleteFavouritesDog(dog.id);
      img.src = dog.image.url;
      li.appendChild(img)
      li.appendChild(btn)

      ulFavorites.appendChild(li)

    });
  }
}


async function saveFavouritesDog(id){
  const {data, status} =  await api.post("/favourites",{
    image_id: id,
  })

  // const res = await fetch(API_URL_FAVORITES,{
  //   method:"POST",
  //   headers:{
  //     "Content-Type":"application/json",
  //     "x-api-key":API_KEY
  //   },
  //   body:JSON.stringify({
  //     image_id: id
  //   })
  // })

  if(status !== 200){
    spanError.innerHTML= "hubo un error" + status;
  }else{
    console.log("Gardado exitosamente", data.message)
    loadfavouritesDogs();
  }

}

async function deleteFavouritesDog(id){
  const {data, status} =await api.delete(`favourites/${id}`);


  // const res =await fetch(API_URL_FAVORITES_DELETE(id),{
  //   method:"DELETE",
  //   headers:{
  //     "x-api-key":API_KEY
  //   }
  // });
  // const data = await res.json();

  if(status !== 200){
    spanError.innerHTML= "hubo un error" + status;
  }else{
    console.log("borrado exitosamente");
    loadfavouritesDogs();
  }
}

async function uploadDogPhoto(){
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);

  const {data,status} = await api.post("/images/upload",formData)

  // const res = await fetch(API_URL_UPLOAD,{
  //   method:"POST",
  //   headers:{
  //     "x-api-key":API_KEY,
  //   },
  //   body: formData,
  // });

  // const data = await res.json()
  // console.log(data)

  if (status !== 201) {
    spanError.innerHTML = `Hubo un error al subir perrito: ${status}`
}
else {
    console.log("Foto de perrito cargada :)");
    saveFavouritesDog(data.id)
}

}

function showPreviewUploadPhoto(){
  const imgPreview = document.querySelector("#uploadDogPhotoPreveiw");
  const inputUploadPhoto = document.querySelector("#file");
  const archivo = inputUploadPhoto.files[0];

  if (archivo) {
    const urlImagen = URL.createObjectURL(archivo);  
    imgPreview.classList.remove("inactive");
    imgPreview.src = urlImagen;
  } else {
    console.log('No se seleccionó ninguna imagen.');
    imgPreview.src = "";
    imgPreview.classList.add("inactive");
  }
}


loadRamdomDogs();
loadfavouritesDogs();