import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface Todo {
  id: number;
  title: string;
}

@Component({
  selector: 'app-root',
  standalone: true, // Specify that this component is standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule,CommonModule] // Add FormsModule to imports

})
export class AppComponent {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  editTodoTitle: string = '';
  editingTodoId: number | null = null;
  //title = "todo_frontend"

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: this.todos.length + 1,
        title: this.newTodoTitle.trim()
      };
      this.todos.push(newTodo);
      this.newTodoTitle = '';
    }
  }

  editTodo(todo: Todo) {
    this.editingTodoId = todo.id;
    this.editTodoTitle = todo.title;
  }

  updateTodo() {
    const todo = this.todos.find(t => t.id === this.editingTodoId);
    if (todo) {
      todo.title = this.editTodoTitle.trim();
      this.editingTodoId = null;
      this.editTodoTitle = '';
    }
  }

  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter(t => t.id !== todo.id);
  }
}
