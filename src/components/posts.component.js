import { apiService } from "../services/api.service";
import { Component } from "../core/component";
import { TransformService } from "../services/transform.service";
import { renderPost } from "../templates/post.template";

export class PostsComponent extends Component {
  constructor(id, { loader }) {
    super(id);
    this.loader = loader;
  }

  init() {
    this.$el.addEventListener("click", buttonHandler.bind(this));
  }

  async onShow() {
    this.loader.show();
    const fbData = await apiService.fetchPosts();
    const posts = TransformService.fbObjectToArray(fbData);
    const html = posts.map((post) => renderPost(post, { withBtn: true }));
    this.loader.hide();
    this.$el.insertAdjacentHTML("afterbegin", html.join(" "));
  }

  onHide() {
    this.$el.innerHTML = "";
  }
}

function buttonHandler(event) {
  const $el = event.target;
  const id = $el.dataset.id;
  const title = $el.dataset.title;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (id) {
    const candidate = favorites.find( p => p.id === id);
   
    if (candidate) {
      $el.textContent = "Зберегти";
      $el.classList.add("button-primary");
      $el.classList.remove("button-danger");
      favorites = favorites.filter((p) => p.id !== id);
    } else {
      $el.classList.remove("button-primary");
      $el.classList.add("button-danger");
      $el.textContent = "Видалити";
      favorites.push({ id, title });
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}
