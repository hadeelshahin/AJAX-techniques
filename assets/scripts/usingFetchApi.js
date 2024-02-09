/* -using-fetch-API-AJAX- */

const listEl = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const fetchBtn = document.querySelector("#available-posts button");
const form = document.querySelector("#new-post form");

function sendHttpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    //body: JSON.stringify(data),
    body: data,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error("Something went wrong-server side");
        });
      }
    })
    .catch((error) => {
      throw error; // Throw the actual error received
    });
}

/*-------------------------------------------------------------------------------------*/
async function fetchData(postId) {
  try {
    listEl.innerHTML = "";
    document.getElementById("theId").value = null;
    const response = await sendHttpRequest(
      "GET",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    const posts = response;
    if (posts.length > 1) {
      posts.forEach((post) => renderPost(post));
    } else {
      renderPost(posts); //fetch by id
    }
  } catch (error) {
    alert(error.message);
  }
}
function renderPost(post) {
  const itemEl = document.importNode(postTemplate.content, true);
  itemEl.querySelector("h2").textContent = post.title.toUpperCase();
  itemEl.querySelector("p").textContent = post.body;
  itemEl.querySelector("li").id = post.id;
  listEl.appendChild(itemEl);
}
/*-------------------------------------------------------------------------------------*/
async function createPost(title, content) {
  try {
    const randomId = Math.floor(Math.random() * 100) + 1;
    const data = {
      title: title,
      body: content,
      userId: randomId,
    };
    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", content);
    fd.append("userId", randomId);

    sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", fd);
  } catch (error) {
    alert(error.message);
  }
}
async function fetchingUserInputs() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const userTitle = event.currentTarget.querySelector("#title").value;
    const userConten = event.currentTarget.querySelector("#content").value;
    if (userTitle.trim() === "" || userConten.trim() === "") {
      alert("Invalid inputs! Please try again.");
    } else {
      createPost(userTitle, userConten);
      event.currentTarget.querySelector("#title").value = "";
      event.currentTarget.querySelector("#content").value = "";
    }
  });
}

/*-------------------------------------------------------------------------------------*/
//'DELETE verb:
async function deleteItem() {
  try {
    listEl.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        console.log("CLICKED!!");
        const postId = event.target.closest("li").id;
        console.log(postId);
        sendHttpRequest(
          "DELETE",
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        event.target.closest("li").remove();
      }
    });
  } catch (error) {
    alert(error.message);
  }
}
/*-------------------------------------------------------------------------------------*/
class App {
  static init() {
    fetchBtn.addEventListener("click", () => {
      const fetchId = document.getElementById("theId").value;
      fetchData(fetchId);
    });
    fetchingUserInputs();
    deleteItem();
  }
}
//// Start the application
App.init();
