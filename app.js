const db = firebase.firestore();
const $form = document.querySelector("#formUser");
let containerUsers = document.querySelector("#containerUsers");
let statusEdit = false;
let id = 0;

//actions db

const addUser = (user) => db.collection("users").doc().set(user);
const getUser = (id) => db.collection("users").doc(id).get();
const updateUser = (user, id) => db.collection("users").doc(id).update(user);
const deleteUser = (id) => db.collection("users").doc(id).delete();
const changeUser = (callback) => db.collection("users").onSnapshot(callback);

window.addEventListener("DOMContentLoaded", async (e) => {
  changeUser((querySnapshot) => {
    containerUsers.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      id = doc.id;
      containerUsers.innerHTML += `
      <div class="container my-4">
      <div class="card">
      <div class="body">${user.username}</div>
      <div class="card-footer">${user.email}
      <button class="btn btn-danger btn-delete" data-id="${id}">Delete</button>
      <button class="btn btn-success btn-edit" data-id="${id}">Edit</button>
      </div>
      </div>
      </div>`;
    });
    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        await deleteUser(e.target.dataset.id);
      });
    });

    const btnsEdit = document.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const doc = await getUser(e.target.dataset.id);
        const user = doc.data();
        $form["username"].value = user.username;
        $form["email"].value = user.email;
        id = doc.id;
        statusEdit = true;
      });
    });
  });
});

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData($form);
  const username = formData.get("username");
  const email = formData.get("email");

  const user = {
    username,
    email,
  };
  if (!statusEdit) {
    await addUser(user);
  } else {
    await updateUser(user, id);
  }
  $form["username"].focus();
  $form.reset();
});
