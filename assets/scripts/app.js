/* -using XMLHttpRequest-AJAX- */

const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const fetchBtn = document.querySelector("#available-posts button");
const form = document.querySelector("#new-post form");

/*-------------------------------------------------------------------------------------*/
//Promisfying httpRequest with XMLHttpRequest:
function sendHttpRequest(method, url, data) {
  promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest(); //empty container
    //xhr.setRequestHeader("Content-Type", "application/json");
    xhr.open(method, url); //Initializes a request.
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        //for server side errors
        resolve(JSON.parse(xhr.response));
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      //console.log(error);
      //console.log(xhr.status);
      reject(new Error("Failed to send Request!")); //it works with network errors
    };
    xhr.send(JSON.stringify(data));
  });
  return promise;
}

/*-------------------------------------------------------------------------------------*/
// Function to fetch data Get+GET by ID
async function fetchData(postId) {
  try {
    listElement.innerHTML = "";
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
  listElement.appendChild(itemEl);
}
/*-------------------------------------------------------------------------------------*/
//'POST' verb:

async function createPost(title, content) {
  try {
    const randomId = Math.floor(Math.random() * 100) + 1;
    const data = {
      title: title,
      body: content,
      userId: randomId,
    };

    sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", data);
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
    listElement.addEventListener("click", (event) => {
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

/*
 * xhr object
 * open(method,url)
 * eventlisner
 * send()
 */
//"https://jsonplaceholder.typicode.com/posts" //DUMMY API
/*-------------------------------------------------------------------------------------*/
