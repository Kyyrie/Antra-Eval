// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
  //const baseUrl = "https://jsonplaceholder.typicode.com";
  const baseUrl = 'http://localhost:3000';
  const todopath = 'todos';

  const getTodos = () =>
    fetch([baseUrl, todopath].join('/')).then((response) => response.json());

  const deleteTodo = (id) =>
    fetch([baseUrl, todopath, id].join('/'), {
      method: 'DELETE',
    });

  const addTodo = (todo) =>
    fetch([baseUrl, todopath].join('/'), {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json());

  const editTodo  = (context,id,done) =>{
    const todo = {
      title: context,
      completed: done,
    };
    return fetch([baseUrl, path, id].join("/"),  {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json());}
   
  


  return {
    getTodos,
    deleteTodo,
    addTodo,
    editTodo,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
  const domstr = {
    todocontainer: '#todolist_container',
    inputbox: '.todolist__input',
    todocontainer2: '#todolist_container2',
    //inputbox2: ".todolist__input2",
    submit:".submit"
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };
  const createTmp = (arr) => {
    let tmp = '';
    arr.forEach((todo) => {
      tmp += `
        <li>
          <span>${todo.id}-${todo.title}</span>
          <button class="deletebtn" id="${todo.id}">X</button>
          <button class="editbtn" id="${todo.id}">E</button>
          <button class="transferbtn" id="${todo.id}">-></button>
          
          
        </li>
      `;
    });
    return tmp;
  };
  const createTmp2 = (arr) => {
    let tmp2 = '';
    arr.forEach((todo) => {
      tmp2 += `
        <li>
          <span>${todo.id}-${todo.title}</span>
          <button class="deletebtn2" id="${todo.id}">X</button>
          <button class="editbtn2" id="${todo.id}">E</button>
          <button class="transferbtn2" id="${todo.id}"><-</button>
          
        </li>
      `;
    });
    return tmp2;
  };

  return {
    render,
    createTmp,
    domstr,
    createTmp2,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
/*const View2 = (() => {
	const domstr = {
		todocontainer: "#todolist_container2",
		inputbox: ".todolist__input2",
	};

	const render = (ele, tmp) => {
		ele.innerHTML = tmp;
	};
	const createTmp = (arr) => {
		let tmp = "";
		arr.forEach((todo) => {
			tmp += `
        <li>
          <span>${todo.id}-${todo.title}</span>
          <button class="deletebtn2" id="${todo.id}">X</button>
        </li>
      `;
		});
		return tmp;
	};

	return {
		render,
		createTmp,
		domstr,
	};
})();
*/

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  const { getTodos, deleteTodo, addTodo, editTodo } = api;

  class Todo {
    constructor(title) {
      this.userId = 2;
      this.completed = false;
      this.title = title;
    }
  }

  class State {
    #todolist = [];

    get todolist() {
      return this.#todolist;
    }
    set todolist(newtodolist) {
      this.#todolist = newtodolist;

      const todocontainer = document.querySelector(view.domstr.todocontainer);
      const tmp = view.createTmp(this.#todolist);
      view.render(todocontainer, tmp);

      /*const tmp2 = view.createTmp2(this.#todolist);
      view.render(todocontainer2, tmp2);*/
    }
  }
  class State2 {
    #todolist = [];

    get todolist() {
      return this.#todolist;
    }
    set todolist(newtodolist) {
      this.#todolist = newtodolist;

      const todocontainer2 = document.querySelector(view.domstr.todocontainer2);
      const tmp2 = view.createTmp2(this.#todolist);
      view.render(todocontainer2, tmp2);
    }
  }

  return {
    getTodos,
    deleteTodo,
    addTodo,
    editTodo,
    State,
    State2,
    Todo,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  const state = new model.State();
  const state2 = new model.State2();



  const deleteTodo = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    const todocontainer2 = document.querySelector(view.domstr.todocontainer2);
    todocontainer.addEventListener('click', (event) => {
      if (event.target.className === 'deletebtn') {
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });
    todocontainer2.addEventListener('click', (event) => {
      if (event.target.className === 'deletebtn2') {
        state2.todolist = state2.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );
        model.deleteTodo(event.target.id);
      }
    });
  };
  const editTodo = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    const todocontainer2 = document.querySelector(view.domstr.todocontainer2);
    todocontainer.addEventListener('click', (event) => {
      if (event.target.className === 'editbtn') {
        model.editTodo(event.target.id);
      }
    });
    todocontainer2.addEventListener('click', (event) => {
      if (event.target.className === 'editbtn') {
        state.todolist = state.todolist.filter(
          (todo) => +todo.id !== +event.target.id
        );
        model.editTodo(event.target.id);
      }
    });
  };
  //document.getElementById("TextFieldId").readOnly=true;

  const addTodo = () => {
    const todocontainer = document.querySelector(view.domstr.todocontainer);
    const todocontainer2 = document.querySelector(view.domstr.todocontainer2);
    const inputbox = document.querySelector(view.domstr.inputbox);
    inputbox.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && event.target.value.trim() !== '') {
        const todo = new model.Todo(event.target.value);
        model.addTodo(todo).then((todofromBE) => {
          //console.log(todofromBE);
          state.todolist = [todofromBE, ...state.todolist];
        });
        event.target.value = '';
      }
    });
    todocontainer.addEventListener('click', (event) => {
      if (event.target.className === 'transferbtn') {
        const todo = new model.Todo(event.target.value);
        model.addTodo(todo).then((todofromBE) => {
          //console.log(todofromBE);
          state2.todolist = [todofromBE, ...state2.todolist];
        });
        event.target.value = '';
      }

    })
    todocontainer2.addEventListener('click', (event) => {
      if (event.target.className === 'transferbtn2' ) {
        const todo = new model.Todo(event.target.value);
        model.addTodo(todo).then((todofromBE) => {
          //console.log(todofromBE);
          state.todolist = [todofromBE, ...state.todolist];
        });
        event.target.value = '';
      }

    })
    
  };

  const init = () => {
    model.getTodos().then((todos) => {
      state.todolist = todos.reverse();
      state2.todolist = todos.reverse();
    });
  };

  const bootstrap = () => {
    init();
    deleteTodo();
    addTodo();
    editTodo();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
