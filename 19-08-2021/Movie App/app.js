class Movies {
  constructor(title, releaseDate, rating) {
    this.title = title;
    this.releaseDate = releaseDate;
    this.rating = rating;
  }

  addMovie() {
    const id = 0;
    let movieObject = {};
    movieObject.original_title = this.title;
    movieObject.release_date = this.releaseDate;
    movieObject.rating = this.rating;
    this.saveDataToLocalStorage(movieObject);
  }

  saveDataToLocalStorage(data) {
    if(Object.keys(data).length) {
      var a = [];
      a = JSON.parse(localStorage.getItem('session')) || [];
      data.id = a.length+1;
      a.push(data);
      localStorage.setItem('session', JSON.stringify(a));
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      if(a.length == 1) {
        this.showMovies();
      } else if(a.length > 1) {
        this.clearBox(false);
      }
    }
  }

  clearBox(rerender) {
      var mainElement = document.getElementById("main");
      var subMainElement = document.getElementById("submain");
      if(rerender == false) {
        if(typeof mainElement.parentNode.children[1] !== undefined) {
          console.log('new one', mainElement.parentNode.children[0], typeof mainElement.parentNode.children[0]);
          console.log('mainElement.parentNode.removeChild(mainElement.parentNode.children[1])', mainElement.parentNode.children[1]);
          console.log('typeof mainElement.parentNode.removeChild(mainElement.parentNode.children[1])', typeof mainElement.parentNode.children[1]);
          mainElement.parentNode.removeChild(mainElement.parentNode.children[1]);
        } else {
          subMainElement.parentNode.removeChild(subMainElement.parentNode.children[1]);
        }
      } else {
        if(typeof mainElement.parentNode.children[0] !== undefined) {
          console.log('new one', mainElement.parentNode.children[0], typeof mainElement.parentNode.children[0]);
          console.log('mainElement.parentNode.removeChild(mainElement.parentNode.children[1])', mainElement.parentNode.children[1]);
          console.log('typeof mainElement.parentNode.removeChild(mainElement.parentNode.children[1])', typeof mainElement.parentNode.children[1]);
          mainElement.parentNode.removeChild(mainElement.parentNode.children[0]);
        } else {
          subMainElement.parentNode.removeChild(subMainElement.parentNode.children[0]);
        }
      }
      this.showMovies();
  }

  showMovies() {
    let storedArr = JSON.parse(localStorage.getItem('session')) || [];
    let mainExists = !!document.getElementById("main");
    if(!mainExists) {
      const main = document.createElement("div");
      main.setAttribute('id','main');

      storedArr.forEach((element) => {
        var editMovieSub = document.createElement("button");
        var deleteMovieSub = document.createElement("button");
        editMovieSub.setAttribute('id', `editMovieSub${element.id}`);
        deleteMovieSub.setAttribute('id', `deleteMovieSub${element.id}`);
        const submain = document.getElementById('submain');
        const el = document.createElement("div");
        const id = document.createElement("h2");
        const title = document.createElement("h2");
        const releaseDate = document.createElement("h4");
        const rating = document.createElement("h4");
        editMovieSub.style.cssText = `display: block
            margin: 10px;
            padding: 10px;`;
        deleteMovieSub.style.cssText = `display: block
            margin: 10px;
            padding: 10px;`;
        editMovieSub.innerHTML = 'Edit';
        deleteMovieSub.innerHTML = 'Delete';
        id.innerHTML = `ID: ${element.id}`;
        title.innerHTML = `Movie: ${element.original_title}`;
        releaseDate.innerHTML = `Release Date: ${element.release_date}`;
        rating.innerHTML = `Rating: ${element.rating}`;
        
        el.appendChild(id);
        el.appendChild(title);
        el.appendChild(releaseDate);
        el.appendChild(rating);
        el.appendChild(deleteMovieSub);
        el.appendChild(editMovieSub);
        main.appendChild(el);
        submain.append(main);
      }); 
    } else {
      console.log('storedArr', storedArr);
      const main = document.getElementById("main");
      storedArr.forEach((element) => {
        var editMovie = document.createElement("button");
        var deleteMovie = document.createElement("button");
        editMovie.setAttribute('id', `editMovie${element.id}`);
        deleteMovie.setAttribute('id', `deleteMovie${element.id}`);
        // var editMovie = document.getElementById("editMovie");
        // var deleteMovie = document.getElementById("deleteMovie");
        const el = document.createElement("div");
        const id = document.createElement("h2");
        const title = document.createElement("h2");
        const releaseDate = document.createElement("h4");
        const rating = document.createElement("h4");

        editMovie.style.cssText = `display: block
            margin: 10px;
            padding: 10px;`;
        deleteMovie.style.cssText = `display: block
            margin: 10px;
            padding: 10px;`;
        editMovie.innerHTML = 'Edit';
        deleteMovie.innerHTML = 'Delete';
        id.innerHTML = `ID: ${element.id}`;
        title.innerHTML = `Movie: ${element.original_title}`;
        releaseDate.innerHTML = `Release Date: ${element.release_date}`;
        rating.innerHTML = `Rating: ${element.rating}`;
        
        el.appendChild(id);
        el.appendChild(title);
        el.appendChild(releaseDate);
        el.appendChild(rating);
        el.appendChild(deleteMovie);
        el.appendChild(editMovie);
        main.appendChild(el);
      });
    }
  }

  deleteMovie(deleteID) {
    var updatedData = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : [];
    var index;
    for (var i = 0; i < updatedData.length; i++) {
      if (updatedData[i].id == deleteID) {
        index=i;
        break;
      }
    }
    if(index === undefined) return 
    updatedData.splice(index, 1);
    localStorage.setItem('session', JSON.stringify(updatedData));
    var newData = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : [];
    if(newData.length == 0) {
      var mainElement = document.getElementById("main");
      mainElement.parentNode.removeChild(mainElement.parentNode.children[1]);
      localStorage.clear();
    } else {
      // if(updatedData.length == 1) {
      //   console.log('reaching if');
      //   this.showMovies();
      // } else if(updatedData.length > 1) {
      //   console.log('reaching else');
      this.clearBox(true);
      // }
    }
  }

  editMovie(editID) {
    console.log('Reaching here', editID);
    var modal = document.getElementById("updateModal");
    modal.style.display = "block";
    const updateMovieForm = document.getElementById("updateMovieForm");
    console.log('updateMovieForm', updateMovieForm);
    let storedArr = JSON.parse(localStorage.getItem('session')) || [];
    for (var i = 0; i < storedArr.length; i++) {
      if (storedArr[i].id == editID) {
        console.log('updatedData[i]', storedArr[i]);
        updateMovieForm.elements[0].value = storedArr[i].id;
        updateMovieForm.elements[1].value = storedArr[i].original_title;
        updateMovieForm.elements[2].value = storedArr[i].release_date;
        updateMovieForm.elements[3].value = storedArr[i].rating;
        event.preventDefault();
      }
    }
    document.getElementById("updateID").readOnly = true;
    document.getElementById("updateMovieName").readOnly = true;
    document.getElementById("updateReleaseDate").readOnly = true;
  }

  updateMovie(movieID, movieName, movieRelease, movieRating) {
    let storedArr = JSON.parse(localStorage.getItem('session')) || [];
    for (var i = 0; i < storedArr.length; i++) {
      if (storedArr[i].id == movieID) {
        storedArr[i].rating = movieRating;
        event.preventDefault();
      }
    }
    localStorage.setItem('session', JSON.stringify(storedArr));
    console.log('after', storedArr);
    var modal = document.getElementById("updateModal");
    modal.style.display = "none";
    this.clearBox(false);
  }
}

if (performance.navigation.type == performance.navigation.TYPE_RELOAD || window.closed) {
  localStorage.clear();
}

document.querySelector("#addNewMovie").addEventListener("click", (event) => {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  var close = document.getElementById("close");
  close.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

const addMovieForm = document.getElementById("addMovieForm");
addMovieForm.addEventListener("submit", (event) => {
  let movieName = addMovieForm.elements[0].value;
  let movieRelease = addMovieForm.elements[1].value;
  let movieRating = addMovieForm.elements[2].value;
  console.log('reaching here', movieName, movieRelease, movieRating);
  let addMovie = new Movies(movieName, movieRelease, movieRating);
  addMovie.addMovie();
  addMovieForm.elements[0].value = '';
  addMovieForm.elements[1].value = '';
  addMovieForm.elements[2].value = 'Select your option';
  event.preventDefault();
});

const updateMovieForm = document.getElementById("updateMovieForm");
updateMovieForm.addEventListener("submit", (event) => {
  let movieID = updateMovieForm.elements[0].value;
  let movieName = updateMovieForm.elements[1].value;
  let movieRelease = updateMovieForm.elements[2].value;
  let movieRating = updateMovieForm.elements[3].value;
  console.log('here', updateMovieForm.elements);
  console.log('reaching here', movieName, movieRelease, movieRating);
  let updateMovie = new Movies();
  updateMovie.updateMovie(movieID, movieName, movieRelease, movieRating);
  event.preventDefault();
});

document.body.addEventListener('click', (event) => {
  if(event.target.id.includes('deleteMovieSub')) {
    let id = event.target.id.split('');
    let deleteMovie = new Movies();
    deleteMovie.deleteMovie(id[id.length-1]);
  };

  if(event.target.id.includes('deleteMovie')) {
    let id = event.target.id.split('');
    let deleteMovie = new Movies();
    deleteMovie.deleteMovie(id[id.length-1]);
  };
});

document.body.addEventListener('click', (event) => {
  if(event.target.id.includes('editMovieSub')) {
    let id = event.target.id.split('');
    let editMovie = new Movies();
    editMovie.editMovie(id[id.length-1]);
  };

  if(event.target.id.includes('editMovie')) {
    let id = event.target.id.split('');
    let editMovie = new Movies();
    editMovie.editMovie(id[id.length-1]);
  };
});

